export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
}

export interface NewProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export type ProductFieldErrors = Partial<
  Record<'name' | 'description' | 'price' | 'stock', string>
>;

export type ProductValidationResult =
  | { ok: true; value: NewProduct }
  | { ok: false; message: string; fields: ProductFieldErrors };

const MAX_PRICE = 99_999_999.99;
const MAX_STOCK = 2_147_483_647;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Valida y normaliza la entrada de un producto.
 *
 * Esta función es pura y no conoce HTTP ni Prisma. Es la única fuente de
 * verdad para las reglas de negocio y puede probarse sin base de datos.
 */
export function validateProductInput(input: unknown): ProductValidationResult {
  const fields: ProductFieldErrors = {};

  if (!isRecord(input)) {
    return {
      ok: false,
      message: 'Los datos del producto no son válidos.',
      fields: { name: 'El nombre es obligatorio.' },
    };
  }

  const rawName = input.name;
  const name = typeof rawName === 'string' ? rawName.trim() : '';
  if (!name) {
    fields.name = 'El nombre es obligatorio.';
  }

  const rawDescription = input.description;
  let description = '';
  if (rawDescription !== undefined && rawDescription !== null) {
    if (typeof rawDescription !== 'string') {
      fields.description = 'La descripción debe ser texto.';
    } else {
      description = rawDescription.trim();
    }
  }

  const rawPrice = input.price;
  let price = 0;
  if (typeof rawPrice !== 'number' || !Number.isFinite(rawPrice)) {
    fields.price = 'El precio debe ser un número.';
  } else if (rawPrice <= 0) {
    fields.price = 'El precio debe ser mayor que cero.';
  } else if (rawPrice > MAX_PRICE) {
    fields.price = 'El precio supera el máximo permitido.';
  } else {
    price = Math.round(rawPrice * 100) / 100;
  }

  const rawStock = input.stock;
  let stock = 0;
  if (typeof rawStock !== 'number' || !Number.isInteger(rawStock)) {
    fields.stock = 'El stock debe ser un número entero.';
  } else if (rawStock < 0) {
    fields.stock = 'El stock no puede ser negativo.';
  } else if (rawStock > MAX_STOCK) {
    fields.stock = 'El stock supera el máximo permitido.';
  } else {
    stock = rawStock;
  }

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      message: 'Revisa los datos del producto.',
      fields,
    };
  }

  return {
    ok: true,
    value: { name, description, price, stock },
  };
}
