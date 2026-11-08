import type { ProductFieldErrors } from './product.js';

export class ValidationError extends Error {
  constructor(
    readonly fields: ProductFieldErrors,
    message = 'Revisa los datos del producto.',
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Producto no encontrado.') {
    super(message);
    this.name = 'NotFoundError';
  }
}
