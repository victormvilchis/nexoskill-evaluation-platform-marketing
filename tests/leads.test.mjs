import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');
const form = await read('src/components/forms/LeadForm.tsx');
const api = await read('src/services/leadApi.ts');
const demo = await read('src/pages/DemoPage.tsx');
const advisory = await read('src/pages/AdvisoryPage.tsx');
const bootcamps = await read('src/pages/BootcampsPage.tsx');
const controller = await read('backend/src/main/java/com/valtieris/marketing/api/LeadController.java');
const service = await read('backend/src/main/java/com/valtieris/marketing/service/LeadService.java');
const migration = await read('backend/src/main/resources/db/migration/oracle/V1__create_marketing_prospects.sql');
const attributionMigration = await read('backend/src/main/resources/db/migration/oracle/V2__add_marketing_attribution.sql');
const pom = await read('backend/pom.xml');
const application = await read('backend/src/main/resources/application.yml');

test('los formularios envían solicitudes reales al backend', () => {
  assert.match(form, /submitLead\(kind, payload\)/);
  assert.match(form, /consentPrivacy/);
  assert.match(form, /formStartedAt/);
  assert.match(form, /form-honeypot/);
  assert.match(api, /fetch\(`\$\{siteConfig\.apiUrl\}\/v1\/leads\/\$\{kind\}`/);
  assert.doesNotMatch(`${form}\n${api}`, /mailto:/);
});

test('demo, contacto, asesoría y bootcamp usan captación persistente', () => {
  assert.match(demo, /kind=\{isContact \? 'contact' : 'demo'\}/);
  assert.match(advisory, /kind="advisory"/);
  assert.match(bootcamps, /kind="bootcamp"/);
});

test('el backend expone todos los endpoints comerciales', () => {
  ['/contact', '/demo', '/quote', '/advisory', '/bootcamp']
    .forEach((endpoint) => assert.match(controller, new RegExp(`@PostMapping\\("${endpoint}"\\)`)));
  assert.match(service, /repository\.save\(prospect\)/);
  assert.match(service, /existsByContentFingerprintAndCreatedAtAfter/);
  assert.match(service, /maximumUrls/);
});

test('la persistencia utiliza Oracle y objetos aislados con prefijo MKT', () => {
  assert.match(pom, /com\.oracle\.database\.jdbc/);
  assert.match(pom, /flyway-database-oracle/);
  assert.match(application, /oracle\.jdbc\.OracleDriver/);
  assert.match(application, /MKT_FLYWAY_HISTORY/);
  assert.match(migration, /CREATE TABLE MKT_PROSPECT/);
  assert.match(migration, /CREATE SEQUENCE MKT_PROSPECT_SEQ/);
  assert.match(attributionMigration, /UTM_SOURCE/);
  assert.match(attributionMigration, /CONVERSION_PAGE/);
  assert.match(attributionMigration, /ANALYTICS_CONSENT/);
  assert.doesNotMatch(pom, /postgresql/);
});
