import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import Picture from './Picture';
import { OptionGroup } from './Product3D';
import { useCart } from '../context/CartContext';
import { getProductBySlug, priceQuestion, productPath } from '../data/products';
import { whatsappUrlFor } from '../data/contact';
import { PRODUCT_3D, initialValues, selectedItems } from '../data/product3d';
import { trackEvent } from '../lib/analytics';
import { loadProduct3d } from '../lib/loadProduct3d';

/**
 * Showroom 3D de un producto: una sección oscura con el producto en 3D que gira y cambia con el scroll, en cuatro
 * capítulos (textos y opciones en data/product3d.js). Está en la home (sillón) y en las fichas del banco y la base.
 *
 * Reglas que cumple (ver CONTEXTO_PROYECTO §5l):
 * - Los textos son HTML normal que se prerenderiza y se lee sin JavaScript: las tarjetas pasan por encima de la
 *   escena fija, no aparecen ni desaparecen con JS. El 3D es decoración encima de eso.
 * - three.js se descarga recién cuando la sección está a una pantalla de distancia, nunca en la carga de la página.
 *   Con "ahorro de datos" o sin WebGL se muestra una foto en su lugar.
 * - El progreso del scroll se escribe en una variable CSS y en la escena, sin re-renderizar React en cada cuadro.
 *
 * @param {{ slug: string, location: string, cta: string }} props  location y cta: para GA4 (view_3d y data-cta).
 */
export default function Showroom3D({ slug, location, cta }) {
  const cfg = PRODUCT_3D[slug];
  const product = getProductBySlug(slug);
  const { showroom } = cfg;
  const steps = showroom.chapters.length;
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
  const [values, setValues] = useState(() => initialValues(cfg));

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
      const step = Math.round(p * (steps - 1));
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
  }, [steps]);

  // En el celular la tarjeta tapa la parte de abajo: se mide cuánto espacio deja libre cada una (cambia con la
  // fuente, el idioma y el ancho) para que la escena encuadre el producto entero arriba.
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

  // Cargar la escena cuando la sección está cerca. Se monta una sola vez; las opciones van por el efecto de abajo.
  useEffect(() => {
    if (navigator.connection?.saveData) {
      setStatus('fallback');
      return undefined;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cancelled = false;
    // Si llegan varios cambios juntos, alcanza con que alguno esté cerca para cargar.
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      setStatus('loading');
      loadProduct3d()
        .then(({ createStage }) => {
          if (cancelled || !hostRef.current) return;
          stageRef.current = createStage(hostRef.current, {
            model: slug,
            dimensions: product.dimensions,
            values: selectedItems(cfg, values),
            reducedMotion: reduced,
            // Las etiquetas de las cotas se mueven escribiendo el estilo directo (sin re-render en cada cuadro).
            onLabels(pos, amounts) {
              for (const [key, el] of Object.entries(labelRefs.current)) {
                if (!el) continue;
                const p = pos?.[key];
                const amount = amounts?.[key] ?? 0;
                el.style.visibility = p?.visible && amount > 0.02 ? 'visible' : 'hidden';
                el.style.opacity = String(amount);
                if (p) el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
              }
            },
          });
          stageRef.current.setProgress(progressRef.current);
          stageRef.current.setFreeSpace(freeRef.current);
          setStatus('ready');
          trackEvent('view_3d', { item_name: product.name, location, page_path: window.location.pathname });
        })
        // Sin WebGL (o si falla la descarga) queda la foto: la sección se sigue leyendo igual.
        .catch(() => !cancelled && setStatus('fallback'));
      // Media pantalla de anticipación: en las fichas el showroom está cerca del principio y con una pantalla entera
      // se descargaba three.js al abrir la página en monitores altos.
    }, { rootMargin: '50% 0px' });
    io.observe(sectionRef.current);
    return () => {
      cancelled = true;
      io.disconnect();
      stageRef.current?.dispose();
      stageRef.current = null;
    };
    // Las opciones iniciales se leen al montar; después las aplica el efecto de abajo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    for (const [key, item] of Object.entries(selectedItems(cfg, values))) stageRef.current?.setOption(key, item);
  }, [cfg, values]);

  const last = steps - 1;
  const cardClass = (i) => `bkf-stage-card${active === i ? ' is-active' : ''}`;
  const setCard = (i) => (el) => { cardRefs.current[i] = el; };

  return (
    <section ref={sectionRef} className="bkf-stage" aria-labelledby={showroom.id} data-status={status}>
      <div ref={stickyRef} className="bkf-stage-sticky">
        <div className="bkf-stage-word" aria-hidden="true">{[showroom.word, showroom.word, showroom.word].join(' · ')}</div>
        <div ref={hostRef} className="bkf-stage-canvas" />
        {status === 'fallback' && <Picture src={cfg.fallback.src} alt="" width={cfg.fallback.width} height={cfg.fallback.height} className="bkf-stage-fallback" sizes="100vw" />}
        {status === 'loading' && <p className="bkf-stage-status">Cargando el modelo 3D…</p>}
        {cfg.labels(values).map((l) => (
          <span key={l.key} ref={(el) => { labelRefs.current[l.key] = el; }} className="bkf3d-label" style={{ visibility: 'hidden' }} aria-hidden="true">
            {l.text} {l.value} {l.unit}
          </span>
        ))}
        <div className="bkf-stage-progress" aria-hidden="true">
          <span className="bkf-stage-count">0{active + 1}<small>/0{steps}</small></span>
          <span className="bkf-stage-track"><span className="bkf-stage-fill" /></span>
        </div>
      </div>

      <div className="bkf-stage-steps">
        {showroom.chapters.map((ch, i) => (
          <div key={ch.title} className="bkf-stage-step" data-side={i % 2 ? 'right' : 'left'}>
            <div className={cardClass(i)} ref={setCard(i)}>
              {i === 0 ? (
                <>
                  <p className="bkf-stage-eyebrow">{showroom.eyebrow}</p>
                  <h2 id={showroom.id}>{ch.title}</h2>
                </>
              ) : (
                <>
                  <p className="bkf-stage-eyebrow"><span className="bkf-stage-num">0{i}</span> {ch.eyebrow}</p>
                  <h3>{ch.title}</h3>
                </>
              )}
              <p>{ch.text}</p>
              {i === 0 && <p className="bkf-stage-hint">Seguí bajando para recorrerlo.</p>}
              {i === last && (
                <>
                  {cfg.options.map((o) => (
                    <OptionGroup key={o.key} option={o} value={values[o.key]} onChange={(name) => setValues((v) => ({ ...v, [o.key]: name }))} />
                  ))}
                  <div className="bkf-stage-actions" data-cta={cta} data-item={product.name}>
                    <button type="button" className="btn-main" onClick={() => addToCart(product, cfg.describe(values))}>
                      <Icon name="plus" /> Agregar al presupuesto
                    </button>
                    {showroom.link ? (
                      <Link to={showroom.link.to} className="btn-outline">{showroom.link.label}</Link>
                    ) : (
                      <a href={whatsappUrlFor(priceQuestion(product), productPath(product))} target="_blank" rel="noopener noreferrer" className="btn-outline">
                        <Icon name="whatsapp" /> Consultar precio
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
