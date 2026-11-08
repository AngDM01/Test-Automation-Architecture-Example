import type { NewProduct, Product } from '../domain/product.js';

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(data: NewProduct): Promise<Product>;
}
