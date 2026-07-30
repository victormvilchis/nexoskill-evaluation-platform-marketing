import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const [pkg, playwright, workflow, localProfile, prodProfile, errorHandler, correlation, start, stop, gitignore, changelog] = await Promise.all([
  read('package.json'),
  read('playwright.config.ts'),
  read('.github/workflows/ci.yml'),
  read('backend/src/main/resources/application-local.yml'),
  read('backend/src/main/resources/application-prod.yml'),
  read('backend/src/main/java/com/nexoskill/marketing/api/ApiExceptionHandler.java'),
  read('backend/src/main/java/com/nexoskill/marketing/config/RequestCorrelationFilter.java'),
  read('start-marketing.ps1'),
  read('stop-marketing.ps1'),
  read('.gitignore'),
  read('CHANGELOG.md'),
]);

test('la versión estable conserva Playwright, axe y scripts de validación', () => {
  assert.match(pkg, /"@playwright\/test"/);
  assert.match(pkg, /"@axe-core\/playwright"/);
  assert.match(pkg, /"test:e2e"/);
  assert.match(playwright, /mobile-chrome/);
  assert.match(playwright, /mobile-safari/);
  assert.match(playwright, /channel: 'chrome'/);
  assert.match(playwright, /video: isCI \? 'retain-on-failure' : 'off'/);
});

test('GitHub Actions valida frontend, backend, E2E y secretos', () => {
  assert.match(workflow, /npm run check/);
  assert.match(workflow, /npm run test:e2e/);
  assert.match(workflow, /mvn -B -f backend\/pom.xml clean verify/);
  assert.match(workflow, /Repository guard/);
});

test('Spring separa perfiles local y productivo', () => {
  assert.match(localProfile, /on-profile: local/);
  assert.match(prodProfile, /on-profile: prod/);
  assert.match(prodProfile, /username: \$\{DB_USERNAME\}/);
  assert.match(prodProfile, /allowed-origins: \$\{CORS_ALLOWED_ORIGINS\}/);
});

test('la API expone contrato de error estable e identificador de solicitud', () => {
  assert.match(errorHandler, /VALIDATION_ERROR/);
  assert.match(errorHandler, /ApiErrorResponse/);
  assert.match(correlation, /X-Request-Id/);
  assert.match(correlation, /MDC\.put/);
});

test('los scripts no detienen procesos ajenos y guardan diagnóstico', () => {
  assert.match(start, /check-marketing\.ps1/);
  assert.match(start, /logs\\backend\.log/);
  assert.match(stop, /belongsToProject/);
  assert.match(stop, /ForcePorts/);
});

test('artefactos locales de pruebas y ejecución están excluidos de Git', () => {
  assert.match(gitignore, /playwright-report\//);
  assert.match(gitignore, /test-results\//);
  assert.match(gitignore, /\.runtime\//);
  assert.match(changelog, /1\.0\.1/);
});
