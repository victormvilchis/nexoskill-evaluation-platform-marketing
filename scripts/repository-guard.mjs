import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));

const normalize = (path) => relative(root, path).split(sep).join('/');
const ignoredDirectories = new Set([
  '.git',
  '.update-backups',
  'node_modules',
  'dist',
  'target',
  '.runtime',
  'logs',
  'playwright-report',
  'test-results',
  'blob-report',
  'coverage',
  'build',
  'backups',
  '.deploy',
]);

const allowedEnvironmentExamples = new Set([
  '.env.example',
  '.env.production.example',
]);
const forbiddenTrackedPaths = [
  /(^|\/)\.env$/i,
  /(^|\/)\.env\.(?:local|production|development|test)$/i,
  /(^|\/)backend\/\.env$/i,
  /(^|\/)\.runtime\//i,
  /(^|\/)\.update-backups\//i,
  /(^|\/)logs\//i,
  /(^|\/)playwright-report\//i,
  /(^|\/)test-results\//i,
  /(^|\/)blob-report\//i,
  /(^|\/)dist\//i,
  /(^|\/)backend\/target\//i,
  /(^|\/)node_modules\//i,
  /(^|\/)build\//i,
  /(^|\/)backups\//i,
  /(^|\/)\.deploy\//i,
  /\.log$/i,
];
const environmentSecretNames = new Set([
  'DB_PASSWORD',
  'MAIL_PASSWORD',
  'IP_HASH_SALT',
  'JWT_SECRET',
  'API_KEY',
  'ACCESS_TOKEN',
  'PRIVATE_KEY',
]);

const safePlaceholderValues = new Set([
  '',
  'changeme',
  'change-me',
  'replace-me',
  'example',
  'placeholder',
  '<required>',
  '<secret>',
  '${secret}',
]);

const sourceExtensions = new Set([
  '.ts', '.tsx', '.js', '.mjs', '.java', '.yml', '.yaml', '.properties', '.json', '.html', '.xml', '.conf', '.ps1', '.cmd', '.sh',
]);
const sourceRoots = [
  'src/',
  'backend/src/main/',
  'index.html',
  'nginx.conf',
  'docker-compose.yml',
  'docker-compose.production.yml',
  'start-marketing.ps1',
  'stop-marketing.ps1',
  'check-marketing.ps1',
  'scripts/deployment/',
];

const findings = [];
async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const fullPath = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}
async function getTrackedFiles() {
  try {
    const output = execFileSync('git', ['ls-files', '-z'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return output.split('\0').filter(Boolean);
  } catch {
    return (await walk(root)).map(normalize);
  }
}

function isForbiddenTrackedPath(path) {
  if (allowedEnvironmentExamples.has(path)) return false;
  return forbiddenTrackedPaths.some((pattern) => pattern.test(path));
}
function isSourceCandidate(path) {
  if (!sourceExtensions.has(extname(path).toLowerCase())) return false;
  return sourceRoots.some((candidate) => candidate.endsWith('/') ? path.startsWith(candidate) : path === candidate);
}

function stripWrappingQuotes(value) {
  const trimmed = value.trim();
  if (trimmed.length >= 2 && ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'")))) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}
function inspectEnvironmentFile(path, content) {
  const isExample = allowedEnvironmentExamples.has(path);
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || line.trimStart().startsWith('#')) continue;

    const [, name, rawValue] = match;
    if (!environmentSecretNames.has(name)) continue;
    const value = stripWrappingQuotes(rawValue);
    const normalizedValue = value.toLowerCase();
    const isSafePlaceholder = safePlaceholderValues.has(normalizedValue) || /^\$\{[A-Z0-9_]+(?::[^}]*)?\}$/.test(value);

    if (!isSafePlaceholder) {
      findings.push(`${path}:${index + 1}: ${name} contiene un valor sensible${isExample ? ' en un archivo de ejemplo' : ''}.`);
    }
  }
}
function inspectSourceFile(path, content) {
  const patterns = [
    {
      name: 'clave privada embebida',
      expression: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    },
    {
      name: 'credencial hardcodeada',
      expression: /\b(?:password|passwd|secret|api[_-]?key|access[_-]?token)\b\s*[:=]\s*["'][^"'\r\n]{8,}["']/i,
    },
    {
      name: 'URL con credenciales embebidas',
      expression: /\b(?:https?|jdbc:[a-z0-9:]+):\/\/[^\s/@:]+:[^\s/@]+@/i,
    },
  ];
  for (const { name, expression } of patterns) {
    if (expression.test(content)) findings.push(`${path}: ${name}.`);
  }
}

const trackedFiles = await getTrackedFiles();

for (const path of trackedFiles) {
  const absolutePath = resolve(root, path);
  if (!existsSync(absolutePath)) continue;

  if (isForbiddenTrackedPath(path)) findings.push(`${path}: archivo local o sensible versionado.`);

  if (allowedEnvironmentExamples.has(path) || /(^|\/)\.env(?:\.[^/]+)?$/i.test(path)) {
    inspectEnvironmentFile(path, await readFile(absolutePath, 'utf8'));
  }

  if (isSourceCandidate(path)) {
    inspectSourceFile(path, await readFile(absolutePath, 'utf8'));
  }
}
if (findings.length > 0) {
  console.error('Repository guard encontró elementos que deben corregirse:');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exitCode = 1;
} else {
  console.log(`Repository guard aprobado. ${trackedFiles.length} archivos revisados.`);
}
