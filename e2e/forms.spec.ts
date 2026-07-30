import { expect, test } from '@playwright/test';

async function completeRequiredFields(page: import('@playwright/test').Page) {
  await page.getByLabel('Nombre *').fill('María');
  await page.getByLabel('Correo empresarial *').fill('maria@empresa.com');
  await page.getByLabel('Empresa *').fill('Empresa Demo');
  await page.getByLabel('¿Qué necesitas? *').fill('Necesitamos evaluar y preparar un equipo de desarrollo.');
  await page.getByLabel(/Acepto que Valtieris/).check();
}

test('el formulario evita doble envío y muestra confirmación real', async ({ page }) => {
  let requests = 0;
  let submittedPayload: Record<string, unknown> = {};
  await page.route('**/api/v1/leads/demo', async (route) => {
    requests += 1;
    submittedPayload = route.request().postDataJSON() as Record<string, unknown>;
    await new Promise((resolve) => setTimeout(resolve, 350));
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        reference: 'NS-00000042',
        message: 'Recibimos tu solicitud.',
        submittedAt: new Date().toISOString(),
      }),
    });
  });

  await page.goto('/solicitar-demo?utm_source=linkedin&utm_medium=social&utm_campaign=java_backend_2026&utm_content=hero_demo&li_fat_id=click-123');
  await completeRequiredFields(page);
  const submit = page.getByRole('button', { name: 'Solicitar demo' });
  await submit.click();
  await expect(page.getByRole('button', { name: 'Enviando…' })).toBeDisabled();
  await expect(page.getByText('Solicitud registrada')).toBeVisible();
  await expect(page.getByText('NS-00000042')).toBeVisible();
  expect(requests).toBe(1);
  expect(submittedPayload).toMatchObject({
    utmSource: 'linkedin',
    utmMedium: 'social',
    utmCampaign: 'java_backend_2026',
    utmContent: 'hero_demo',
    clickId: 'click-123',
    clickIdType: 'li_fat_id',
    conversionPage: '/solicitar-demo?utm_source=linkedin&utm_medium=social&utm_campaign=java_backend_2026&utm_content=hero_demo&li_fat_id=click-123',
    analyticsConsent: 'UNSET',
  });
});

test('los errores del backend conservan la información capturada', async ({ page }) => {
  await page.route('**/api/v1/leads/contact', async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/problem+json',
      body: JSON.stringify({
        code: 'VALIDATION_ERROR',
        message: 'Revisa los campos marcados e intenta nuevamente.',
        fieldErrors: { email: 'El correo no puede utilizarse.' },
        timestamp: new Date().toISOString(),
        path: '/api/v1/leads/contact',
        requestId: 'request-test-400',
      }),
    });
  });

  await page.goto('/contacto');
  await completeRequiredFields(page);
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();

  await expect(page.getByRole('alert')).toContainText('Revisa los campos');
  await expect(page.getByLabel('Nombre *')).toHaveValue('María');
  await expect(page.getByLabel('Empresa *')).toHaveValue('Empresa Demo');
  await expect(page.getByLabel('Correo empresarial *')).toHaveValue('maria@empresa.com');
  await expect(page.getByText('El correo no puede utilizarse.')).toBeVisible();
  await expect(page.getByText('Referencia técnica: request-test-400')).toBeVisible();
});

test('las validaciones locales enfocan el primer campo inválido', async ({ page }) => {
  await page.goto('/contacto');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByLabel('Nombre *')).toBeFocused();
  await expect(page.getByRole('alert')).toContainText('Revisa los campos');
});
