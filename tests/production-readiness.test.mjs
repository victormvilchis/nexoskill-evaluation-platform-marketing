import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [app, analytics, consent, seo, nginx, env, backend, docker, privacy, terms, packageJson] = await Promise.all([
  read('../src/app/App.tsx'), read('../src/analytics/analytics.ts'), read('../src/components/privacy/ConsentBanner.tsx'),
  read('../src/seo/Seo.tsx'), read('../nginx.conf'), read('../.env.example'), read('../backend/src/main/resources/application.yml'),
  read('../docker-compose.production.yml'), read('../src/components/privacy/PrivacyNoticeContent.tsx'), read('../src/pages/TermsPage.tsx'), read('../package.json'),
]);

test('la analítica se carga únicamente con consentimiento', () => {
  assert.match(analytics, /readAnalyticsConsent\(\) !== 'granted'/);
  assert.match(analytics, /googletagmanager\.com/);
  assert.match(consent, /Rechazar opcionales/);
  assert.match(consent, /Aceptar analítica/);
  assert.match(app, /AnalyticsManager/);
  assert.match(app, /ConsentBanner/);
});

test('SEO incorpora canonical, Open Graph, Twitter y JSON-LD', () => {
  assert.match(seo, /rel=\"canonical\"|link\[rel=\"canonical\"\]/);
  assert.match(seo, /og:site_name/);
  assert.match(seo, /twitter:image/);
  assert.match(seo, /application\/ld\+json/);
  assert.match(packageJson, /generate:sitemap/);
});

test('las páginas legales ya no son provisionales', () => {
  assert.match(privacy, /Datos que recopilamos/);
  assert.match(privacy, /Analítica y almacenamiento local/);
  assert.match(terms, /Solicitudes comerciales/);
  assert.match(terms, /Tecnologías y marcas de terceros/);
});

test('la configuración productiva aplica seguridad y separación de servicios', () => {
  assert.match(nginx, /Content-Security-Policy/);
  assert.match(nginx, /Strict-Transport-Security/);
  assert.match(nginx, /client_max_body_size 64k/);
  assert.match(docker, /no-new-privileges:true/);
  assert.doesNotMatch(env, /VITE_PLATFORM_URL/);
  assert.match(env, /VITE_API_URL=http:\/\/localhost:8081\/api/);
  assert.match(backend, /MAIL_HEALTH_ENABLED:false/);
});
