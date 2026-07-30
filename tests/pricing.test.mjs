import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');
const plans = await read('src/content/plans.ts');
const pricingFaqs = await read('src/content/pricingFaqs.ts');
const pricingPage = await read('src/pages/PricingPage.tsx');
const comparison = await read('src/components/pricing/PlanComparison.tsx');
const quotePage = await read('src/pages/QuoteRequestPage.tsx');
const faqPage = await read('src/pages/FaqPage.tsx');
const app = await read('src/app/App.tsx');
const sitemap = await read('public/sitemap.xml');

test('los cuatro planes comerciales están centralizados y completos', () => {
  assert.equal((plans.match(/^\s{4}id:/gm) ?? []).length, 4);
  ['starter-tecnologico', 'professional-academy', 'business-talent', 'enterprise']
    .forEach((id) => assert.match(plans, new RegExp(`id: '${id}'`)));
  ['seats:', 'technologyScope:', 'roles:', 'reporting:', 'certificationManagement:', 'talentTracking:']
    .forEach((field) => assert.equal((plans.match(new RegExp(field, 'g')) ?? []).length, 4));
});

test('los planes reflejan la capacidad y el contenido comercial aprobados', () => {
  const planBlock = (id) => plans.match(new RegExp(`\\{[\\s\\S]*?id: '${id}'[\\s\\S]*?\\n  \},`))?.[0] ?? '';
  const starter = planBlock('starter-tecnologico');
  const professional = planBlock('professional-academy');
  const business = planBlock('business-talent');
  const enterprise = planBlock('enterprise');

  assert.match(starter, /name: 'Starter tecnológico'[\s\S]*?seats: '15 asientos activos'[\s\S]*?technologyScope: 'Sin contenido tecnológico incluido'/);
  assert.match(professional, /name: 'Professional Academy'[\s\S]*?seats: '25 asientos activos'[\s\S]*?technologyScope: '1 tecnología'/);
  assert.match(business, /name: 'Business Talent'[\s\S]*?seats: '40 asientos activos'[\s\S]*?technologyScope: 'Hasta 4 tecnologías'/);
  assert.match(enterprise, /name: 'Enterprise'[\s\S]*?seats: 'Asientos personalizados'[\s\S]*?technologyScope: 'Catálogo tecnológico amplio'/);
  assert.match(plans, /Banco de preguntas propio por organización/);
  assert.match(plans, /Banco de preguntas de 1 tecnología/);
  assert.match(plans, /Bancos de preguntas de hasta 4 tecnologías/);
  assert.match(plans, /Catálogo tecnológico amplio/);
  assert.match(business, /featured: true/);
  assert.doesNotMatch(professional, /featured: true/);
});

test('la gestión de certificaciones inicia en Business Talent', () => {
  assert.match(plans, /name: 'Starter tecnológico'[\s\S]*?certificationManagement: 'No incluida'/);
  assert.match(plans, /name: 'Professional Academy'[\s\S]*?certificationManagement: 'No incluida'/);
  assert.match(plans, /name: 'Business Talent'[\s\S]*?certificationManagement: 'Incluida'/);
  assert.match(plans, /name: 'Enterprise'[\s\S]*?certificationManagement: 'Incluida y configurable por organización'/);
  assert.match(plans, /Gestión de certificaciones y estatus de examen/);
  assert.match(plans, /Seguimiento de estudiantes y colaboradores/);
});

test('Enterprise no promete integraciones ni beneficios comunes exclusivos', () => {
  assert.doesNotMatch(plans, /SSO|integraciones sujetos|API sujetos/i);
  assert.doesNotMatch(plans, /Identidad visual y condiciones de servicio personalizadas/i);
  assert.match(plans, /Todas las capacidades de Business Talent/);
  assert.match(plans, /Seguimiento de múltiples academias, áreas o programas/);
  assert.match(plans, /Perfiles, tecnologías y rutas personalizadas/);
});

test('las preguntas frecuentes explican las diferencias reales entre planes', () => {
  assert.match(pricingFaqs, /Starter tecnológico incluye 15 asientos activos/);
  assert.match(pricingFaqs, /Professional Academy 25/);
  assert.match(pricingFaqs, /Business Talent 40/);
  assert.match(pricingFaqs, /Business Talent incluye hasta cuatro tecnologías/);
  assert.match(pricingFaqs, /gestión formal de certificaciones y el seguimiento integral de estudiantes y colaboradores se habilitan a partir de Business Talent/i);
  assert.doesNotMatch(pricingFaqs, /SSO|integraciones/i);
});

test('la página de planes utiliza contenido centralizado, comparación, FAQ y CTA', () => {
  assert.match(pricingPage, /plans\.map/);
  assert.match(pricingPage, /<PricingCard/);
  assert.match(pricingPage, /<PlanComparison/);
  assert.match(pricingPage, /pricingFaqs/);
  assert.match(pricingPage, /primaryHref="\/solicitar-cotizacion"/);
  assert.doesNotMatch(pricingPage, /acceso único y las integraciones/i);
  assert.match(comparison, /planComparison\.map/);
});

test('la solicitud de cotización utiliza el formulario persistente y conserva enlaces anteriores', () => {
  assert.match(quotePage, /<LeadForm/);
  assert.match(quotePage, /kind="quote"/);
  assert.match(quotePage, /planOptions=/);
  assert.match(quotePage, /onPlanChange=\{setPlanId\}/);
  assert.match(quotePage, /requestedPlan === 'business-certification' \? 'business-talent'/);
  assert.doesNotMatch(quotePage, /mailto:/);
});

test('las rutas comerciales nuevas están declaradas y el FAQ ya no es provisional', () => {
  assert.match(app, /path="\/solicitar-cotizacion" element=\{<QuoteRequestPage \/>\}/);
  assert.match(app, /path="\/planes" element=\{<PricingPage \/>\}/);
  assert.match(app, /path="\/preguntas-frecuentes" element=\{<FaqPage \/>\}/);
  assert.match(faqPage, /pricingFaqs/);
  assert.match(sitemap, /\/solicitar-cotizacion/);
});
