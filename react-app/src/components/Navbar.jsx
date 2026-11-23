import { NavLink, useLocation } from 'react-router-dom';
import Icon from './Icon';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLang } from '../i18n/LangContext';

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
  const { totalItems, setIsOpen, addedCount } = useCart();
  const { isEn, toggle } = useLang();
  const { pathname } = useLocation();
  const burgerRef = useRef(null);
  const [bumped, setBumped] = useState(false);

  // Menú del celular: se cierra al cambiar de página y con Escape (el foco vuelve al botón), y mientras
  // está abierto la página de atrás no se desplaza (ocupa toda la pantalla).
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      burgerRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add('menu-open');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('menu-open');
    };
  }, [open]);

  // Cada producto agregado hace "latir" una vez el contador del presupuesto (CSS, sin movimiento si se pidió
  // reducirlo). addedCount arranca en 0 igual en el prerender y en el cliente.
  useEffect(() => {
    if (!addedCount) return undefined;
    setBumped(true);
    const timer = setTimeout(() => setBumped(false), 600);
    return () => clearTimeout(timer);
  }, [addedCount]);

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
        {/* translate="no": el traductor del DOM (i18n/translate.js) no toca este botón, que siempre habla en el idioma al que lleva. */}
        <button
          type="button"
          className="lang-toggle"
          translate="no"
          lang={isEn ? 'es' : 'en'}
          // El nombre accesible empieza con el texto visible (ES/EN): quien maneja la página por voz dice lo que ve.
          aria-label={isEn ? 'ES: ver esta página en español' : 'EN: view this page in English'}
          title={isEn ? 'Ver en español' : 'View in English'}
          onClick={toggle}
        >
          <Icon name="globe-americas" />
          <span>{isEn ? 'ES' : 'EN'}</span>
        </button>
        <button
          type="button"
          className={`cart-icon-container${bumped ? ' is-bumped' : ''}`}
          aria-label="Abrir presupuesto"
          onClick={() => setIsOpen(true)}
        >
          <Icon name="shopping-bag" style={{ fontSize: '1.2rem' }} />
          {/* En desktop el ícono solo no decía qué era: acá no hay carrito de compra, hay un presupuesto. */}
          <span className="cart-label" aria-hidden="true">Presupuesto</span>
          <span className="cart-badge" style={{ opacity: totalItems > 0 ? 1 : 0 }}>{totalItems}</span>
        </button>
        <button
          ref={burgerRef}
          type="button"
          className="hamburger"
          aria-label="Abrir menú"
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
