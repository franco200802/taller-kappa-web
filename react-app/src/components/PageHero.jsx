import { Fragment } from 'react';
import Icon from './Icon';
import { Link } from 'react-router-dom';

/**
 * Ruta de navegación visible. Tiene que coincidir con el `breadcrumb` que la página le pasa a <Seo>
 * (el BreadcrumbList del JSON-LD). `trail` son los pasos intermedios entre Inicio y la página actual
 * (ej. [{ to: '/catalogo/', label: 'Catálogo' }]).
 */
export function Breadcrumb({ current, trail = [] }) {
  return (
    <nav className="breadcrumb" aria-label="Ruta de navegación">
      <Link to="/">Inicio</Link>
      {trail.map((t) => (
        <Fragment key={t.to}>
          <Icon name="chevron-right" />
          <Link to={t.to}>{t.label}</Link>
        </Fragment>
      ))}
      <Icon name="chevron-right" />
      <span aria-current="page">{current}</span>
    </nav>
  );
}

/**
 * Encabezado de las páginas internas: breadcrumb + h1 + bajada y, si la página los pasa como
 * `children`, sus botones de acción (por ejemplo, "Pedir cotización" en mobiliario comercial).
 * Las fichas de producto no lo usan: tienen su propia caja de compra (ver Producto.jsx).
 */
export default function PageHero({ title, lead, current, trail = [], children }) {
  return (
    <div className="page-hero">
      <div className="page-hero-content">
        <h1>{title}</h1>
        {lead && <p>{lead}</p>}
        {children}
        <Breadcrumb current={current} trail={trail} />
      </div>
    </div>
  );
}
