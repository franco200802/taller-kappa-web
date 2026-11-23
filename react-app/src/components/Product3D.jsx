import { useEffect, useRef, useState } from 'react';
import { getProductBySlug } from '../data/products';
import { PRODUCT_3D, selectedItems } from '../data/product3d';
import { loadProduct3d } from '../lib/loadProduct3d';

/**
 * Producto en 3D para la galería de una ficha (/sillon-bkf/, /catalogo/banco-bkf/, /catalogo/base-de-mesa-flat/).
 *
 * - Solo existe en el cliente: la galería lo monta cuando alguien toca "3D" (el estado inicial es la foto), así el
 *   HTML prerenderizado y la hidratación no cambian.
 * - three.js se descarga con `loadProduct3d()` en ese momento; la miniatura lo adelanta al pasar el mouse.
 * - El modelo se escala a las medidas publicadas del producto y puede mostrar las cotas.
 */
export function Product3DViewer({ slug, values, measures }) {
  const cfg = PRODUCT_3D[slug];
  const hostRef = useRef(null);
  const viewerRef = useRef(null);
  const labelRefs = useRef({});
  const [status, setStatus] = useState('loading');

  // Montar una sola vez; los cambios de opciones y cotas van por los efectos de abajo.
  useEffect(() => {
    let cancelled = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    loadProduct3d()
      .then(({ createViewer }) => {
        if (cancelled || !hostRef.current) return;
        viewerRef.current = createViewer(hostRef.current, {
          model: slug,
          dimensions: getProductBySlug(slug).dimensions,
          values: selectedItems(cfg, values),
          reducedMotion: reduced,
          // Las etiquetas de las cotas se mueven escribiendo el estilo directo (60 veces por segundo, sin re-render).
          onLabels(pos) {
            for (const [key, el] of Object.entries(labelRefs.current)) {
              if (!el) continue;
              const p = pos?.[key];
              el.style.visibility = p?.visible ? 'visible' : 'hidden';
              if (p) el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
            }
          },
        });
        viewerRef.current.setMeasures(measures);
        // Contexto WebGL perdido (poca memoria, volver de otra app): se libera el visor y se avisa, con la salida a las
        // fotos y a WhatsApp, en vez de dejar un recuadro en blanco.
        hostRef.current.querySelector('canvas')?.addEventListener('webglcontextlost', () => {
          try { viewerRef.current?.dispose(); } catch { /* el contexto ya no existe */ }
          viewerRef.current = null;
          if (!cancelled) setStatus('error');
        }, { once: true });
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
      viewerRef.current?.dispose();
      viewerRef.current = null;
    };
    // Los valores iniciales se leen al montar; después los aplican los efectos de abajo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status !== 'ready') return;
    for (const [key, item] of Object.entries(selectedItems(cfg, values))) viewerRef.current?.setOption(key, item);
  }, [cfg, status, values]);
  useEffect(() => { viewerRef.current?.setMeasures(measures); }, [measures, status]);

  return (
    <div className="bkf3d-stage" ref={hostRef}>
      {status === 'loading' && <p className="bkf3d-status">Cargando el modelo 3D…</p>}
      {status === 'error' && (
        <p className="bkf3d-status">Tu navegador no puede mostrar el modelo 3D. Mirá las fotos o pedí el presupuesto por WhatsApp.</p>
      )}
      {cfg.labels(values).map((l) => (
        <span key={l.key} ref={(el) => { labelRefs.current[l.key] = el; }} className="bkf3d-label" style={{ visibility: 'hidden' }} aria-hidden="true">
          {l.text} {l.value} {l.unit}
        </span>
      ))}
    </div>
  );
}

/** Muestras de color elegibles (acabado de la estructura o cuero). */
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

/** Opciones con texto (altura, columna): botones juntos, uno elegido. */
export function SegmentedGroup({ label, ariaLabel, items, value, onChange }) {
  return (
    <div className="bkf3d-row">
      <p className="color-label">{label}</p>
      <div className="seg-group" role="radiogroup" aria-label={ariaLabel}>
        {items.map((it) => (
          <button key={it.name} type="button" role="radio" aria-checked={it.name === value}
            className={`seg-option${it.name === value ? ' active' : ''}`} onClick={() => onChange(it.name)}>
            {it.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Una opción del 3D (ver data/product3d.js), con el control que le corresponde a su tipo. */
export function OptionGroup({ option, value, onChange }) {
  const Group = option.type === 'segmented' ? SegmentedGroup : SwatchGroup;
  return <Group label={option.label} ariaLabel={option.ariaLabel} items={option.items} value={value} onChange={onChange} />;
}

/**
 * Opciones de un producto (acabado, cuero, altura…). Es el único selector de la ficha: va junto al botón
 * "Agregar al presupuesto" y cambia el 3D. `onChange` es el setter del estado de las opciones: recibe una función,
 * así dos cambios seguidos no se pisan.
 */
export function Product3DOptions({ slug, values, onChange }) {
  const cfg = PRODUCT_3D[slug];
  return (
    <div className="bkf3d-options">
      {cfg.options.map((o) => (
        <OptionGroup key={o.key} option={o} value={values[o.key]} onChange={(name) => onChange((v) => ({ ...v, [o.key]: name }))} />
      ))}
    </div>
  );
}

/** Debajo del visor 3D de la galería: cómo se usa y las cotas. Las opciones están en la columna de la ficha. */
export function Product3DPanel({ measures, onMeasures }) {
  return (
    <div className="bkf3d-panel">
      <p className="bkf3d-hint">Arrastrá para girarlo; con la rueda o pellizcando lo acercás.</p>
      <label className="bkf3d-check">
        <input type="checkbox" checked={measures} onChange={(e) => onMeasures(e.target.checked)} /> Mostrar medidas
      </label>
    </div>
  );
}
