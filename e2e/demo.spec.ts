import { expect, test } from '@playwright/test';

test.describe('astronomical clock demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?demoSpeed=fast');
    await expect(page.getByTestId('astronomical-clock')).toBeVisible();
  });

  test('loads the central clock and activates each mode', async ({ page }) => {
    await page.getByTestId('control-day-night').click();
    await expect(page.getByTestId('status-line')).toContainText('El día gira');

    await page.getByTestId('control-moon').click();
    await expect(page.getByTestId('status-line')).toContainText('La luna avanza');

    await page.getByTestId('control-season-winter').click();
    await expect(page.getByTestId('status-line')).toContainText('El año respira');

    await page.getByTestId('control-constellations').click();
    await expect(page.getByTestId('status-line')).toContainText('Las estrellas encuentran');
  });

  test('opens and closes the help panel', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir ayuda' }).click();
    await expect(page.getByTestId('side-panel')).toContainText('Toca los anillos');
    await page.getByRole('button', { name: 'Cerrar panel' }).click();
    await expect(page.getByTestId('side-panel')).toHaveAttribute('aria-hidden', 'true');
  });

  test('projects the Rete Celeste and returns to exploration', async ({ page }) => {
    await page.getByTestId('control-rete').click();
    await expect(page.getByTestId('armillary-projection')).toBeVisible();
    await expect(page.getByTestId('status-line')).toContainText('La esfera oculta');
    await expect(page.getByTestId('status-line')).toContainText('Las estrellas encuentran', { timeout: 1_000 });
  });

  test('runs the ceremony to the final resettable state', async ({ page }) => {
    await page.getByTestId('control-ceremony').click();
    await expect(page.getByTestId('ceremony-step')).toContainText('Preparación');
    await expect(page.getByTestId('status-line')).toContainText('El tiempo no pasa', { timeout: 2_000 });
    await expect(page.getByTestId('ceremony-step')).toContainText('Reposo nocturno', { timeout: 2_000 });
    await page.getByRole('button', { name: 'Reiniciar mecanismo' }).click();
    await expect(page.getByTestId('status-line')).toContainText('Toca el anillo', { timeout: 1_000 });
  });

  test('supports sound and reduced motion controls', async ({ page }) => {
    await page.getByRole('button', { name: 'Alternar sonido' }).click();
    await expect(page.getByRole('button', { name: 'Alternar sonido' })).toContainText('Sonido activo');
    await page.getByRole('button', { name: 'Alternar movimiento reducido' }).click();
    await expect(page.getByTestId('app-root')).toHaveAttribute('data-motion', 'reduced');
  });
});
