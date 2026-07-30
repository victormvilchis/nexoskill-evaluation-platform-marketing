import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const gitignore = await readFile(new URL('../.gitignore', import.meta.url), 'utf8');
const repositoryGuard = await readFile(new URL('../scripts/repository-guard.mjs', import.meta.url), 'utf8');
const brandCleanliness = await readFile(new URL('./brand-cleanliness.test.mjs', import.meta.url), 'utf8');

test('los respaldos operativos no pueden volver a versionarse', () => {
  assert.match(gitignore, /^\.update-backups\/$/m);
  assert.match(repositoryGuard, /'\.update-backups'/);
  assert.match(repositoryGuard, /\(\^\|\\\/\)\\\.update-backups\\\//);
});

test('la limpieza de marca reporta archivos y evita falsos positivos de sans-serif', () => {
  assert.match(brandCleanliness, /violations\.join\('\\n'\)/);
  assert.match(brandCleanliness, /ui-sans-serif/);
  assert.match(brandCleanliness, /retiredReferencePattern/);
});
