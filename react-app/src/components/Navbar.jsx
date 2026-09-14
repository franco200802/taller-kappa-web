import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/sillon-bkf', label: 'Sillón BKF' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/faq', label: 'Preguntas' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();

  return (
    <nav id="main-nav">
      <NavLink to="/" className="logo" aria-label="Inicio — Taller Kappa" onClick={() => setOpen(false)}>
        Taller <span>Kappa</span>
      </NavLink>

      <ul className={`nav-menu ${open ? 'open' : ''}`} role="list">
        {NAV_LINKS.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active-page' : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="nav-actions">
        <div
          className="cart-icon-container"
          role="button"
          tabIndex={0}
          aria-label="Abrir presupuesto"
          onClick={() => setIsOpen(true)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(true)}
        >
          <i className="fas fa-shopping-bag" style={{ fontSize: '1.2rem' }} />
          <span className="cart-badge" style={{ opacity: totalItems > 0 ? 1 : 0 }}>{totalItems}</span>
        </div>
        <button
          className="hamburger"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
