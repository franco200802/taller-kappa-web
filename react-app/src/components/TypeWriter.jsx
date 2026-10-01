import { useEffect, useRef, useState } from 'react';

/**
 * TypeWriter — escribe y borra una lista de frases con un cursor que parpadea.
 *
 * Basado en el componente "Type Writer" de KokonutUI (kokonutui.com), reimplementado sin
 * Tailwind ni `motion` (que sumarían ~40 kB de JS): el cursor es CSS y el tipeo, un
 * temporizador. Diferencias pensadas para un sitio que tiene que indexarse y ser accesible:
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
export default function TypeWriter({
  sequences,
  typingSpeed = 60,
  deleteSpeed = 35,
  startDelay = 2600,
  pauseBeforeDelete = 2200,
  naturalVariance = true,
  srText,
  className = '',
}) {
  const [text, setText] = useState(sequences[0]);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let timer;
    let index = 0; // frase actual
    let count = sequences[0].length; // letras visibles
    let mode = 'deleting'; // arranca mostrando la primera frase entera
    let visible = true;

    // Ritmo "humano": a veces una pausa, a veces una ráfaga.
    const typingDelay = () => {
      if (!naturalVariance) return typingSpeed;
      const r = Math.random();
      if (r < 0.1) return typingSpeed * 2;
      if (r > 0.9) return typingSpeed * 0.5;
      return typingSpeed * (0.6 + Math.random() * 0.8);
    };

    const run = () => {
      const word = sequences[index];
      if (mode === 'typing') {
        if (count < word.length) {
          count += 1;
          setText(word.slice(0, count));
          timer = setTimeout(run, typingDelay());
        } else {
          mode = 'deleting';
          timer = setTimeout(run, pauseBeforeDelete);
        }
      } else if (count > 0) {
        count -= 1;
        setText(word.slice(0, count));
        timer = setTimeout(run, deleteSpeed);
      } else {
        index = (index + 1) % sequences.length;
        mode = 'typing';
        timer = setTimeout(run, 150);
      }
    };

    const start = (delay) => { clearTimeout(timer); timer = setTimeout(run, delay); };
    const stop = () => clearTimeout(timer);

    const io = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) start(300); else stop();
    });
    if (io && wrapRef.current) io.observe(wrapRef.current);
    const onVisibility = () => { if (document.hidden) stop(); else if (visible) start(300); };
    document.addEventListener('visibilitychange', onVisibility);

    start(startDelay);
    return () => {
      stop();
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
