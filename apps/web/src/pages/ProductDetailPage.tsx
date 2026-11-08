import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiError, productsApi } from '../api/products';
import type { Product } from '../types/product';
import { formatDate, formatPrice } from '../utils/format';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadProduct() {
      if (!id) {
        setError('No se indicó el producto que se desea consultar.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');
      try {
        const data = await productsApi.get(id);
        if (isActive) {
          setProduct(data);
        }
      } catch (caughtError) {
        if (isActive) {
          setError(
            caughtError instanceof ApiError && caughtError.status === 404
              ? 'El producto solicitado no existe.'
              : 'No se pudo cargar el producto. Verifica que la API esté disponible.',
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      isActive = false;
    };
  }, [id]);

  return (
    <main className="page">
      <Link className="back-link" to="/" aria-label="Volver a productos">
        ← Volver a productos
      </Link>

      {isLoading && (
        <p className="status-message" role="status">
          Cargando producto...
        </p>
      )}

      {!isLoading && error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {!isLoading && !error && product && (
        <article className="panel detail-panel">
          <h1>{product.name}</h1>
          <p className="product-description">
            {product.description || 'Sin descripción'}
          </p>

          <section aria-label="Detalles del producto">
            <dl className="product-meta detail-meta">
              <div>
                <dt>Precio</dt>
                <dd>{formatPrice(product.price)}</dd>
              </div>
              <div>
                <dt>Stock</dt>
                <dd>{product.stock} unidades</dd>
              </div>
              <div>
                <dt>Identificador</dt>
                <dd>{product.id}</dd>
              </div>
              <div>
                <dt>Creado</dt>
                <dd>{formatDate(product.createdAt)}</dd>
              </div>
            </dl>
          </section>
        </article>
      )}
    </main>
  );
}
