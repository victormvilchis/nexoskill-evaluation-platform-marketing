import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

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

  assert.equal((technologies.match(/slug:/g) ?? []).length, 6);
  assert.equal((services.match(/title:/g) ?? []).length, 5);
  assert.equal((plans.match(/name:/g) ?? []).length, 4);
  assert.equal((faqs.match(/question:/g) ?? []).length, 6);
});

test('no se utiliza la marca registrada concedida ni preguntas reales de certificación', async () => {
  const files = await Promise.all([
    read('src/pages/HomePage.tsx'),
    read('src/content/technologies.ts'),
    read('src/content/services.ts'),
    read('src/components/layout/Footer.tsx'),
  ]);
  const content = files.join('\n');
  assert.doesNotMatch(content, /®/);
  assert.doesNotMatch(content, /preguntas reales de certificaci[oó]n/i);
});
