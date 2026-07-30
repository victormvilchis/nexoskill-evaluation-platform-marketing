import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');

test('los heroes internos mantienen el breadcrumb cerca del header en escritorio', () => {
  assert.match(css, /\.page-hero\s*\{[\s\S]*?padding:\s*56px 0 96px;/);
  assert.match(css, /\.subpage-hero,\s*\.contact-hero\s*\{[\s\S]*?padding:\s*64px 0 96px;/);
  assert.match(css, /\.quote-hero\s*\{[\s\S]*?padding:\s*56px 0 96px;/);
});

test('los heroes internos usan un espacio superior compacto en móvil', () => {
  assert.match(css, /@media \(max-width: 680px\)[\s\S]*?\.page-hero\s*\{\s*padding:\s*40px 0 72px;/);
  assert.match(css, /@media \(max-width: 680px\)[\s\S]*?\.subpage-hero,\s*\.contact-hero\s*\{\s*padding:\s*44px 0 72px;/);
  assert.match(css, /@media \(max-width: 680px\)[\s\S]*?\.quote-hero\s*\{\s*padding:\s*40px 0 72px;/);
});

test('el breadcrumb conserva una separación compacta con el contenido del hero', () => {
  assert.match(css, /\.breadcrumbs\s*\{[\s\S]*?margin-bottom:\s*18px;/);
  assert.match(css, /@media \(max-width: 680px\)[\s\S]*?\.breadcrumbs\s*\{\s*margin-bottom:\s*14px;/);
});
