import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const app = await readFile(new URL('../src/app/App.tsx', import.meta.url), 'utf8');
const navigation = await readFile(new URL('../src/content/navigation.ts', import.meta.url), 'utf8');

const requiredRoutes = [
  '/',
  '/plataforma',
  '/tecnologias',
  '/tecnologias/:slug',
  '/bootcamps',
  '/capacitaciones',
  '/asesorias',
  '/planes',
  '/empresas',
  '/nosotros',
  '/contacto',
  '/solicitar-demo',
  '/solicitar-cotizacion',
  '/preguntas-frecuentes',
  '/aviso-de-privacidad',
  '/terminos-y-condiciones',
];

test('todas las rutas base están declaradas', () => {
  requiredRoutes.forEach((route) => assert.match(app, new RegExp(`path=\\"${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\"`)));
});

test('las rutas de la Parte 2 utilizan páginas comerciales completas', () => {
  const pages = ['PlatformPage', 'BootcampsPage', 'TrainingPage', 'AdvisoryPage', 'TalentEvaluationPage'];
  pages.forEach((page) => {
    assert.match(app, new RegExp(`(?:import \\{ ${page} \\}|const ${page} = lazy\\()`));
    assert.match(app, new RegExp(`<${page} \\/>`));
  });
});

test('cada enlace principal apunta a una ruta implementada', () => {
  const links = [...navigation.matchAll(/href: '([^']+)'/g)].map((match) => match[1]);
  links.forEach((link) => assert.ok(app.includes(`path="${link}"`) || link.startsWith('/tecnologias/'), `Ruta no implementada: ${link}`));
});

test('el sitio comercial no expone accesos operativos', async () => {
  const header = await readFile(new URL('../src/components/layout/Header.tsx', import.meta.url), 'utf8');
  const footer = await readFile(new URL('../src/components/layout/Footer.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(`${header}\n${footer}`, /Iniciar sesión|Acceso a la plataforma|platformUrl/i);
});

test('el efecto de navegación no devuelve el resultado de window.scrollTo desde useEffect', () => {
  assert.match(app, /useEffect\(\(\) => \{\s*window\.scrollTo\(/s);
  assert.doesNotMatch(app, /useEffect\(\(\) => window\.scrollTo\(/);
});
