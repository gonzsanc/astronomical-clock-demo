import { expect, test } from '@playwright/test';

test.describe('astronomical clock demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?demoSpeed=fast');
    await expect(page.getByTestId('astronomical-clock')).toBeVisible();
    await expect(page.getByTestId('interaction-overlay')).toHaveAttribute('data-visual-state', 'initialRest');
  });

  test('loads the central clock and activates each visual mode', async ({ page }) => {
    await expect(page.getByTestId('status-line')).toHaveCount(0);
    await expect(page.getByRole('navigation', { name: 'Controles secundarios' })).toHaveCount(0);

    await page.getByTestId('control-day-night').click();
    await expect(page.getByTestId('interaction-overlay')).toHaveAttribute('data-active-mode', 'dayNight');

    await page.getByTestId('control-moon').click();
    await expect(page.getByTestId('interaction-overlay')).toHaveAttribute('data-active-mode', 'moonPhase');

    await page.getByTestId('control-season-winter').click();
    await expect(page.getByTestId('interaction-overlay')).toHaveAttribute('data-season', 'winter');

    await page.getByTestId('control-constellations').click();
    await expect(page.getByTestId('interaction-overlay')).toHaveAttribute('data-active-mode', 'constellations');
  });

  test('projects the Rete Celeste and returns to exploration', async ({ page }) => {
    await page.getByTestId('control-rete').click();
    await expect(page.getByTestId('armillary-projection')).toBeVisible();
    await expect(page.getByTestId('armillary-projection')).toHaveAttribute('data-active', 'true');
    await expect(page.getByTestId('interaction-overlay')).toHaveAttribute(
      'data-visual-state',
      'armillaryProjection'
    );
    await expect(page.getByTestId('interaction-overlay')).toHaveAttribute('data-visual-state', 'exploration', {
      timeout: 1_000
    });
  });

  test('runs the ceremony to the final resettable state', async ({ page }) => {
    await page.getByTestId('control-ceremony').click();
    await expect(page.getByTestId('interaction-overlay')).toHaveAttribute('data-visual-state', 'ceremony');
    await expect(page.getByTestId('ceremony-overlay')).toBeVisible();
    await expect(page.getByTestId('ceremony-overlay')).not.toHaveAttribute('data-ceremony-phase', 'final');
    await expect(page.getByTestId('final-inscription')).toContainText('El tiempo no pasa', { timeout: 2_000 });
    await expect(page.getByTestId('ceremony-overlay')).toHaveAttribute('data-ceremony-phase', 'final');

    await page.getByRole('button', { name: 'Reiniciar mecanismo' }).click();
    await expect(page.getByTestId('interaction-overlay')).toHaveAttribute('data-active-mode', 'idle', {
      timeout: 1_000
    });
  });

  test('exposes a calibrated debug hit map with logical tab order', async ({ page }) => {
    const expectedOrder = [
      'hours',
      'moon',
      'season-spring',
      'season-summer',
      'season-autumn',
      'season-winter',
      'constellations',
      'rete',
      'bell'
    ];

    await expect(page.getByTestId('clock-hit-zones')).toHaveAttribute('data-debug', 'false');
    await page.goto('/?demoSpeed=fast&hitZones=1');
    await expect(page.getByTestId('clock-hit-zones')).toHaveAttribute('data-debug', 'true');

    const zones = await page.locator('.clock-hit-zone').evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          height: rect.height,
          width: rect.width,
          zone: node.getAttribute('data-zone')
        };
      })
    );
    expect(zones.map((zone) => zone.zone)).toEqual(expectedOrder);
    expect(zones.every((zone) => zone.width >= 44 && zone.height >= 44)).toBe(true);

    const focusOrder: Array<string | null> = [];
    for (const _zone of expectedOrder) {
      await page.keyboard.press('Tab');
      focusOrder.push(await page.evaluate(() => document.activeElement?.getAttribute('data-zone') ?? null));
    }
    expect(focusOrder).toEqual(expectedOrder);
  });

  test('respects system reduced motion without extra controls', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect(page.getByTestId('app-root')).toHaveAttribute('data-motion', 'reduced');
    await expect(page.getByTestId('interaction-overlay')).toHaveAttribute('data-visual-state', 'initialRest');
    await page.getByTestId('control-rete').click();
    await expect(page.getByTestId('armillary-projection')).toHaveAttribute('data-reduced-motion', 'true');
    await expect(page.getByRole('button', { name: 'Alternar movimiento reducido' })).toHaveCount(0);
  });
});
