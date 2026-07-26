import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');
const plans = await read('src/content/plans.ts');
const pricingPage = await read('src/pages/PricingPage.tsx');
const comparison = await read('src/components/pricing/PlanComparison.tsx');
const quotePage = await read('src/pages/QuoteRequestPage.tsx');
const faqPage = await read('src/pages/FaqPage.tsx');
const app = await read('src/app/App.tsx');
const sitemap = await read('public/sitemap.xml');

test('los cuatro planes comerciales están centralizados y completos', () => {
  assert.equal((plans.match(/^\s{4}id:/gm) ?? []).length, 4);
  ['starter-tecnologico', 'professional-academy', 'business-certification', 'enterprise']
    .forEach((id) => assert.match(plans, new RegExp(`id: '${id}'`)));
  ['seats:', 'technologyScope:', 'roles:', 'reporting:', 'substitutions:', 'support:']
    .forEach((field) => assert.equal((plans.match(new RegExp(field, 'g')) ?? []).length, 4));
});

test('la página de planes utiliza contenido centralizado, comparación, FAQ y CTA', () => {
  assert.match(pricingPage, /plans\.map/);
  assert.match(pricingPage, /<PricingCard/);
  assert.match(pricingPage, /<PlanComparison/);
  assert.match(pricingPage, /pricingFaqs/);
  assert.match(pricingPage, /primaryHref="\/solicitar-cotizacion"/);
  assert.match(comparison, /planComparison\.map/);
});

test('la solicitud de cotización valida datos y genera un correo real', () => {
  assert.match(quotePage, /const validate/);
  assert.match(quotePage, /type="email"/);
  assert.match(quotePage, /maxLength=\{700\}/);
  assert.match(quotePage, /window\.location\.href = `mailto:/);
  assert.match(quotePage, /siteConfig\.contactEmail/);
  assert.match(quotePage, /\/aviso-de-privacidad/);
});

test('las rutas comerciales nuevas están declaradas y el FAQ ya no es provisional', () => {
  assert.match(app, /path="\/solicitar-cotizacion" element=\{<QuoteRequestPage \/>\}/);
  assert.match(app, /path="\/planes" element=\{<PricingPage \/>\}/);
  assert.match(app, /path="\/preguntas-frecuentes" element=\{<FaqPage \/>\}/);
  assert.match(faqPage, /pricingFaqs/);
  assert.match(sitemap, /\/solicitar-cotizacion/);
});
