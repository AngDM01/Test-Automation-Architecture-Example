import { test as base } from '../../support/fixtures';
import { CreateProductFlow } from '../flows/create-product-flow';
import { ProductDetailPage } from '../pages/product-detail-page';
import { ProductsPage } from '../pages/products-page';

interface UiFixtures {
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  createProductFlow: CreateProductFlow;
}

export const test = base.extend<UiFixtures>({
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  createProductFlow: async ({ productsPage }, use) => {
    await use(new CreateProductFlow(productsPage));
  },
});

export { expect } from '@playwright/test';
