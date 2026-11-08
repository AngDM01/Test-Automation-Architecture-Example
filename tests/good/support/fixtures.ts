import { randomUUID } from 'node:crypto';
import { test as base } from '@playwright/test';
import { ProductFactory } from '../data/product-factory';
import { deleteProductsByNamePrefix } from './database';
import { ProductsApi } from './products-api';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://127.0.0.1:3000';

interface SharedFixtures {
  productsApi: ProductsApi;
  productFactory: ProductFactory;
}

export const test = base.extend<SharedFixtures>({
  productsApi: async ({ request }, use) => {
    await use(new ProductsApi(request, API_BASE_URL));
  },

  // Playwright exige que el primer parámetro sea un patrón de destructuración,
  // aunque esta fixture no dependa de otras.
  // eslint-disable-next-line no-empty-pattern
  productFactory: async ({}, use) => {
    const prefix = `qa-good-${randomUUID().slice(0, 8)}`;
    await use(new ProductFactory(prefix));
    await deleteProductsByNamePrefix(prefix);
  },
});

export { expect } from '@playwright/test';
