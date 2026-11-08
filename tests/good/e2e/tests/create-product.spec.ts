import { expect, test } from '../fixtures/test';

test.describe('Creación de productos', () => {
  test('crea un producto, lo muestra en el listado y permite ver su detalle', async ({
    page,
    productsPage,
    productDetailPage,
    createProductFlow,
    productFactory,
  }) => {
    const product = productFactory.valid({
      description: 'Descripción del producto creado por la interfaz',
      price: 42.5,
      stock: 11,
    });

    await productsPage.goto();
    await createProductFlow.create(product);

    const card = productsPage.productCard(product.name);
    await expect(card).toBeVisible();
    await expect(card).toContainText('$42.50');
    await expect(card).toContainText('11 unidades');

    await productsPage.openProductDetails(product.name);

    await expect(page).toHaveURL(/\/products\/[^/]+$/);
    await expect(productDetailPage.heading).toHaveText(product.name);
    await expect(productDetailPage.details).toContainText('$42.50');
    await expect(productDetailPage.details).toContainText('11 unidades');
    await expect(productDetailPage.backLink).toBeVisible();
  });
});
