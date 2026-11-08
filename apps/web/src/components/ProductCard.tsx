import { Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { formatDate, formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <li className="product-card">
      <h3>{product.name}</h3>
      <p className="product-description">
        {product.description || 'Sin descripción'}
      </p>
      <dl className="product-meta">
        <div>
          <dt>Precio</dt>
          <dd>{formatPrice(product.price)}</dd>
        </div>
        <div>
          <dt>Stock</dt>
          <dd>{product.stock} unidades</dd>
        </div>
        <div>
          <dt>Creado</dt>
          <dd>{formatDate(product.createdAt)}</dd>
        </div>
      </dl>
      <Link
        to={`/products/${product.id}`}
        aria-label={`Ver detalle de ${product.name}`}
      >
        Ver detalle
      </Link>
    </li>
  );
}
