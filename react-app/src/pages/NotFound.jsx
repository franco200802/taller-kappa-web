export default function NotFound() {
  return (
    <section className="section-padding" style={{ paddingTop: 100, textAlign: 'center' }}>
      <h1>404 — Página no encontrada</h1>
      <p>La página que buscás no existe o fue movida.</p>
      <a href="/" className="btn-main">Ir al Inicio</a>
    </section>
  );
}
