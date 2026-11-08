import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="page">
      <div className="panel">
        <h1>Página no encontrada</h1>
        <p>La ruta que intentaste abrir no existe.</p>
        <Link to="/">Volver a productos</Link>
      </div>
    </main>
  );
}
