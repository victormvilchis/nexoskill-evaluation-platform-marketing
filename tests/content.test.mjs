import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

async function walk(directory) {
  const entries = await readdir(new URL(`../${directory}/`, import.meta.url), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = join(directory, entry.name).replaceAll('\\', '/');
    if (entry.isDirectory()) files.push(...await walk(relative));
    else if (['.ts', '.tsx'].includes(extname(entry.name))) files.push(relative);
  }
  return files;
}

test('la Home contiene la propuesta de valor y sus secciones principales', async () => {
  const home = await read('src/pages/HomePage.tsx');
  assert.match(home, /Evalúa, desarrolla y certifica talento tecnológico/);
  assert.match(home, /featuredTechnologies\.map/);
  assert.match(home, /processSteps\.map/);
  assert.match(home, /platformFeatures\.map/);
  assert.match(home, /services\.map/);
  assert.match(home, /plans\.slice/);
  assert.match(home, /FaqAccordion/);
});

test('el contenido comercial está centralizado', async () => {
  const [technologies, services, plans, faqs] = await Promise.all([
    read('src/content/technologies.ts'),
    read('src/content/services.ts'),
    read('src/content/plans.ts'),
    read('src/content/faqs.ts'),
  ]);

  assert.equal((technologies.match(/^\s{4}slug:/gm) ?? []).length, 10);
  assert.equal((services.match(/title:/g) ?? []).length, 5);
  assert.equal((plans.match(/name:/g) ?? []).length, 4);
  assert.equal((faqs.match(/question:/g) ?? []).length, 6);
});

test('el contenido público no incluye tecnologías o marcas internas', async () => {
  const files = await walk('src');
  const content = (await Promise.all(files.map(read))).join('\n');
  assert.doesNotMatch(content, /\b(?:APX|ASO|LRBA|Cells|BBVA)\b/i);
  assert.doesNotMatch(content, /Open Banking|Normativa/i);
});

test('no se utiliza la marca registrada concedida ni preguntas reales de certificación', async () => {
  const files = await walk('src');
  const content = (await Promise.all(files.map(read))).join('\n');
  assert.doesNotMatch(content, /®/);
  assert.doesNotMatch(content, /preguntas reales de certificaci[oó]n/i);
});
