import { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast } = useCart();
  const ref = useRef(null);

  // Los modales (<dialog> con showModal) viven en la "top layer", por encima
  // de cualquier z-index: sin esto, un aviso disparado con el carrito abierto
  // ("Tu presupuesto está vacío") quedaba tapado. Como popover, el toast
  // también entra a la top layer. Queda siempre abierto (invisible con
  // opacity:0, como antes) para que la región aria-live exista desde el
  // principio, y se reabre en cada aviso para quedar arriba del último
  // modal abierto. Navegadores sin popover ignoran el atributo y siguen
  // usando el z-index de siempre.
  useEffect(() => {
    const el = ref.current;
    if (!el?.showPopover) return;
    if (el.matches(':popover-open')) el.hidePopover();
    el.showPopover();
  }, [toast]);

  // El texto va en su propio nodo (la traducción al inglés lo reconoce entero) y la acción, si hay, es un
  // botón aparte: "Ver presupuesto" abre el presupuesto sin buscar el ícono de la barra.
  return (
    <div id="toast" ref={ref} popover="manual" role="status" aria-live="polite" className={`${toast ? 'show' : ''}${toast?.action ? ' has-action' : ''}`}>
      {toast && <span>{toast.msg}</span>}
      {toast?.action && (
        <button type="button" className="toast-action" onClick={toast.action.onClick}>{toast.action.label}</button>
      )}
    </div>
  );
}
