import { useEffect, useRef, useState } from 'react';
import { createTypewriter } from '../lib/typewriter';

/**
 * TypeWriter — escribe y borra una lista de frases con un cursor que parpadea.
 *
 * Basado en el componente "Type Writer" de KokonutUI (kokonutui.com), reimplementado sin
 * Tailwind ni `motion` (que sumarían ~40 kB de JS): el cursor es CSS y el tipeo vive en lib/typewriter.js
 * (un temporizador, sin React). Diferencias pensadas para un sitio que tiene que indexarse y ser accesible:
 *  - El HTML prerenderizado (y el primer render del cliente) trae la PRIMERA frase completa,
 *    no vacío: no hay salto de layout ni texto que dependa de JavaScript. La animación
 *    empieza después de `startDelay`.
 *  - Lectores de pantalla y buscadores reciben el texto completo (`srText`, con todas las
 *    frases) en un span visually-hidden; el texto que se mueve va con aria-hidden.
 *  - Con prefers-reduced-motion no anima: queda la primera frase fija.
 *  - Se pausa cuando el texto sale de pantalla o la pestaña está oculta.
 *
 * `sequences`: ['frase 1', 'frase 2', …]. Siempre escribe, espera y borra, en bucle.
 */
function TypeWriterBody({
  sequences,
  typingSpeed = 60,
  deleteSpeed = 35,
  startDelay = 2600,
  pauseBeforeDelete = 2200,
  naturalVariance = true,
  srText,
  className = '',
}) {
  // `typed` es solo lo que la animación fue escribiendo; null = todavía no empezó, y se muestra la primera
  // frase entera (así el HTML del servidor y el primer render del cliente coinciden, y un cambio de
  // `sequences` no deja texto viejo en pantalla).
  const [typed, setTyped] = useState(null);
  const text = typed ?? sequences[0];
  const wrapRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const engine = createTypewriter({ sequences, typingSpeed, deleteSpeed, pauseBeforeDelete, naturalVariance, onText: setTyped });
    let visible = true;

    const io = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) engine.start(300); else engine.stop();
    });
    if (io && wrapRef.current) io.observe(wrapRef.current);
    const onVisibility = () => { if (document.hidden) engine.stop(); else if (visible) engine.start(300); };
    document.addEventListener('visibilitychange', onVisibility);

    engine.start(startDelay);
    return () => {
      engine.destroy();
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [sequences, typingSpeed, deleteSpeed, startDelay, pauseBeforeDelete, naturalVariance]);

  return (
    <span className={`typewriter ${className}`} ref={wrapRef}>
      <span className="visually-hidden">{srText ?? sequences.join(', ')}</span>
      <span className="typewriter-text" aria-hidden="true">{text}</span>
      <span className="typewriter-cursor" aria-hidden="true" />
    </span>
  );
}

/**
 * Cambiar la lista de frases remonta el cuerpo (key): el estado vuelve a empezar solo, sin efectos que
 * lo reseteen a mano. La clave es el contenido, así que pasar un array nuevo con las mismas frases
 * (por ejemplo definido inline) no reinicia el tipeo.
 */
export default function TypeWriter(props) {
  return <TypeWriterBody key={props.sequences.join('\u0000')} {...props} />;
}
