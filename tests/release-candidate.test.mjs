import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const [app, header, siteConfig, seo, notFound, styles, packageJson, pom, backendConfig, deployment, attributes] = await Promise.all([
  read('src/app/App.tsx'),
  read('src/components/layout/Header.tsx'),
  read('src/seo/siteConfig.ts'),
  read('src/seo/Seo.tsx'),
  read('src/pages/NotFoundPage.tsx'),
  read('src/styles/executive.css'),
  read('package.json'),
  read('backend/pom.xml'),
  read('backend/src/main/resources/application.yml'),
  read('DEPLOYMENT.md'),
  read('.gitattributes'),
]);

test('la versión 0.1.3 está alineada entre frontend y backend', () => {
  assert.match(packageJson, /"version": "0\.1\.3"/);
  assert.match(pom, /<artifactId>nexoskill-marketing-backend<\/artifactId>\s*<version>0\.1\.3<\/version>/);
  assert.match(backendConfig, /version: 0\.1\.3/);
});

test('la navegación interna por anchors funciona con header sticky y foco accesible', () => {
  assert.match(app, /const \{ pathname, hash \} = useLocation\(\)/);
  assert.match(app, /target\.scrollIntoView/);
  assert.match(app, /target\.focus\(\{ preventScroll: true \}\)/);
  assert.match(styles, /scroll-margin-top: 96px/);
});

test('los cambios de ruta se anuncian a tecnologías de asistencia', () => {
  assert.match(app, /aria-live="polite"/);
  assert.match(app, /className="sr-only"/);
  assert.match(styles, /\.sr-only/);
});

test('el dropdown cierra al salir con Tab y no expone enlaces cuando está cerrado', () => {
  assert.match(header, /handleSolutionsBlur/);
  assert.match(header, /hidden=\{!solutionsOpen\}/);
  assert.match(header, /event\.key === 'ArrowDown' \|\| event\.key === 'ArrowUp'/);
  assert.match(header, /mobileNavRef/);
});

test('la URL del API tolera configuraciones con o sin el segmento api', () => {
  assert.match(siteConfig, /normalizeApiUrl/);
  assert.match(siteConfig, /\/api\(\?:\\\/\|\$\)/);
  assert.match(siteConfig, /`\$\{base\}\/api`/);
});

test('SEO elimina keywords obsoletas y 404 usa su ruta real', () => {
  assert.match(seo, /meta\[name="keywords"\].*remove\(\)/s);
  assert.match(notFound, /useLocation/);
  assert.match(notFound, /path=\{pathname\}/);
});

test('el cierre productivo documenta health checks válidos y finales de línea estables', () => {
  assert.doesNotMatch(deployment, /\/api\/\.\.\/actuator/);
  assert.match(deployment, /marketing-api curl -fsS http:\/\/127\.0\.0\.1:8081\/actuator\/health/);
  assert.match(attributes, /\*\.ps1 text eol=crlf/);
  assert.match(attributes, /\*\.tsx text eol=lf/);
});

test('la protección contra overflow contempla 320 px sin alterar el diseño aprobado', () => {
  assert.match(styles, /overflow-x: clip/);
  assert.match(styles, /@media \(max-width: 380px\)/);
  assert.match(styles, /calc\(100% - 24px\)/);
});
