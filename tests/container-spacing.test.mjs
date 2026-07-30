import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');

test('el contenedor global aprovecha mejor el ancho en escritorio', () => {
  assert.match(css, /--container:\s*1280px;/);
  assert.match(css, /\.container\s*\{[\s\S]*?width:\s*min\(var\(--container\), calc\(100% - 32px\)\);/);
});

test('el margen móvil conserva una separación segura', () => {
  assert.match(css, /@media \(max-width: 680px\)[\s\S]*?\.container\s*\{\s*width:\s*min\(var\(--container\), calc\(100% - 28px\)\);/);
});
