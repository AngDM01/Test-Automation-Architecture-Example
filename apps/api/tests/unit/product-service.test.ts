import { describe, expect, it } from 'vitest';
import type { NewProduct, Product } from '../../src/domain/product.js';
import type { ProductRepository } from '../../src/repositories/product-repository.js';
import { ProductService } from '../../src/services/product-service.js';

class FakeProductRepository implements ProductRepository {
  createCalls = 0;

  async findAll(): Promise<Product[]> {
    return [];
  }

  async findById(): Promise<Product | null> {
    return null;
  }

  async create(data: NewProduct): Promise<Product> {
    this.createCalls += 1;
    return {
      id: 'producto-1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      ...data,
    };
  }
}

describe('ProductService', () => {
  it('no persiste un producto cuando las reglas de negocio fallan', async () => {
    const repository = new FakeProductRepository();
    const service = new ProductService(repository);

    await expect(
      service.createProduct({ name: 'Producto', price: -1, stock: 2 }),
    ).rejects.toMatchObject({
      name: 'ValidationError',
      fields: { price: 'El precio debe ser mayor que cero.' },
    });

    expect(repository.createCalls).toBe(0);
  });

  it('persiste un producto válido a través del repositorio', async () => {
    const repository = new FakeProductRepository();
    const service = new ProductService(repository);

    const product = await service.createProduct({
      name: 'Producto',
      description: '',
      price: 20,
      stock: 2,
    });

    expect(repository.createCalls).toBe(1);
    expect(product).toMatchObject({ name: 'Producto', price: 20, stock: 2 });
  });
});
