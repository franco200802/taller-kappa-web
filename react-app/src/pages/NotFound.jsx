import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section-padding" style={{ paddingTop: 100, textAlign: 'center' }}>
      <h1>404 — Página no encontrada</h1>
      <p>La página que buscás no existe o fue movida.</p>
      <Link to="/" className="btn-main">Ir al Inicio</Link>
    </section>
  );
}
