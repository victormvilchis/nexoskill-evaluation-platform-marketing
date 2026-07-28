import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../../', import.meta.url)));
const outputDir = join(root, 'build');
const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

async function digest(path) {
  const content = await readFile(path);
  return createHash('sha256').update(content).digest('hex');
}

let commit = process.env.APP_COMMIT || 'unknown';
if (commit === 'unknown') {
  try {
    commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    // El ZIP de actualización puede no incluir .git.
  }
}

const candidates = [
  join(root, 'dist'),
  join(root, 'backend', 'target'),
];
const artifacts = [];
for (const candidate of candidates) {
  try {
    if (!(await stat(candidate)).isDirectory()) continue;
    for (const file of await walk(candidate)) {
      const details = await stat(file);
      artifacts.push({
        path: relative(root, file).replaceAll('\\', '/'),
        bytes: details.size,
        sha256: await digest(file),
      });
    }
  } catch {
    // El manifiesto sigue siendo útil aunque un build todavía no exista.
  }
}

await mkdir(outputDir, { recursive: true });
const manifest = {
  application: packageJson.name,
  version: packageJson.version,
  commit,
  generatedAt: new Date().toISOString(),
  artifacts,
};
await writeFile(join(outputDir, 'release-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Manifiesto generado con ${artifacts.length} artefactos.`);
