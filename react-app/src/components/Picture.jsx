import { forwardRef } from 'react';

/**
 * Picture — <picture> con fuentes AVIF/WebP y srcset por ancho.
 *
 * Fotos de producto (RESPONSIVE): scripts/build-images.sh genera, desde
 * assets-src/fotos/, las variantes <nombre>-<ancho>.{avif,webp,jpg}. Acá
 * se emiten como srcset y el navegador baja solo el ancho que necesita
 * según `sizes` (en un celular, la de 480 u 800 px en vez de la de 1600).
 * El `src` del <img> sigue siendo el JPG de tamaño completo: es la URL
 * canónica de la foto (la que usan og:image, el JSON-LD y el sitemap).
 *
 * Solo se emiten fuentes para archivos que existen (RESPONSIVE y
 * WEBP_AVAILABLE). Ojo: si el navegador elige un <source> que da 404, NO
 * vuelve al <img> — muestra la imagen rota. Por eso cualquier otro src
 * (un producto cargado desde Firestore, un logo sin .webp) se renderiza
 * como <img> simple.
 *
 * No se usa para imágenes que van en meta tags (og:image, JSON-LD
 * `image`): esas necesitan seguir siendo una URL JPG/PNG directa.
 */
// Mantener en sincro con scripts/build-images.sh (anchos generados por foto).
const RESPONSIVE = {
  '/images/sillon-bkf-hierro-cuero.jpg': [480, 800, 1200, 1600],
  '/images/banco-bkf-hierro-cuero.jpg': [480, 800, 1024],
  '/images/base-mesa-flat-hierro.jpg': [480, 800, 1024],
};
// Imágenes sueltas que solo tienen una versión .webp al lado.
const WEBP_AVAILABLE = new Set(['/images/burguerlogo.png']);

function srcSet(src, widths, ext) {
  const base = src.replace(/\.jpe?g$/i, '');
  return widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');
}

const Picture = forwardRef(function Picture(
  { src, alt, width, height, sizes = '100vw', className, loading = 'lazy', fetchPriority, style },
  ref
) {
  const widths = RESPONSIVE[src];
  const webp = !widths && WEBP_AVAILABLE.has(src) ? src.replace(/\.(jpe?g|png)$/i, '.webp') : null;
  return (
    <picture>
      {widths && <source type="image/avif" srcSet={srcSet(src, widths, 'avif')} sizes={sizes} />}
      {widths && <source type="image/webp" srcSet={srcSet(src, widths, 'webp')} sizes={sizes} />}
      {webp && <source srcSet={webp} type="image/webp" />}
      <img
        ref={ref}
        src={src}
        srcSet={widths ? srcSet(src, widths, 'jpg') : undefined}
        sizes={widths ? sizes : undefined}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        decoding={loading === 'eager' ? undefined : 'async'}
        fetchpriority={fetchPriority}
        style={style}
      />
    </picture>
  );
});

export default Picture;
