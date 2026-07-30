import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

const [brandMark, home, header, footer, siteConfig, index, manifest, globalStyles, executiveStyles, plans, backendConfig, leadService] = await Promise.all([
  read('src/components/common/BrandMark.tsx'),
  read('src/pages/HomePage.tsx'),
  read('src/components/layout/Header.tsx'),
  read('src/components/layout/Footer.tsx'),
  read('src/seo/siteConfig.ts'),
  read('index.html'),
  read('public/site.webmanifest'),
  read('src/styles/global.css'),
  read('src/styles/executive.css'),
  read('src/content/plans.ts'),
  read('backend/src/main/resources/application.yml'),
  read('backend/src/main/java/com/valtieris/marketing/service/LeadService.java'),
]);

test('Valtieris es la marca pública y el logo se utiliza en navegación, hero y footer', async () => {
  assert.match(brandMark, /valtieris-logo-720\.png/);
  assert.match(brandMark, /valtieris-logo-inverse-720\.png/);
  assert.match(brandMark, /aria-label="Valtieris, inicio"/);
  assert.match(home, /hero__brand-logo/);
  assert.match(home, /valtieris-icon-64\.png/);
  assert.match(header, /Soluciones Valtieris/);
  assert.match(footer, /© \{year\} Valtieris/);
  await access(new URL('../public/brand/valtieris-logo-720.png', import.meta.url));
  await access(new URL('../public/brand/valtieris-icon-512.png', import.meta.url));
  await access(new URL('../public/favicon.ico', import.meta.url));
});

test('metadatos, manifest y backend usan la nueva marca', () => {
  assert.match(siteConfig, /name: 'Valtieris'/);
  assert.match(index, /<title>Valtieris<\/title>/);
  assert.match(index, /favicon\.ico/);
  assert.match(manifest, /"name": "Valtieris"/);
  assert.match(backendConfig, /name: valtieris-marketing-backend/);
  assert.match(backendConfig, /brand-name: Valtieris/);
  assert.match(leadService, /equipo de Valtieris/);
  assert.doesNotMatch([brandMark, home, header, footer, siteConfig, index].join('\n'), new RegExp(['nexo', 'skill'].join(''), 'i'));
  assert.match(leadService, /ProspectReference\.fromId/);
});

test('el sistema visual utiliza la paleta enterprise aprobada', () => {
  const styles = `${globalStyles}\n${executiveStyles}`;
  for (const token of ['#071a2b', '#0b2239', '#155eef', '#124ac4', '#0f766e', '#eaf2ff', '#f7f9fc']) {
    assert.match(styles.toLowerCase(), new RegExp(token));
  }
  assert.match(executiveStyles, /Valtieris enterprise rebrand/);
  assert.match(executiveStyles, /\.pricing-card--featured/);
});

test('el modelo comercial definitivo está incorporado', () => {
  assert.match(plans, /Starter tecnológico[\s\S]*?15 asientos activos/);
  assert.match(plans, /Professional Academy[\s\S]*?25 asientos activos[\s\S]*?1 tecnología/);
  assert.match(plans, /Business Talent[\s\S]*?40 asientos activos[\s\S]*?Hasta 4 tecnologías[\s\S]*?featured: true/);
  assert.match(plans, /Enterprise[\s\S]*?Asientos personalizados[\s\S]*?Catálogo tecnológico amplio/);
  assert.doesNotMatch(plans, /SSO|API sujetos|Integraciones/i);
});
