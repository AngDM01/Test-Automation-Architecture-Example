import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductsPage } from './pages/ProductsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <Link className="app-brand" to="/">
            Administración de productos
          </Link>
        </header>

        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <footer className="app-footer">
          Demostración académica de arquitecturas de automatización de pruebas
        </footer>
      </div>
    </BrowserRouter>
  );
}
