import { useEffect, useState } from 'react';
import Icon from './Icon';

/**
 * Lo que respalda la compra, bajo los botones de cada ficha. Son datos que el sitio ya publica: fábrica propia
 * (Nosotros), garantía de por vida en la estructura de hierro (/garantia/), zonas de entrega (/envios/) y
 * factura A y B (FAQ). Si alguno cambia, cambiarlo también en esas páginas.
 */
const TRUST = [
  { icon: 'industry', text: 'Fábrica propia en San Martín, Buenos Aires' },
  { icon: 'shield-alt', text: 'Estructura de hierro con garantía de por vida' },
  { icon: 'truck', text: 'Envíos a CABA, GBA y todo el país' },
  { icon: 'check', text: 'Factura A y B' },
];

export function TrustList() {
  return (
    <ul className="pdp-trust" aria-label="Por qué comprarle a la fábrica">
      {TRUST.map((t) => <li key={t.text}><Icon name={t.icon} /> {t.text}</li>)}
    </ul>
  );
}

/**
 * Lleva el foco al primer grupo de opciones obligatorias sin elegir (altura o columna de la base) y lo muestra.
 * Lo usa la barra cuando todavía no se puede agregar.
 */
export function focusMissingOption(scope) {
  const groups = [...(scope?.querySelectorAll('.bkf3d-options [role="radiogroup"]') ?? [])];
  const group = groups.find((g) => !g.querySelector('[aria-checked="true"]')) ?? groups[0];
  if (!group) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  group.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  group.querySelector('[role="radio"]')?.focus({ preventScroll: true });
}

/**
 * Barra de compra fija de las fichas. Aparece cuando los botones de la ficha (`targetRef`) no están en pantalla
 * —en el celular, desde la primera pantalla: ahí los botones quedan abajo de la galería— y se esconde cuando se ven
 * ellos, los del showroom 3D, el cierre de la página o el pie. Agrega exactamente la variante elegida en la ficha.
 *
 * Arranca oculta igual en el prerender y en el cliente (no cambia la hidratación). Oculta es `inert` y
 * `visibility: hidden`: ni el teclado ni los lectores de pantalla llegan a ella.
 */
export function BuyBar({ targetRef, name, detail, ready, onAdd, onChoose, waHref }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return undefined;
    // También se esconde junto a los botones "para locales" de la ficha (Producto.jsx → ProductBusiness).
    const watched = [target, ...document.querySelectorAll('.bkf-stage-actions, .cta-section, [data-cta="ficha_empresas"], footer')];
    const onScreen = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target)));
      setVisible(onScreen.size === 0);
    });
    watched.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [targetRef]);

  // Mientras la barra se ve, el WhatsApp flotante se esconde (la barra ya tiene el suyo): clase en <html>.
  useEffect(() => {
    document.documentElement.classList.toggle('buy-bar-visible', visible);
    return () => document.documentElement.classList.remove('buy-bar-visible');
  }, [visible]);

  return (
    <div className={`buy-bar${visible ? ' is-visible' : ''}`} inert={visible ? undefined : ''} data-cta="ficha_barra" data-item={name}>
      <div className="buy-bar-text">
        <strong>{name}</strong>
        <span>{detail}</span>
      </div>
      {/* En pantallas angostas el botón dice solo "Agregar" (el resto se oculta con CSS) para que entre el nombre. */}
      <button type="button" className="btn-main" onClick={ready ? onAdd : onChoose}>
        <Icon name="plus" /> {ready ? <>Agregar<span className="buy-bar-more"> al presupuesto</span></> : 'Elegir medidas'}
      </button>
      <a className="buy-bar-wa" href={waHref} target="_blank" rel="noopener noreferrer" aria-label="Consultar precio por WhatsApp">
        <Icon name="whatsapp" />
      </a>
    </div>
  );
}
