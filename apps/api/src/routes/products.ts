import type { FastifyPluginAsync } from 'fastify';
import type { Product } from '../domain/product.js';
import type { ProductService } from '../services/product-service.js';

interface ProductRoutesOptions {
  service: ProductService;
}

function toResponse(product: Product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    createdAt: product.createdAt.toISOString(),
  };
}

export const productRoutes: FastifyPluginAsync<ProductRoutesOptions> = async (
  app,
  options,
) => {
  const { service } = options;

  app.get('/products', async () => {
    const products = await service.listProducts();
    return products.map(toResponse);
  });

  app.get<{ Params: { id: string } }>('/products/:id', async (request) => {
    const product = await service.getProduct(request.params.id);
    return toResponse(product);
  });

  app.post('/products', async (request, reply) => {
    const product = await service.createProduct(request.body);
    return reply.code(201).send(toResponse(product));
  });
};
