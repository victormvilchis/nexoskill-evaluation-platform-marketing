import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 375, height: 812 } });

test('el menú móvil abre, navega y no produce scroll horizontal', async ({ page }) => {
  await page.goto('/');

  const openToggle = page.getByRole('button', { name: 'Abrir menú principal' });
  await expect(openToggle).toHaveCount(1);
  await expect(openToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('button', { name: 'Cerrar menú principal' })).toHaveCount(0);

  await openToggle.click();

  const closeToggle = page.getByRole('button', { name: 'Cerrar menú principal' });
  await expect(closeToggle).toHaveCount(1);
  await expect(closeToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('button', { name: 'Abrir menú principal' })).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible();
  await expect(page.getByText('Iniciar sesión', { exact: true })).toHaveCount(0);
  await expect(page.locator('body')).toHaveClass(/nav-open/);

  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Abrir menú principal' })).toBeFocused();
  await expect(page.locator('body')).not.toHaveClass(/nav-open/);

  await page.getByRole('button', { name: 'Abrir menú principal' }).click();
  await page.getByRole('link', { name: 'Planes', exact: true }).click();
  await expect(page).toHaveURL(/\/planes$/);
  await expect(page.locator('body')).not.toHaveClass(/nav-open/);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
