import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');
const [form, modal, content, privacyPage, styles, e2e] = await Promise.all([
  read('src/components/forms/LeadForm.tsx'),
  read('src/components/privacy/PrivacyNoticeModal.tsx'),
  read('src/components/privacy/PrivacyNoticeContent.tsx'),
  read('src/pages/PrivacyPage.tsx'),
  read('src/styles/global.css'),
  read('e2e/forms.spec.ts'),
]);

test('el aviso dentro de formularios abre un modal sin navegar', () => {
  assert.match(form, /PrivacyNoticeModal/);
  assert.match(form, /lead-consent__privacy-button/);
  assert.match(form, /type="button">aviso de privacidad/);
  assert.doesNotMatch(form, /<Link to="\/aviso-de-privacidad">aviso de privacidad<\/Link>/);
});

test('el modal aplica accesibilidad, cierre seguro y restauración de foco', () => {
  assert.match(modal, /aria-modal="true"/);
  assert.match(modal, /role="dialog"/);
  assert.match(modal, /event\.key === 'Escape'/);
  assert.match(modal, /focusableSelector/);
  assert.match(modal, /document\.body\.style\.overflow = 'hidden'/);
  assert.match(modal, /returnFocusRef\?\.current \|\| previousActiveElement/);
  assert.match(modal, /createPortal/);
});

test('la página completa y el modal reutilizan el mismo contenido legal', () => {
  assert.match(privacyPage, /PrivacyNoticeContent/);
  assert.match(content, /Datos que recopilamos/);
  assert.match(content, /parámetros de atribución/);
  assert.match(content, /No se activa ninguna herramienta externa/);
});

test('el modal es responsivo y las pruebas conservan datos en demo y cotización', () => {
  assert.match(styles, /\.privacy-modal-layer/);
  assert.match(styles, /max-height: calc\(100vh - 2rem\)/);
  assert.match(styles, /@media \(max-width: 640px\)/);
  assert.match(e2e, /solicitud de demo/);
  assert.match(e2e, /solicitud de cotización/);
  assert.match(e2e, /toHaveValue\('María'\)/);
  assert.match(e2e, /page\.keyboard\.press\('Escape'\)/);
});
