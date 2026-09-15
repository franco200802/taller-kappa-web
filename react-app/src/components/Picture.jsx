import { forwardRef } from 'react';

/**
 * Picture — envuelve un <img> en un <picture> con una fuente .webp opcional.
 *
 * Solo tiene sentido para imágenes reales que efectivamente tienen un
 * archivo .webp generado en public/images (bkf1.jpg, bkfapoyapies.jpg,
 * mesa.jpeg, burguerlogo.png — ver public/images/*.webp). Para cualquier
 * otro src (ej. un producto cargado desde Firestore sin su .webp), el
 * <source> simplemente fallará a cargar y el navegador usa el <img> de
 * abajo como fallback real: no rompe nada, solo no gana la optimización.
 *
 * No se usa para imágenes que van en meta tags (og:image, JSON-LD
 * `image`): esas necesitan seguir siendo una URL JPG/PNG directa y
 * fetcheable por crawlers de redes sociales que no soportan <picture>.
 */
function toWebp(src) {
  if (!src) return src;
  return src.replace(/\.(jpe?g|png)(\?.*)?$/i, '.webp$2');
}

const Picture = forwardRef(function Picture(
  { src, alt, width, height, className, loading = 'lazy', fetchPriority, onClick, style },
  ref
) {
  return (
    <picture>
      <source srcSet={toWebp(src)} type="image/webp" />
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        fetchpriority={fetchPriority}
        onClick={onClick}
        style={style}
      />
    </picture>
  );
});

export default Picture;
