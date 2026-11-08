import Fastify, { type FastifyError } from 'fastify';
import { NotFoundError, ValidationError } from './domain/errors.js';
import { env } from './env.js';
import { prisma } from './prisma.js';
import { PrismaProductRepository } from './repositories/prisma-product-repository.js';
import { productRoutes } from './routes/products.js';
import { ProductService } from './services/product-service.js';

interface BuildAppOptions {
  logger?: boolean;
  service?: ProductService;
}

export function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify({
    logger: options.logger ?? env.nodeEnv !== 'test',
  });

  const service =
    options.service ?? new ProductService(new PrismaProductRepository(prisma));

  app.get('/health', async () => ({ status: 'ok' }));

  app.register(productRoutes, { prefix: '/api', service });

  app.setNotFoundHandler((_request, reply) => {
    return reply.code(404).send({
      error: {
        code: 'NOT_FOUND',
        message: 'Recurso no encontrado.',
      },
    });
  });

  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error instanceof ValidationError) {
      return reply.code(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
          fields: error.fields,
        },
      });
    }

    if (error instanceof NotFoundError) {
      return reply.code(404).send({
        error: {
          code: 'NOT_FOUND',
          message: error.message,
        },
      });
    }

    if (error.statusCode && error.statusCode < 500) {
      return reply.code(error.statusCode).send({
        error: {
          code: 'BAD_REQUEST',
          message: 'La solicitud no es válida.',
        },
      });
    }

    request.log.error(error);
    return reply.code(500).send({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Ocurrió un error interno en el servidor.',
      },
    });
  });

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });

  return app;
}
