import { invalidProductCases } from '../../data/invalid-products';
import { expect, test } from '../fixtures/test';

const casesWithServerSideRule = invalidProductCases.filter(
  (scenario) => scenario.field !== 'name',
);

test.describe('Validación de productos', () => {
  for (const scenario of casesWithServerSideRule) {
    test(`rechaza ${scenario.title} y muestra el error del backend`, async ({
      productsPage,
      createProductFlow,
      productFactory,
    }) => {
      const product = productFactory.valid(scenario.overrides);

      await productsPage.goto();
      await createProductFlow.attempt(product);

      await expect(productsPage.formAlert).toContainText(
        'Revisa los datos del producto.',
      );
      await expect(productsPage.fieldError(scenario.message)).toBeVisible();
      await expect(productsPage.productCard(product.name)).toHaveCount(0);
    });
  }
});
