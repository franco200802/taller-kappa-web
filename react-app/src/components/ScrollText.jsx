import { useEffect, useRef, useState } from 'react';

/**
 * ScrollText — lista de frases grandes; la que cruza el centro de la pantalla se resalta y las
 * demás quedan atenuadas.
 *
 * Basado en el componente "Scroll Text" de KokonutUI (kokonutui.com), pero adaptado: el original
 * resalta dentro de un contenedor de 300 px con scroll propio (una trampa de scroll para el
 * usuario). Acá se usa el scroll de la página. Sin Tailwind ni `motion`.
 *  - Todo el texto está siempre en el HTML y visible (nada empieza en opacity 0): se indexa y se
 *    lee igual con o sin JavaScript. El primer elemento arranca activo, igual en servidor y cliente.
 *  - Los colores atenuado y activo cumplen contraste AA (ver `.scroll-text-item` en global.css).
 *  - Con prefers-reduced-motion cambia solo el color, sin desplazamiento.
 *
 * `items`: [{ title, text }]. El título es un h3.
 */
export default function ScrollText({ items, className = '' }) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    // Banda delgada en el centro de la pantalla: el item que la cruza es el activo.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(refs.current.indexOf(entry.target));
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  return (
    <ul className={`scroll-text ${className}`}>
      {items.map((item, i) => (
        <li
          key={item.title}
          className={`scroll-text-item${i === active ? ' is-active' : ''}`}
          ref={(el) => { refs.current[i] = el; }}
        >
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
