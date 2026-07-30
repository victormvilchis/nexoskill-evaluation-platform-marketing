import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const version = '1.1.0';

const [pkgText, pom, application, envExample, prodExample, gitignore] = await Promise.all([
  read('package.json'),
  read('backend/pom.xml'),
  read('backend/src/main/resources/application.yml'),
  read('.env.example'),
  read('.env.production.example'),
  read('.gitignore'),
]);

const pkg = JSON.parse(pkgText);
assert.equal(pkg.version, version, 'La versión del frontend no corresponde a 1.1.0.');
assert.match(pom, new RegExp(`<version>${version.replaceAll('.', '\\.')}<\\/version>`), 'La versión del backend no corresponde a 1.1.0.');
assert.match(application, /version: 1\.1\.0/, 'La información Actuator no corresponde a 1.1.0.');

for (const variable of ['VITE_SITE_URL', 'VITE_API_URL', 'DB_URL', 'DB_USERNAME', 'DB_PASSWORD', 'IP_HASH_SALT']) {
  assert.match(envExample, new RegExp(`^${variable}=`, 'm'), `Falta ${variable} en .env.example.`);
}
for (const variable of ['VITE_SITE_URL', 'DB_URL', 'DB_USERNAME', 'DB_PASSWORD', 'CORS_ALLOWED_ORIGINS', 'IP_HASH_SALT']) {
  assert.match(prodExample, new RegExp(`^${variable}=`, 'm'), `Falta ${variable} en .env.production.example.`);
}
for (const ignored of ['.env', '.env.*', '.runtime/', 'logs/', 'playwright-report/', 'test-results/', 'build/', 'backups/', '.deploy/']) {
  assert.ok(gitignore.includes(ignored), `Falta excluir ${ignored} en .gitignore.`);
}

const forbidden = [
  /Iniciar sesión/i,
  /href=["']#["']/i,
];
const ignoredDirs = new Set(['node_modules', 'dist', 'target', '.git', 'playwright-report', 'test-results']);
const ignoredFiles = new Set(['.env.example', '.env.production.example', 'CHANGELOG.md', 'RELEASE_NOTES.md']);

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

const scanRoots = [
  new URL('src/', root).pathname,
  new URL('backend/src/main/', root).pathname,
  new URL('index.html', root).pathname,
  new URL('nginx.conf', root).pathname,
  new URL('docker-compose.yml', root).pathname,
  new URL('docker-compose.production.yml', root).pathname,
];

const scanFiles = [];
for (const scanRoot of scanRoots) {
  const entries = scanRoot.endsWith('/') ? await walk(scanRoot) : [scanRoot];
  scanFiles.push(...entries);
}

for (const file of scanFiles) {
  const name = file.split(/[\\/]/).at(-1);
  if (ignoredFiles.has(name) || !/\.(?:ts|tsx|js|mjs|java|yml|yaml|json|html|css|ps1|cmd|md|conf)$/i.test(file)) continue;
  const content = await readFile(file, 'utf8');
  for (const pattern of forbidden) {
    assert.doesNotMatch(content, pattern, `Patrón no permitido ${pattern} en ${file}`);
  }
}

console.log('Release check 1.1.0 completado.');
