import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');
const attribution = await read('src/analytics/attribution.ts');
const analytics = await read('src/analytics/analytics.ts');
const manager = await read('src/analytics/AnalyticsManager.tsx');
const form = await read('src/components/forms/LeadForm.tsx');
const request = await read('backend/src/main/java/com/valtieris/marketing/api/LeadRequest.java');
const prospect = await read('backend/src/main/java/com/valtieris/marketing/domain/Prospect.java');
const service = await read('backend/src/main/java/com/valtieris/marketing/service/LeadService.java');
const migration = await read('backend/src/main/resources/db/migration/oracle/V2__add_marketing_attribution.sql');
const privacy = await read('src/components/privacy/PrivacyNoticeContent.tsx');

test('la atribución conserva UTM, click ids y contexto de conversión', () => {
  for (const parameter of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid', 'msclkid', 'li_fat_id']) {
    assert.match(attribution, new RegExp(parameter));
  }
  assert.match(attribution, /sessionStorage/);
  assert.match(attribution, /landingPage/);
  assert.match(attribution, /conversionPage/);
  assert.match(attribution, /analyticsConsent/);
  assert.match(form, /getLeadAttribution\(\)/);
});

test('los eventos de conversión se activan únicamente con consentimiento', () => {
  assert.match(analytics, /readAnalyticsConsent\(\) !== 'granted'/);
  assert.match(analytics, /analytics_consent_update/);
  assert.match(analytics, /allow_ad_personalization_signals: false/);
  assert.match(manager, /demo_cta_click/);
  assert.match(manager, /quote_cta_click/);
  assert.match(manager, /technology_click/);
  assert.match(form, /lead_form_start/);
  assert.match(form, /lead_submit_attempt/);
  assert.match(form, /lead_submit_success/);
  assert.match(form, /lead_form_validation_error/);
});

test('el backend persiste atribución comercial con migración independiente', () => {
  for (const field of ['utmSource', 'utmMedium', 'utmCampaign', 'utmContent', 'utmTerm', 'clickId', 'referrer', 'landingPage', 'conversionPage', 'analyticsConsent']) {
    assert.match(request, new RegExp(field));
    assert.match(prospect, new RegExp(field, 'i'));
  }
  assert.match(service, /setUtmSource/);
  assert.match(service, /setAttributionCapturedAt/);
  assert.match(migration, /ALTER TABLE MKT_PROSPECT ADD/);
  assert.match(migration, /UTM_CAMPAIGN/);
  assert.match(migration, /ANALYTICS_CONSENT/);
  assert.match(migration, /IX_MKT_PROSPECT_CAMPAIGN_CREATED/);
});

test('el aviso de privacidad explica atribución sin activar analítica externa', () => {
  assert.match(privacy, /parámetros de atribución/);
  assert.match(privacy, /sesión del navegador/);
  assert.match(privacy, /No se activa ninguna herramienta externa/);
});
