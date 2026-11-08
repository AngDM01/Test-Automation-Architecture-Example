import { invalidProductCases } from '../data/invalid-products';
import { expect, test } from '../support/fixtures';
import type { ApiErrorResponse, Product } from '../support/types';

test.describe('API de productos', () => {
  test('lista los productos e incluye uno recién creado', async ({
    productsApi,
    productFactory,
  }) => {
    const input = productFactory.valid();
    const created = await productsApi.createValid(input);

    const products = await productsApi.list();

    expect(products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: created.id,
          name: input.name,
          description: input.description,
          price: input.price,
          stock: input.stock,
        }),
      ]),
    );
  });

  test('consulta un producto existente por su id', async ({
    productsApi,
    productFactory,
  }) => {
    const input = productFactory.valid({ description: 'Detalle esperado' });
    const created = await productsApi.createValid(input);

    const response = await productsApi.get(created.id);

    expect(response.status()).toBe(200);
    const body = (await response.json()) as Product;
    expect(body).toMatchObject({
      id: created.id,
      name: input.name,
      description: 'Detalle esperado',
      price: input.price,
      stock: input.stock,
    });
    expect(new Date(body.createdAt).toString()).not.toBe('Invalid Date');
  });

  test('crea un producto válido y lo persiste', async ({
    productsApi,
    productFactory,
  }) => {
    const input = productFactory.valid({ price: 123.45, stock: 9 });

    const response = await productsApi.create(input);

    expect(response.status()).toBe(201);
    const body = (await response.json()) as Product;
    expect(body).toMatchObject({
      name: input.name,
      description: input.description,
      price: 123.45,
      stock: 9,
    });
    expect(body.id).toEqual(expect.any(String));
    expect(body.createdAt).toEqual(expect.any(String));

    const persisted = await productsApi.get(body.id);
    expect(persisted.status()).toBe(200);
    expect(await persisted.json()).toMatchObject({ id: body.id, name: input.name });
  });

  test('responde 404 cuando el producto no existe', async ({ productsApi }) => {
    const response = await productsApi.get('producto-que-no-existe');

    expect(response.status()).toBe(404);
    const body = (await response.json()) as ApiErrorResponse;
    expect(body.error.code).toBe('NOT_FOUND');
  });

  for (const scenario of invalidProductCases) {
    test(`rechaza ${scenario.title}`, async ({
      productsApi,
      productFactory,
    }) => {
      const input = productFactory.valid(scenario.overrides);

      const response = await productsApi.create(input);

      expect(response.status()).toBe(400);
      const body = (await response.json()) as ApiErrorResponse;
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(body.error.fields?.[scenario.field]).toBe(scenario.message);
    });
  }
});
