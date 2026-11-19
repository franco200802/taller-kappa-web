import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { FINISH_COLORS, LEATHER_COLORS } from '../data/products';
import { loadBkf3d } from '../lib/loadBkf3d';

/**
 * Sillón BKF en 3D para la galería de /sillon-bkf/.
 *
 * - Solo existe en el cliente: la galería lo monta cuando alguien toca "Ver en 3D" (el estado inicial es la foto),
 *   así el HTML prerenderizado y la hidratación no cambian.
 * - three.js (~144 kB gzip) se descarga con `loadBkf3d()` en ese momento; la miniatura lo adelanta al pasar el mouse.
 * - El modelo se escala a `dimensions` (las medidas publicadas del producto) y puede mostrar las cotas.
 */

const LABELS = { width: 'Ancho', depth: 'Profundidad', height: 'Alto' };

export function Bkf3DViewer({ dimensions, finish, leather, measures }) {
  const hostRef = useRef(null);
  const viewerRef = useRef(null);
  const labelRefs = useRef({});
  const [status, setStatus] = useState('loading');

  // Montar una sola vez; los cambios de acabado van por los efectos de abajo.
  useEffect(() => {
    let cancelled = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    loadBkf3d()
      .then(({ createBkfViewer }) => {
        if (cancelled || !hostRef.current) return;
        viewerRef.current = createBkfViewer(hostRef.current, {
          dimensions,
          finish,
          leather: LEATHER_COLORS.find((l) => l.name === leather)?.swatch,
          reducedMotion: reduced,
          // Las etiquetas de las cotas se mueven escribiendo el estilo directo (60 veces por segundo, sin re-render).
          onLabels(pos) {
            for (const key of Object.keys(LABELS)) {
              const el = labelRefs.current[key];
              if (!el) continue;
              const p = pos?.[key];
              el.style.visibility = p?.visible ? 'visible' : 'hidden';
              if (p) el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
            }
          },
        });
        viewerRef.current.setMeasures(measures);
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
      viewerRef.current?.dispose();
      viewerRef.current = null;
    };
    // Las props iniciales se leen al montar; después las aplican los efectos de abajo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { viewerRef.current?.setFinish(finish); }, [finish]);
  useEffect(() => {
    const hex = LEATHER_COLORS.find((l) => l.name === leather)?.swatch;
    if (hex) viewerRef.current?.setLeather(hex);
  }, [leather]);
  useEffect(() => { viewerRef.current?.setMeasures(measures); }, [measures]);

  return (
    <div className="bkf3d-stage" ref={hostRef}>
      {status === 'loading' && <p className="bkf3d-status">Cargando el modelo 3D…</p>}
      {status === 'error' && (
        <p className="bkf3d-status">Tu navegador no puede mostrar el modelo 3D. Mirá las fotos o pedí el presupuesto por WhatsApp.</p>
      )}
      {Object.entries(LABELS).map(([key, label]) => (
        <span key={key} ref={(el) => { labelRefs.current[key] = el; }} className="bkf3d-label" style={{ visibility: 'hidden' }} aria-hidden="true">
          {label} {dimensions[key]} cm
        </span>
      ))}
    </div>
  );
}

/** Muestras de color elegibles (acabado de la estructura o cuero). La usan el panel de la galería y el showroom de la home. */
export function SwatchGroup({ label, ariaLabel, items, value, onChange }) {
  return (
    <div className="bkf3d-row">
      <p className="color-label">{label}: <strong>{value}</strong></p>
      <div className="bkf-color-swatches" role="radiogroup" aria-label={ariaLabel}>
        {items.map((c) => (
          <button key={c.name} type="button" role="radio" aria-checked={c.name === value} aria-label={c.name} title={c.name}
            className={`bkf-color-swatch${c.name === value ? ' active' : ''}`} style={{ background: c.swatch }} onClick={() => onChange(c.name)} />
        ))}
      </div>
    </div>
  );
}

/** Controles del modelo: acabado de la estructura, color del cuero, cotas y "agregar al presupuesto". */
export function Bkf3DPanel({ finish, leather, measures, onFinish, onLeather, onMeasures, onAdd }) {
  return (
    <div className="bkf3d-panel" data-cta="sillon-bkf_3d">
      <p className="bkf3d-hint">Arrastrá para girarlo; con la rueda o pellizcando lo acercás.</p>
      <SwatchGroup label="Estructura" ariaLabel="Acabado de la estructura" items={FINISH_COLORS} value={finish} onChange={onFinish} />
      <SwatchGroup label="Cuero" ariaLabel="Color del cuero" items={LEATHER_COLORS} value={leather} onChange={onLeather} />
      <label className="bkf3d-check">
        <input type="checkbox" checked={measures} onChange={(e) => onMeasures(e.target.checked)} /> Mostrar medidas
      </label>
      <button type="button" className="btn-main" onClick={onAdd}>
        <Icon name="plus" /> Agregar este sillón al presupuesto
      </button>
    </div>
  );
}
