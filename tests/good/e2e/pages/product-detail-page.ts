import { type Locator, type Page } from '@playwright/test';

export class ProductDetailPage {
  readonly heading: Locator;
  readonly details: Locator;
  readonly backLink: Locator;

  constructor(page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.details = page.getByRole('region', {
      name: 'Detalles del producto',
    });
    this.backLink = page.getByRole('link', { name: 'Volver a productos' });
  }
}
