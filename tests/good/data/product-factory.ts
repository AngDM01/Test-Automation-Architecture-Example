import type { CreateProductInput } from '../support/types';

/**
 * Genera datos únicos para cada prueba. El prefijo compartido permite que la
 * limpieza elimine únicamente datos creados por la suite buena.
 */
export class ProductFactory {
  private sequence = 0;

  constructor(private readonly prefix: string) {}

  valid(overrides: Partial<CreateProductInput> = {}): CreateProductInput {
    this.sequence += 1;
    return {
      name: `${this.prefix}-producto-${this.sequence}`,
      description: `Producto de prueba ${this.sequence}`,
      price: 19.99,
      stock: 7,
      ...overrides,
    };
  }
}
