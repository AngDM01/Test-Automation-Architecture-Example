import { useState, type FormEvent } from 'react';
import { ApiError, productsApi } from '../api/products';
import type { Product } from '../types/product';

type FieldName = 'name' | 'description' | 'price' | 'stock';
type FieldErrors = Partial<Record<FieldName, string>>;

interface ProductFormProps {
  onCreated: (product: Product) => void;
}

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '',
};

export function ProductForm({ onCreated }: ProductFormProps) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  function updateField(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError('');
    setSuccessMessage('');
  }

  function validateShape(): FieldErrors {
    const errors: FieldErrors = {};

    if (!values.name.trim()) {
      errors.name = 'El nombre es obligatorio.';
    }

    if (!values.price.trim()) {
      errors.price = 'El precio es obligatorio.';
    } else if (Number.isNaN(Number(values.price))) {
      errors.price = 'El precio debe ser un número.';
    }

    if (!values.stock.trim()) {
      errors.stock = 'El stock es obligatorio.';
    } else if (!Number.isInteger(Number(values.stock))) {
      errors.stock = 'El stock debe ser un número entero.';
    }

    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    const clientErrors = validateShape();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setIsSaving(true);
    try {
      const product = await productsApi.create({
        name: values.name,
        description: values.description,
        price: Number(values.price),
        stock: Number(values.stock),
      });

      onCreated(product);
      setValues(EMPTY_FORM);
      setFieldErrors({});
      setSuccessMessage('Producto creado correctamente.');
    } catch (error) {
      if (error instanceof ApiError) {
        const serverFields: FieldErrors = {};
        for (const field of [
          'name',
          'description',
          'price',
          'stock',
        ] as const) {
          if (error.fields[field]) {
            serverFields[field] = error.fields[field];
          }
        }
        setFieldErrors(serverFields);
        setFormError(error.message);
      } else {
        setFormError(
          'No se pudo conectar con el servidor. Verifica que la API esté disponible.',
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="product-form"
      aria-label="Crear producto"
      onSubmit={handleSubmit}
      noValidate
    >
      {formError && (
        <div className="alert alert-error" role="alert">
          {formError}
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success" role="status">
          {successMessage}
        </div>
      )}

      <div className="field">
        <label htmlFor="product-name">Nombre</label>
        <input
          id="product-name"
          name="name"
          value={values.name}
          onChange={(event) => updateField('name', event.target.value)}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? 'product-name-error' : undefined}
          autoComplete="off"
        />
        {fieldErrors.name && (
          <p className="field-error" id="product-name-error">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="product-description">Descripción</label>
        <textarea
          id="product-description"
          name="description"
          rows={3}
          value={values.description}
          onChange={(event) => updateField('description', event.target.value)}
          aria-invalid={Boolean(fieldErrors.description)}
          aria-describedby={
            fieldErrors.description ? 'product-description-error' : undefined
          }
        />
        {fieldErrors.description && (
          <p className="field-error" id="product-description-error">
            {fieldErrors.description}
          </p>
        )}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="product-price">Precio</label>
          <input
            id="product-price"
            name="price"
            type="number"
            step="0.01"
            inputMode="decimal"
            value={values.price}
            onChange={(event) => updateField('price', event.target.value)}
            aria-invalid={Boolean(fieldErrors.price)}
            aria-describedby={
              fieldErrors.price ? 'product-price-error' : undefined
            }
          />
          {fieldErrors.price && (
            <p className="field-error" id="product-price-error">
              {fieldErrors.price}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="product-stock">Stock</label>
          <input
            id="product-stock"
            name="stock"
            type="number"
            step="1"
            inputMode="numeric"
            value={values.stock}
            onChange={(event) => updateField('stock', event.target.value)}
            aria-invalid={Boolean(fieldErrors.stock)}
            aria-describedby={
              fieldErrors.stock ? 'product-stock-error' : undefined
            }
          />
          {fieldErrors.stock && (
            <p className="field-error" id="product-stock-error">
              {fieldErrors.stock}
            </p>
          )}
        </div>
      </div>

      <button type="submit" className="button-primary" disabled={isSaving}>
        {isSaving ? 'Guardando...' : 'Crear producto'}
      </button>
    </form>
  );
}
