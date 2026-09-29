import { forwardRef } from 'react';

/**
 * Picture — envuelve un <img> en un <picture> con una fuente .webp opcional.
 *
 * Solo se emite el <source> para las imágenes que efectivamente tienen un
 * .webp en public/images (WEBP_AVAILABLE). Ojo: si el navegador elige un
 * <source> y ese archivo da 404, NO vuelve al <img> — muestra la imagen
 * rota. Por eso cualquier otro src (un logo sin .webp, un producto cargado
 * desde Firestore) se renderiza como <img> simple.
 *
 * No se usa para imágenes que van en meta tags (og:image, JSON-LD
 * `image`): esas necesitan seguir siendo una URL JPG/PNG directa y
 * fetcheable por crawlers de redes sociales que no soportan <picture>.
 */
// Mantener en sincro con los .webp que existen en public/images.
const WEBP_AVAILABLE = new Set([
  '/images/bkf1.jpg',
  '/images/bkfapoyapies.jpg',
  '/images/mesa.jpeg',
  '/images/burguerlogo.png',
]);

function toWebp(src) {
  if (!src || !WEBP_AVAILABLE.has(src)) return null;
  return src.replace(/\.(jpe?g|png)$/i, '.webp');
}

const Picture = forwardRef(function Picture(
  { src, alt, width, height, className, loading = 'lazy', fetchPriority, style },
  ref
) {
  const webp = toWebp(src);
  return (
    <picture>
      {webp && <source srcSet={webp} type="image/webp" />}
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        fetchpriority={fetchPriority}
        style={style}
      />
    </picture>
  );
});

export default Picture;
