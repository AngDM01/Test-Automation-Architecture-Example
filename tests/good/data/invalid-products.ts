import type { CreateProductInput } from '../support/types';

export interface InvalidProductCase {
  id: string;
  title: string;
  overrides: Partial<CreateProductInput>;
  field: 'name' | 'price' | 'stock';
  message: string;
}

export const invalidProductCases: InvalidProductCase[] = [
  {
    id: 'precio-negativo',
    title: 'un precio negativo',
    overrides: { price: -0.01 },
    field: 'price',
    message: 'El precio debe ser mayor que cero.',
  },
  {
    id: 'precio-cero',
    title: 'un precio igual a cero',
    overrides: { price: 0 },
    field: 'price',
    message: 'El precio debe ser mayor que cero.',
  },
  {
    id: 'stock-negativo',
    title: 'un stock negativo',
    overrides: { stock: -1 },
    field: 'stock',
    message: 'El stock no puede ser negativo.',
  },
  {
    id: 'nombre-vacio',
    title: 'un nombre vacío',
    overrides: { name: '   ' },
    field: 'name',
    message: 'El nombre es obligatorio.',
  },
];
