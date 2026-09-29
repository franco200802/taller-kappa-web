import { useEffect, useRef } from 'react';

// <dialog> nativo abierto con showModal(). El navegador resuelve solo lo que
// antes se hacía a mano (o faltaba): el foco queda atrapado adentro, el resto
// de la página se vuelve inerte (ni Tab ni lectores de pantalla llegan), Escape
// cierra y, al cerrar, el foco vuelve al botón que lo abrió.
//
// El <dialog> ocupa toda la pantalla (ver sección "Modales" en global.css), así
// que un click cuyo target es el propio <dialog> es un click en el fondo.
//
// `open` es la fuente de verdad; `onClose` se llama cada vez que el navegador
// lo cierra (Escape, click en el fondo o el botón de cerrar) para que el
// estado de React se entere.
export default function Modal({ open, onClose, className, label, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={className}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => { if (e.target === e.currentTarget) ref.current.close(); }}
      {...rest}
    >
      {children}
    </dialog>
  );
}
