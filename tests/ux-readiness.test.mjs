import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');
const [app, about, header, navigation, pageHero, leadForm, boundary] = await Promise.all([
  read('src/app/App.tsx'),
  read('src/pages/AboutPage.tsx'),
  read('src/components/layout/Header.tsx'),
  read('src/content/navigation.ts'),
  read('src/components/common/PageHero.tsx'),
  read('src/components/forms/LeadForm.tsx'),
  read('src/components/common/AppErrorBoundary.tsx'),
]);

test('la página Nosotros está terminada y no utiliza contenido provisional', () => {
  assert.match(app, /path="\/nosotros" element=\{<AboutPage \/>\}/);
  assert.match(about, /aboutPrinciples\.map/);
  assert.match(about, /aboutAudiences\.map/);
  assert.match(about, /aboutModel\.map/);
  assert.doesNotMatch(about, /próxima fase|se desarrollará|estructura ya está preparada/i);
});

test('la navegación organiza las soluciones sin ocultar rutas comerciales', () => {
  assert.match(header, /aria-controls="solutions-navigation"/);
  assert.match(header, /aria-expanded=\{solutionsOpen\}/);
  assert.match(header, /closeOnOutsideClick/);
  assert.match(navigation, /solutionsNavigation/);
  ['/empresas', '/capacitaciones', '/asesorias', '/solicitar-cotizacion']
    .forEach((route) => assert.match(navigation, new RegExp(`href: '${route}'`)));
});

test('las páginas interiores incorporan migas de pan accesibles', () => {
  assert.match(pageHero, /aria-label="Migas de pan"/);
  assert.match(pageHero, /aria-current="page"/);
  assert.match(pageHero, /<Link to="\/">Inicio<\/Link>/);
});

test('los formularios agrupan información y muestran un cierre claro', () => {
  assert.match(leadForm, /<fieldset className="lead-form__section">/);
  assert.match(leadForm, /Datos de contacto/);
  assert.match(leadForm, /Contexto de la solicitud/);
  assert.match(leadForm, /lead-form--success/);
  assert.match(leadForm, /Enviar otra solicitud/);
  assert.match(leadForm, /aria-describedby/);
});

test('la aplicación cuenta con recuperación visual ante errores de renderizado', () => {
  assert.match(app, /<AppErrorBoundary>/);
  assert.match(boundary, /getDerivedStateFromError/);
  assert.match(boundary, /Actualizar página/);
});
