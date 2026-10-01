import { Helmet } from 'react-helmet-async';
import { BUSINESS } from '../data/business';
import { absoluteUrl, assetUrl } from '../lib/site';
import { pageGraph } from '../lib/schema';

const DEFAULT_IMAGE = assetUrl('/images/sillon-bkf-hierro-cuero.jpg');
// sillon-bkf-hierro-cuero.jpg mide realmente 1600x1600 (verificado con PIL, no un valor de relleno).
const DEFAULT_IMAGE_W = 1600;
const DEFAULT_IMAGE_H = 1600;
const DEFAULT_IMAGE_ALT = 'Sillón BKF de hierro negro y cuero suela, fabricado por Taller Kappa';

/**
 * Seo — meta tags y JSON-LD por ruta (título, descripción, canonical, Open
 * Graph, Twitter).
 *
 * El JSON-LD sale como UN solo `@graph` (ver pageGraph en lib/schema.js):
 * el nodo de la página (`pageType`), su BreadcrumbList (`breadcrumb`:
 * [{ name, path }], que tiene que coincidir con el breadcrumb visible de
 * PageHero), la entidad de la que trata (`about` / `mainEntity`, como @id)
 * y los nodos extra de `jsonLd` (Product, FAQPage, ItemList, Service…).
 * La empresa, la marca y el sitio los emite Layout.jsx en todas las páginas.
 *
 * `image*` son opcionales: si se pasa una `image` distinta a la de default
 * conviene pasar también sus datos reales, para que la preview social no
 * tenga que descargar la imagen para medirla.
 */
export default function Seo({
  title, description, path = '/', image = DEFAULT_IMAGE,
  imageWidth = DEFAULT_IMAGE_W, imageHeight = DEFAULT_IMAGE_H, imageAlt = DEFAULT_IMAGE_ALT,
  type = 'website', jsonLd, noindex = false,
  pageType = 'WebPage', about, mainEntity, breadcrumb,
}) {
  // Canonical y og:url siempre con barra final (ver lib/site.js). Una página
  // noindex no declara canonical ni JSON-LD: serían señales contradictorias.
  const url = absoluteUrl(path);
  const extra = jsonLd ? [].concat(jsonLd) : [];
  const graph = noindex ? null : pageGraph({ title, description, path, pageType, about, mainEntity, breadcrumb, extra });

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {!noindex && <link rel="canonical" href={url} />}
      <meta name="robots" content={noindex ? 'noindex' : 'index, follow'} />
      <meta property="og:type" content={type} />
      {!noindex && <meta property="og:url" content={url} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:locale" content="es_AR" />
      <meta property="og:site_name" content={BUSINESS.name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />
      {graph && <script type="application/ld+json">{JSON.stringify(graph)}</script>}
    </Helmet>
  );
}
