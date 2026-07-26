import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');
const content = await read('src/content/technologies.ts');
const catalogPage = await read('src/pages/TechnologiesPage.tsx');
const detailPage = await read('src/pages/TechnologyPage.tsx');
const sitemap = await read('public/sitemap.xml');

const slugs = [
  'java-spring-boot',
  'apis-microservicios',
  'salesforce',
  'python-analisis-datos',
  'sql-bases-datos',
  'cloud-aws',
  'devops-entrega-continua',
  'testing-automatizacion',
  'desarrollo-seguro',
  'arquitectura-software',
];

test('el catálogo contiene las 10 especialidades públicas definidas', () => {
  assert.equal((content.match(/^\s{4}slug:/gm) ?? []).length, 10);
  slugs.forEach((slug) => assert.match(content, new RegExp(`slug: '${slug}'`)));
});

test('cada tecnología define contenido suficiente para su página individual', () => {
  assert.equal((content.match(/competencies:/g) ?? []).length, 10);
  assert.equal((content.match(/offerings:/g) ?? []).length, 10);
  assert.equal((content.match(/learningPath:/g) ?? []).length, 10);
  assert.equal((content.match(/modalities:/g) ?? []).length, 10);
  assert.equal((content.match(/relatedPrograms:/g) ?? []).length, 10);
  assert.equal((content.match(/faqs:/g) ?? []).length, 10);
});

test('el catálogo implementa búsqueda, filtro, resultados y estado vacío', () => {
  assert.match(catalogPage, /useState/);
  assert.match(catalogPage, /useMemo/);
  assert.match(catalogPage, /type="search"/);
  assert.match(catalogPage, /technologyCategories\.map/);
  assert.match(catalogPage, /filteredTechnologies\.map/);
  assert.match(catalogPage, /technology-empty-state/);
});

test('la página individual presenta todas las secciones de la Parte 3', () => {
  [
    'technology.audience',
    'technology.competencies',
    'technology.offerings',
    'technology.learningPath',
    'technology.relatedPrograms',
    'technology.faqs',
  ].forEach((expression) => assert.match(detailPage, new RegExp(expression.replace('.', '\\.'))));
  assert.match(detailPage, /<Seo/);
  assert.match(detailPage, /<CTASection/);
});

test('el sitemap contiene todas las páginas tecnológicas', () => {
  slugs.forEach((slug) => assert.match(sitemap, new RegExp(`/tecnologias/${slug}`)));
});
