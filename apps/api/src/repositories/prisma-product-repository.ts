import type { PrismaClient, Product as PrismaProduct } from '@prisma/client';
import type { NewProduct, Product } from '../domain/product.js';
import type { ProductRepository } from './product-repository.js';

function toDomain(product: PrismaProduct): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price.toNumber(),
    stock: product.stock,
    createdAt: product.createdAt,
  };
}

export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly client: PrismaClient) {}

  async findAll(): Promise<Product[]> {
    const products = await this.client.product.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
    return products.map(toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.client.product.findUnique({ where: { id } });
    return product ? toDomain(product) : null;
  }

  async create(data: NewProduct): Promise<Product> {
    const product = await this.client.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
      },
    });
    return toDomain(product);
  }
}
