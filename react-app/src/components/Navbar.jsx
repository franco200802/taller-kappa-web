import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo/', label: 'Catálogo' },
  { to: '/sillon-bkf/', label: 'Sillón BKF' },
  { to: '/mobiliario-comercial/', label: 'Mobiliario comercial' },
  { to: '/nosotros/', label: 'Nosotros' },
  { to: '/faq/', label: 'Preguntas' },
  { to: '/contacto/', label: 'Contacto' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();

  // Escape cierra el menú desplegable (mobile), como cualquier otro desplegable.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <nav id="main-nav">
      <NavLink to="/" className="logo" aria-label="Inicio — Taller Kappa" onClick={() => setOpen(false)}>
        Taller <span>Kappa</span>
      </NavLink>

      <ul id="nav-menu" className={`nav-menu ${open ? 'open' : ''}`} role="list">
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
        <button
          type="button"
          className="cart-icon-container"
          // El número del globo se lee acá: el globo solo es visual (y con 0 está oculto).
          aria-label={totalItems > 0 ? `Abrir presupuesto (${totalItems} ${totalItems === 1 ? 'producto' : 'productos'})` : 'Abrir presupuesto'}
          onClick={() => setIsOpen(true)}
        >
          <Icon name="shopping-bag" style={{ fontSize: '1.2rem' }} />
          <span className="cart-badge" aria-hidden="true" style={{ opacity: totalItems > 0 ? 1 : 0 }}>{totalItems}</span>
        </button>
        <button
          className="hamburger"
          type="button"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
