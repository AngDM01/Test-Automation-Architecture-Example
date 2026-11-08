import { NotFoundError, ValidationError } from '../domain/errors.js';
import { validateProductInput, type Product } from '../domain/product.js';
import type { ProductRepository } from '../repositories/product-repository.js';

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  listProducts(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundError();
    }
    return product;
  }

  async createProduct(input: unknown): Promise<Product> {
    const result = validateProductInput(input);
    if (!result.ok) {
      throw new ValidationError(result.fields, result.message);
    }
    return this.repository.create(result.value);
  }
}
