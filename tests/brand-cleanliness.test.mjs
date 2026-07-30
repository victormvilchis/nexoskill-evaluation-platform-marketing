import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excludedDirectories = new Set(['.git', 'node_modules', 'dist', 'target', 'playwright-report', 'test-results', '.runtime', 'logs']);
const binaryExtensions = new Set(['.png', '.ico', '.jpg', '.jpeg', '.webp', '.zip', '.jar', '.class']);
const retiredBrand = ['nexo', 'skill'].join('');
const retiredReferencePrefix = ['N', 'S', '-'].join('');

async function textFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (excludedDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await textFiles(absolute));
    else if (!binaryExtensions.has(path.extname(entry.name).toLowerCase())) files.push(absolute);
  }
  return files;
}

test('el repositorio no conserva referencias de la identidad anterior', async () => {
  const violations = [];
  for (const file of await textFiles(root)) {
    const content = await readFile(file, 'utf8');
    if (content.toLowerCase().includes(retiredBrand) || content.includes(retiredReferencePrefix)) {
      violations.push(path.relative(root, file).replaceAll('\\', '/'));
    }
  }
  assert.deepEqual(violations, []);
});

test('la referencia pública y el título de pestaña usan la marca Valtieris', async () => {
  const leadService = await readFile(path.join(root, 'backend/src/main/java/com/valtieris/marketing/service/LeadService.java'), 'utf8');
  const reference = await readFile(path.join(root, 'backend/src/main/java/com/valtieris/marketing/service/ProspectReference.java'), 'utf8');
  const index = await readFile(path.join(root, 'index.html'), 'utf8');
  const seo = await readFile(path.join(root, 'src/seo/Seo.tsx'), 'utf8');
  assert.match(leadService, /ProspectReference\.fromId/);
  assert.match(reference, /PREFIX = "VLT-"/);
  assert.match(index, /<title>Valtieris<\/title>/);
  assert.match(seo, /document\.title = siteConfig\.name/);
});
