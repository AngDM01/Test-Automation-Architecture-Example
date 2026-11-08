import { expect } from '@playwright/test';
import type { CreateProductInput } from '../../support/types';
import type { ProductsPage } from '../pages/products-page';

/**
 * Flow Model: expresa un caso de uso completo reutilizando las acciones de los
 * Page Objects. Los tests describen qué se quiere lograr; el flujo concentra el
 * cómo.
 */
export class CreateProductFlow {
  constructor(private readonly productsPage: ProductsPage) {}

  async create(product: CreateProductInput): Promise<void> {
    await this.productsPage.fillProduct(product);
    await this.productsPage.submit();
    await expect(this.productsPage.successMessage).toBeVisible();
  }

  async attempt(product: CreateProductInput): Promise<void> {
    await this.productsPage.fillProduct(product);
    await this.productsPage.submit();
  }
}
