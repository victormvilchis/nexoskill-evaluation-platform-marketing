import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const [header, footer, navigation, leadForm, globalStyles, enhancements, app, siteConfig, env] = await Promise.all([
  read('src/components/layout/Header.tsx'),
  read('src/components/layout/Footer.tsx'),
  read('src/content/navigation.ts'),
  read('src/components/forms/LeadForm.tsx'),
  read('src/styles/global.css'),
  read('src/styles/executive.css'),
  read('src/app/App.tsx'),
  read('src/seo/siteConfig.ts'),
  read('.env.example'),
]);

const sourceFiles = await readdir(new URL('../src', import.meta.url), { recursive: true });
const sourceText = (await Promise.all(sourceFiles.filter((file) => /\.(tsx?|css)$/.test(file)).map((file) => read(`src/${file}`)))).join('\n');

test('el sitio comercial no muestra acceso operativo', () => {
  assert.doesNotMatch(`${header}\n${footer}\n${siteConfig}\n${env}`, /Iniciar sesión|Acceso a la plataforma|VITE_PLATFORM_URL|platformUrl/i);
});

test('el dropdown conserva el diseño original y mejora su accesibilidad', () => {
  assert.match(header, /aria-controls="solutions-navigation"/);
  assert.match(header, /aria-expanded=\{solutionsOpen\}/);
  assert.match(header, /name="chevron"/);
  assert.match(header, /closeOnOutsideClick/);
  assert.match(header, /event\.key !== 'Escape'/);
  assert.match(header, /ArrowDown/);
  assert.match(header, /ArrowUp/);
  assert.match(header, /Home/);
  assert.match(header, /End/);
  assert.match(header, /nav-dropdown__eyebrow/);
  assert.doesNotMatch(header, />\s*\^\s*</);
});

test('el menú móvil bloquea el fondo y se cierra al navegar', () => {
  assert.match(header, /document\.body\.classList\.toggle\('nav-open', mobileOpen\)/);
  assert.match(header, /setMobileOpen\(false\)/);
  assert.match(header, /mobileOpen && \(/);
  assert.match(header, /aria-hidden="true"/);
  assert.match(header, /className="nav-backdrop nav-backdrop--visible"/);
  assert.doesNotMatch(header, /aria-label="Cerrar menú principal"[\s\S]*nav-backdrop/);
  assert.match(enhancements, /body\.nav-open/);
  assert.match(enhancements, /@media \(max-width: 960px\)/);
});

test('los formularios conservan envío real, carga, bloqueo y privacidad', () => {
  assert.match(leadForm, /await submitLead\(kind, payload\)/);
  assert.match(leadForm, /submittingRef\.current/);
  assert.match(leadForm, /disabled=\{status\.type === 'sending'\}/);
  assert.match(leadForm, /button__spinner/);
  assert.match(leadForm, /Enviando…/);
  assert.match(leadForm, /lead-form__security-note/);
  assert.match(leadForm, /name="lock"/);
  assert.match(leadForm, /setStatus\(\{ type: 'success'/);
});

test('se conserva el sistema visual previo y las mejoras son acotadas', () => {
  assert.match(globalStyles, /\.site-header__inner[\s\S]*min-height: 76px/);
  assert.match(globalStyles, /\.nav-dropdown__menu[\s\S]*width: min\(430px/);
  assert.match(globalStyles, /--navy-950/);
  assert.doesNotMatch(enhancements, /--brand-950|--container:|\.hero\s*\{/);
  assert.match(enhancements, /:focus-visible/);
  assert.match(enhancements, /prefers-reduced-motion/);
});

test('todas las rutas comerciales principales y 404 siguen declaradas', () => {
  ['/plataforma', '/tecnologias', '/bootcamps', '/capacitaciones', '/asesorias', '/planes', '/empresas', '/nosotros', '/contacto', '/solicitar-demo', '/solicitar-cotizacion', '/preguntas-frecuentes', '/aviso-de-privacidad', '/terminos-y-condiciones'].forEach((route) => assert.match(app, new RegExp(`path="${route.replaceAll('/', '\\/')}"`)));
  assert.match(app, /path="\*"/);
});

test('no existen enlaces de relleno ni acciones comerciales con hash', () => {
  assert.doesNotMatch(sourceText, /(?:href|to)=["']#(?:["'])/);
  assert.match(navigation, /Solicitar demo/);
  assert.match(navigation, /Solicitar cotización/);
});
