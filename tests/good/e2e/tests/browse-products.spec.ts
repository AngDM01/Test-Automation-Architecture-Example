import { expect, test } from '../fixtures/test';

test.describe('Consulta de productos', () => {
  test('muestra en el listado un producto preparado mediante la API', async ({
    productsApi,
    productFactory,
    productsPage,
  }) => {
    const input = productFactory.valid({
      description: 'Producto preparado por la API',
      price: 35.5,
      stock: 4,
    });
    await productsApi.createValid(input);

    await productsPage.goto();

    const card = productsPage.productCard(input.name);
    await expect(card).toBeVisible();
    await expect(card).toContainText('Producto preparado por la API');
    await expect(card).toContainText('$35.50');
    await expect(card).toContainText('4 unidades');
  });
});
