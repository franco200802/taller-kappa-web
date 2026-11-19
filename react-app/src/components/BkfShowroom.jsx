import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import Picture from './Picture';
import { SwatchGroup } from './Bkf3D';
import { useCart } from '../context/CartContext';
import { FINISH_COLORS, LEATHER_COLORS, PRODUCTS } from '../data/products';
import { trackEvent } from '../lib/analytics';
import { loadBkf3d } from '../lib/loadBkf3d';

/**
 * Showroom del sillón BKF en la home: una sección oscura con la silla en 3D que gira y cambia con el scroll, en
 * cuatro capítulos (diseño, estructura, cuero, medidas y acabados).
 *
 * Reglas que cumple (ver CONTEXTO_PROYECTO §5l):
 * - Los textos son HTML normal que se prerenderiza y se lee sin JavaScript: las tarjetas pasan por encima de la
 *   escena fija, no aparecen ni desaparecen con JS. El 3D es decoración encima de eso.
 * - three.js se descarga recién cuando la sección está a una pantalla de distancia, nunca en la carga de la home.
 *   Con "ahorro de datos" o sin WebGL se muestra una foto en su lugar.
 * - El progreso del scroll se escribe en una variable CSS y en la escena, sin re-renderizar React en cada cuadro.
 */
const BKF = PRODUCTS[0];
const STEPS = 4;
const LABELS = { width: 'Ancho', depth: 'Profundidad', height: 'Alto' };
const leatherHex = (name) => LEATHER_COLORS.find((l) => l.name === name)?.swatch;

export default function BkfShowroom() {
  const { addToCart } = useCart();
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const hostRef = useRef(null);
  const labelRefs = useRef({});
  const stageRef = useRef(null);
  const progressRef = useRef(0);
  const cardRefs = useRef([]);
  const freeRef = useRef(null);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState('idle'); // idle → loading → ready | fallback
  const [finish, setFinish] = useState('Negro Mate');
  const [leather, setLeather] = useState(LEATHER_COLORS[0].name);
  const { width, depth, height } = BKF.dimensions;

  // Scroll → progreso de la sección (0 a 1). Un solo listener pasivo, a lo sumo una cuenta por cuadro.
  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const range = r.height - sticky.offsetHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, (top - r.top) / range)) : 0;
      progressRef.current = p;
      section.style.setProperty('--p', p.toFixed(4));
      stageRef.current?.setProgress(p);
      const step = Math.round(p * (STEPS - 1));
      setActive((cur) => (cur === step ? cur : step));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // En el celular la tarjeta tapa la parte de abajo: se mide cuánto espacio deja libre cada una (cambia con la
  // fuente, el idioma y el ancho) para que la escena encuadre la silla entera arriba.
  useEffect(() => {
    const measure = () => {
      const stageH = stickyRef.current?.offsetHeight;
      if (!stageH) return;
      freeRef.current = cardRefs.current.map((el) => (el ? 1 - (el.offsetHeight + 36) / stageH : 0.55));
      stageRef.current?.setFreeSpace(freeRef.current);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(stickyRef.current);
    cardRefs.current.forEach((el) => el && ro.observe(el));
    measure();
    return () => ro.disconnect();
  }, []);

  // Cargar la escena cuando la sección está cerca. Se monta una sola vez; los colores van por los efectos de abajo.
  useEffect(() => {
    if (navigator.connection?.saveData) {
      setStatus('fallback');
      return undefined;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cancelled = false;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      setStatus('loading');
      loadBkf3d()
        .then(({ createBkfStage }) => {
          if (cancelled || !hostRef.current) return;
          stageRef.current = createBkfStage(hostRef.current, {
            dimensions: BKF.dimensions,
            finish,
            leather: leatherHex(leather),
            reducedMotion: reduced,
            // Las etiquetas de las cotas se mueven escribiendo el estilo directo (sin re-render en cada cuadro).
            onLabels(pos, amount) {
              for (const key of Object.keys(LABELS)) {
                const el = labelRefs.current[key];
                if (!el) continue;
                const p = pos?.[key];
                el.style.visibility = p?.visible ? 'visible' : 'hidden';
                el.style.opacity = String(amount);
                if (p) el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
              }
            },
          });
          stageRef.current.setProgress(progressRef.current);
          stageRef.current.setFreeSpace(freeRef.current);
          setStatus('ready');
          trackEvent('view_3d', { item_name: BKF.name, location: 'home_showroom', page_path: '/' });
        })
        // Sin WebGL (o si falla la descarga) queda la foto: la sección se sigue leyendo igual.
        .catch(() => !cancelled && setStatus('fallback'));
    }, { rootMargin: '100% 0px' });
    io.observe(sectionRef.current);
    return () => {
      cancelled = true;
      io.disconnect();
      stageRef.current?.dispose();
      stageRef.current = null;
    };
    // Los colores iniciales se leen al montar; después los aplican los efectos de abajo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { stageRef.current?.setFinish(finish); }, [finish]);
  useEffect(() => {
    const hex = leatherHex(leather);
    if (hex) stageRef.current?.setLeather(hex);
  }, [leather]);

  const card = (i) => `bkf-stage-card${active === i ? ' is-active' : ''}`;

  return (
    <section ref={sectionRef} className="bkf-stage" aria-labelledby="bkf-3d" data-status={status}>
      <div ref={stickyRef} className="bkf-stage-sticky">
        <div className="bkf-stage-word" aria-hidden="true">BKF · BKF · BKF</div>
        <div ref={hostRef} className="bkf-stage-canvas" />
        {status === 'fallback' && (
          <Picture src="/images/sillon-bkf-cuero-en-casa.jpg" alt="" width={960} height={1200} className="bkf-stage-fallback" sizes="100vw" />
        )}
        {status === 'loading' && <p className="bkf-stage-status">Cargando el sillón en 3D…</p>}
        {Object.entries(LABELS).map(([key, label]) => (
          <span key={key} ref={(el) => { labelRefs.current[key] = el; }} className="bkf3d-label" style={{ visibility: 'hidden' }} aria-hidden="true">
            {label} {BKF.dimensions[key]} cm
          </span>
        ))}
        <div className="bkf-stage-progress" aria-hidden="true">
          <span className="bkf-stage-count">0{active + 1}<small>/0{STEPS}</small></span>
          <span className="bkf-stage-track"><span className="bkf-stage-fill" /></span>
        </div>
      </div>

      <div className="bkf-stage-steps">
        <div className="bkf-stage-step" data-side="left">
          <div className={card(0)} ref={(el) => { cardRefs.current[0] = el; }}>
            <p className="bkf-stage-eyebrow">Sillón BKF en 3D</p>
            <h2 id="bkf-3d">Así es el sillón BKF, pieza por pieza</h2>
            <p>
              Es un diseño argentino de 1938, creado por Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy. Lo fabricamos en nuestro
              taller de San Martín siguiendo ese diseño.
            </p>
            <p className="bkf-stage-hint">Seguí bajando para recorrerlo.</p>
          </div>
        </div>
        <div className="bkf-stage-step" data-side="right">
          <div className={card(1)} ref={(el) => { cardRefs.current[1] = el; }}>
            <p className="bkf-stage-eyebrow"><span className="bkf-stage-num">01</span> Estructura</p>
            <h3>Hierro redondo macizo de 12 mm</h3>
            <p>Sin tubos ni rellenos: varilla maciza, con garantía de por vida contra deformaciones.</p>
          </div>
        </div>
        <div className="bkf-stage-step" data-side="left">
          <div className={card(2)} ref={(el) => { cardRefs.current[2] = el; }}>
            <p className="bkf-stage-eyebrow"><span className="bkf-stage-num">02</span> Tapizado</p>
            <h3>Cuero vacuno curtido al vegetal</h3>
            <p>Cuero de primera selección que toma color con el uso. Se pide en negro, marrón o natural, con garantía de 1 año contra defectos de fabricación.</p>
          </div>
        </div>
        <div className="bkf-stage-step" data-side="right">
          <div className={card(3)} ref={(el) => { cardRefs.current[3] = el; }}>
            <p className="bkf-stage-eyebrow"><span className="bkf-stage-num">03</span> Medidas y acabados</p>
            {/* Un solo nodo de texto: así el modo en inglés lo traduce entero. */}
            <h3>{`${width} x ${depth} x ${height} cm, en el acabado que elijas`}</h3>
            <p>Ancho, profundidad y alto de la versión estándar. También se fabrica a medida, sin costo adicional.</p>
            <SwatchGroup label="Estructura" ariaLabel="Acabado de la estructura" items={FINISH_COLORS} value={finish} onChange={setFinish} />
            <SwatchGroup label="Cuero" ariaLabel="Color del cuero" items={LEATHER_COLORS} value={leather} onChange={setLeather} />
            <div className="bkf-stage-actions" data-cta="home_3d" data-item={BKF.name}>
              <button type="button" className="btn-main" onClick={() => addToCart(BKF, `${finish}, cuero ${leather.toLowerCase()}`)}>
                <Icon name="plus" /> Agregar al presupuesto
              </button>
              <Link to="/sillon-bkf/" className="btn-outline">Ver el sillón BKF</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
