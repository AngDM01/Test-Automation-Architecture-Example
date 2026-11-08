import { expect, test } from '@playwright/test';

/**
 * Suite deliberadamente mala.
 *
 * Los anti-patrones son intencionales: se documentan en tests/bad/README.md y
 * en docs/bad-vs-good.md. No deben copiarse en un proyecto real.
 */
test.describe.configure({ mode: 'serial' });

test.describe('Productos - automatización deficiente', () => {
  test('crear producto', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    await page.locator('input').nth(0).fill('Producto Demo');
    await page.locator('textarea').fill('Descripción hardcodeada');
    await page.locator('input').nth(1).fill('99.99');
    await page.locator('input').nth(2).fill('5');
    await page.locator('form button').last().click();

    await page.waitForTimeout(2000);

    const firstCard = page.locator('.product-card').first();
    expect(await firstCard.innerText()).toContain('Producto Demo');
  });

  test('ver detalle del producto creado antes', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);

    await page.locator('.product-card a').first().click();
    await page.waitForTimeout(2000);

    expect(await page.locator('h1').innerText()).toContain('Producto Demo');
  });

  test('rechazar producto inválido', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    await page.locator('input').nth(0).fill('Producto Demo');
    await page.locator('textarea').fill('Descripción hardcodeada');
    await page.locator('input').nth(1).fill('-5');
    await page.locator('input').nth(2).fill('5');
    await page.locator('form button').last().click();

    await page.waitForTimeout(2000);

    expect(await page.locator('body').innerText()).toContain('precio');
  });
});
