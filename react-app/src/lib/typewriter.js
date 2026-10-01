/**
 * Motor del typewriter: escribe y borra una lista de frases, en bucle, avisando cada cambio
 * con `onText(texto)`. No sabe nada de React: el componente lo crea en un efecto y lo limpia
 * con `destroy()`. Arranca con la PRIMERA frase completa (`start` la borra tras el retardo).
 */
export function createTypewriter({ sequences, typingSpeed, deleteSpeed, pauseBeforeDelete, naturalVariance, onText }) {
  let timer;
  let index = 0; // frase actual
  let count = sequences[0].length; // letras visibles
  let mode = 'deleting';
  let destroyed = false;

  // Ritmo "humano": a veces una pausa, a veces una ráfaga.
  const typingDelay = () => {
    if (!naturalVariance) return typingSpeed;
    const r = Math.random();
    if (r < 0.1) return typingSpeed * 2;
    if (r > 0.9) return typingSpeed * 0.5;
    return typingSpeed * (0.6 + Math.random() * 0.8);
  };

  const schedule = (delay) => {
    clearTimeout(timer);
    if (!destroyed) timer = setTimeout(step, delay);
  };

  function step() {
    const word = sequences[index];
    if (mode === 'typing') {
      if (count < word.length) {
        count += 1;
        onText(word.slice(0, count));
        schedule(typingDelay());
      } else {
        mode = 'deleting';
        schedule(pauseBeforeDelete);
      }
    } else if (count > 0) {
      count -= 1;
      onText(word.slice(0, count));
      schedule(deleteSpeed);
    } else {
      index = (index + 1) % sequences.length;
      mode = 'typing';
      schedule(150);
    }
  }

  return {
    start: schedule, // start(retardoEnMs)
    stop: () => clearTimeout(timer),
    destroy: () => { destroyed = true; clearTimeout(timer); },
  };
}
