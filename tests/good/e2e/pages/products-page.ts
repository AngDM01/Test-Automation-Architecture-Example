import { expect, type Locator, type Page } from '@playwright/test';
import type { CreateProductInput } from '../../support/types';

/**
 * Page Object del listado y del formulario de creación.
 *
 * Utiliza únicamente selectores semánticos (roles y etiquetas accesibles) y
 * esperas automáticas de Playwright. No conoce detalles de implementación como
 * clases CSS, orden de inputs o tiempos de red.
 */
export class ProductsPage {
  readonly heading: Locator;
  readonly form: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly priceInput: Locator;
  readonly stockInput: Locator;
  readonly createButton: Locator;
  readonly successMessage: Locator;
  readonly emptyState: Locator;
  readonly productList: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Productos', level: 1 });
    this.form = page.getByRole('form', { name: 'Crear producto' });
    this.nameInput = page.getByLabel('Nombre', { exact: true });
    this.descriptionInput = page.getByLabel('Descripción', { exact: true });
    this.priceInput = page.getByLabel('Precio', { exact: true });
    this.stockInput = page.getByLabel('Stock', { exact: true });
    this.createButton = this.form.getByRole('button', {
      name: 'Crear producto',
    });
    this.successMessage = page
      .getByRole('status')
      .filter({ hasText: 'Producto creado correctamente.' });
    this.emptyState = page.getByText('No hay productos registrados.');
    this.productList = page.getByRole('list', { name: 'Lista de productos' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.heading).toBeVisible();
  }

  async fillProduct(product: CreateProductInput): Promise<void> {
    await this.nameInput.fill(product.name);
    await this.descriptionInput.fill(product.description);
    await this.priceInput.fill(String(product.price));
    await this.stockInput.fill(String(product.stock));
  }

  async submit(): Promise<void> {
    await this.createButton.click();
  }

  productCard(name: string): Locator {
    return this.productList
      .getByRole('listitem')
      .filter({ hasText: name });
  }

  async openProductDetails(name: string): Promise<void> {
    await this.productCard(name)
      .getByRole('link', { name: `Ver detalle de ${name}`, exact: true })
      .click();
  }

  get formAlert(): Locator {
    return this.form.getByRole('alert');
  }

  fieldError(message: string): Locator {
    return this.form.getByText(message, { exact: true });
  }
}
