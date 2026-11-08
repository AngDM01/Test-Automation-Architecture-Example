import { describe, expect, it } from 'vitest';
import { validateProductInput } from '../../src/domain/product.js';

describe('validateProductInput', () => {
  it('acepta un producto válido y normaliza los textos', () => {
    const result = validateProductInput({
      name: '  Teclado mecánico  ',
      description: '  Teclado con switches táctiles  ',
      price: 49.999,
      stock: 12,
    });

    expect(result).toEqual({
      ok: true,
      value: {
        name: 'Teclado mecánico',
        description: 'Teclado con switches táctiles',
        price: 50,
        stock: 12,
      },
    });
  });

  it('usa una descripción vacía cuando no se envía', () => {
    const result = validateProductInput({
      name: 'Mouse',
      price: 15,
      stock: 0,
    });

    expect(result).toEqual({
      ok: true,
      value: { name: 'Mouse', description: '', price: 15, stock: 0 },
    });
  });

  it('rechaza un nombre vacío o compuesto solo por espacios', () => {
    const result = validateProductInput({
      name: '   ',
      price: 10,
      stock: 1,
    });

    expect(result).toMatchObject({
      ok: false,
      fields: { name: 'El nombre es obligatorio.' },
    });
  });

  it.each([
    { price: 0, message: 'El precio debe ser mayor que cero.' },
    { price: -10, message: 'El precio debe ser mayor que cero.' },
    { price: Number.NaN, message: 'El precio debe ser un número.' },
    { price: '10', message: 'El precio debe ser un número.' },
  ])('rechaza el precio $price', ({ price, message }) => {
    const result = validateProductInput({
      name: 'Monitor',
      price,
      stock: 1,
    });

    expect(result).toMatchObject({ ok: false, fields: { price: message } });
  });

  it.each([
    { stock: -1, message: 'El stock no puede ser negativo.' },
    { stock: 1.5, message: 'El stock debe ser un número entero.' },
    { stock: '3', message: 'El stock debe ser un número entero.' },
  ])('rechaza el stock $stock', ({ stock, message }) => {
    const result = validateProductInput({
      name: 'Monitor',
      price: 100,
      stock,
    });

    expect(result).toMatchObject({ ok: false, fields: { stock: message } });
  });

  it('acumula todos los errores encontrados', () => {
    const result = validateProductInput({
      name: '',
      price: -1,
      stock: -5,
    });

    expect(result).toMatchObject({
      ok: false,
      message: 'Revisa los datos del producto.',
      fields: {
        name: 'El nombre es obligatorio.',
        price: 'El precio debe ser mayor que cero.',
        stock: 'El stock no puede ser negativo.',
      },
    });
  });
});
