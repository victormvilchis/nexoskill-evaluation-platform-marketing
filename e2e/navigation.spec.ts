import { expect, test } from '@playwright/test';

const publicRoutes = [
  '/',
  '/plataforma',
  '/tecnologias',
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

test('el header comercial no muestra acceso operativo y navega con dropdown accesible', async ({ page }, testInfo) => {
  await page.goto('/');

  await expect(page.getByText('Iniciar sesión', { exact: true })).toHaveCount(0);

  if (testInfo.project.name.startsWith('mobile-')) {
    const mobileToggle = page.getByRole('button', { name: 'Abrir menú principal' });
    await expect(mobileToggle).toHaveAttribute('aria-expanded', 'false');
    await mobileToggle.click();
    await expect(page.getByRole('button', { name: 'Cerrar menú principal' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  }

  const solutions = page.getByRole('button', { name: 'Soluciones' });
  await expect(solutions).toHaveAttribute('aria-expanded', 'false');

  await solutions.click();
  await expect(solutions).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: /Plataforma de evaluaciones/ })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(solutions).toHaveAttribute('aria-expanded', 'false');

  await solutions.press('ArrowDown');
  await expect(solutions).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: /Plataforma de evaluaciones/ })).toBeFocused();
});

test('las rutas públicas cargan sin errores de consola ni 404 inesperados', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  for (const route of publicRoutes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBeLessThan(400);
    await expect(page.locator('#main-content h1').first(), route).toBeVisible();
  }

  expect(errors).toEqual([]);
});

test('una ruta inexistente presenta una página 404 profesional', async ({ page }) => {
  await page.goto('/ruta-que-no-existe');

  await expect(page.getByText('404', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Esta ruta no forma parte del sitio.',
    }),
  ).toBeVisible();

  const returnLink = page.getByRole('link', { name: 'Volver al inicio' });
  await expect(returnLink).toBeVisible();
  await expect(returnLink).toHaveAttribute('href', '/');
});
