import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [index, robots, sitemap, seo, siteConfig, app] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../public/robots.txt', import.meta.url), 'utf8'),
  readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8'),
  readFile(new URL('../src/seo/Seo.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/seo/siteConfig.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/app/App.tsx', import.meta.url), 'utf8'),
]);

assert.match(index, /<html lang="es-MX">/);
assert.match(index, /rel="canonical"/);
assert.match(index, /property="og:image"/);
assert.match(index, /name="twitter:card"/);
assert.match(index, /application\/ld\+json/);
assert.match(robots, /Sitemap:\s*https:\/\/nexoskill\.com\/sitemap\.xml/);
assert.match(sitemap, /<urlset/);
assert.match(sitemap, /\/aviso-de-privacidad/);
assert.match(sitemap, /\/terminos-y-condiciones/);
assert.match(seo, /og:site_name/);
assert.match(seo, /twitter:description/);
assert.match(seo, /nexoskill-structured-data/);
assert.doesNotMatch(siteConfig, /platformUrl|VITE_PLATFORM_URL|evaluaciones\/dashboard/);
assert.match(siteConfig, /VITE_API_URL/);
assert.match(app, /ConsentBanner/);
assert.match(app, /AnalyticsManager/);
console.log('Validación SEO, consentimiento y metadatos completada.');
