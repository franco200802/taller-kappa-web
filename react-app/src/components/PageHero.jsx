import { Fragment } from 'react';
import Icon from './Icon';
import { Link } from 'react-router-dom';

/**
 * Encabezado de las páginas internas: breadcrumb + h1 + bajada.
 * `trail` son los pasos intermedios entre Inicio y la página actual
 * (ej. [{ to: '/catalogo/', label: 'Catálogo' }]).
 */
export default function PageHero({ title, lead, current, trail = [] }) {
  return (
    <div className="page-hero">
      <div className="page-hero-content">
        <h1>{title}</h1>
        {lead && <p>{lead}</p>}
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
      </div>
    </div>
  );
}
