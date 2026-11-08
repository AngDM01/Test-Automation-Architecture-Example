import { useEffect, useState } from 'react';
import { productsApi } from '../api/products';
import { ProductCard } from '../components/ProductCard';
import { ProductForm } from '../components/ProductForm';
import type { Product } from '../types/product';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadProducts() {
      setIsLoading(true);
      setError('');
      try {
        const data = await productsApi.list();
        if (isActive) {
          setProducts(data);
        }
      } catch {
        if (isActive) {
          setError(
            'No se pudo cargar el listado de productos. Verifica que la API esté disponible.',
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, [reloadKey]);

  function handleCreated(product: Product) {
    setProducts((current) => [product, ...current]);
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>Productos</h1>
          <p className="page-subtitle">
            Consulta el catálogo y registra nuevos productos.
          </p>
        </div>
      </header>

      <div className="content-grid">
        <section className="panel" aria-labelledby="create-product-title">
          <h2 id="create-product-title">Crear producto</h2>
          <ProductForm onCreated={handleCreated} />
        </section>

        <section className="panel" aria-labelledby="product-list-title">
          <h2 id="product-list-title">Listado</h2>

          {isLoading && (
            <p className="status-message" role="status">
              Cargando productos...
            </p>
          )}

          {!isLoading && error && (
            <div className="alert alert-error" role="alert">
              <p>{error}</p>
              <button
                type="button"
                className="button-secondary"
                onClick={() => setReloadKey((key) => key + 1)}
              >
                Reintentar
              </button>
            </div>
          )}

          {!isLoading && !error && products.length === 0 && (
            <p className="empty-state">No hay productos registrados.</p>
          )}

          {!isLoading && !error && products.length > 0 && (
            <ul className="product-list" aria-label="Lista de productos">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
