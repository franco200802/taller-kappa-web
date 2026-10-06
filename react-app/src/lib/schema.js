/**
 * Constructores de JSON-LD (schema.org) del sitio.
 *
 * Los nodos se enlazan por @id para formar un grafo, en vez de repetir la
 * empresa como objeto suelto en cada producto:
 *
 *   WebSite ──publisher──▶ LocalBusiness (Taller Kappa S.R.L.)
 *   LocalBusiness ──brand──▶ Brand "Taller Kappa"
 *   LocalBusiness ──hasOfferCatalog──▶ categorías ──▶ productos
 *   Product ──brand / manufacturer──▶ Brand / LocalBusiness
 *   Product ──isRelatedTo──▶ otros productos
 *   WebPage ──isPartOf──▶ WebSite, ──about / mainEntity──▶ entidad de la página
 *
 * Reglas: solo datos que ya publica el sitio (ver data/business.js y
 * data/products.js). Sin precio, SKU, GTIN, reviews ni rating.
 *
 * Los nodos NO llevan '@context': Seo.jsx y Layout.jsx los agrupan en un
 * único `@graph` con un solo contexto.
 */
import { BUSINESS } from '../data/business';
import { CATEGORIES, PRODUCTS, getCategory, productImages, productPath, productsInCategory, relatedProducts, socialImage } from '../data/products';
import { SITE, absoluteUrl, assetUrl, breadcrumbId, breadcrumbList, pageId } from './site';

export const ORG_ID = `${SITE}/#organization`;
export const BRAND_ID = `${SITE}/#brand`;
export const WEBSITE_ID = `${SITE}/#website`;
export const articleId = (path) => `${absoluteUrl(path)}#articulo`;
export const productId = (slug) => {
  const p = PRODUCTS.find((x) => x.slug === slug);
  return `${absoluteUrl(p ? productPath(p) : `/catalogo/${slug}`)}#producto`;
};

const ref = (id) => ({ '@id': id });

/** ImageObject con URL, dimensiones reales y descripción (el mismo texto del alt de la foto). */
export const imageNode = ({ path, width, height }, caption) => ({
  '@type': 'ImageObject',
  url: assetUrl(path),
  contentUrl: assetUrl(path),
  width,
  height,
  caption,
});

/** Nodo mínimo de un producto (enlace con nombre y URL), para listas y relaciones. */
export function productStub(p) {
  return {
    '@type': 'Product',
    '@id': productId(p.slug),
    name: p.name,
    url: absoluteUrl(productPath(p)),
  };
}

const COUNTRY = { '@type': 'Country', name: BUSINESS.address.country };

/**
 * Taller Kappa S.R.L. Tipo LocalBusiness porque tiene dirección física
 * (fábrica y retiro en el taller). `location` expresa la cadena
 * Villa Chacabuco → San Martín → Provincia de Buenos Aires → Argentina.
 */
export function organizationNode() {
  const a = BUSINESS.address;
  return {
    // LocalBusiness + el subtipo más específico: fábrica con showroom (visitas con turno) y retiro con coordinación previa.
    '@type': ['LocalBusiness', 'FurnitureStore'],
    '@id': ORG_ID,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    alternateName: BUSINESS.alternateName,
    description: BUSINESS.summary,
    url: `${SITE}/`,
    logo: { '@type': 'ImageObject', url: assetUrl(BUSINESS.logo.path), width: BUSINESS.logo.width, height: BUSINESS.logo.height },
    image: [assetUrl(BUSINESS.logo.path), assetUrl(socialImage(PRODUCTS[0]))],
    brand: ref(BRAND_ID),
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.locality,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.countryCode,
    },
    geo: { '@type': 'GeoCoordinates', latitude: BUSINESS.geo.latitude, longitude: BUSINESS.geo.longitude },
    hasMap: BUSINESS.mapUrl,
    location: {
      '@type': 'Place',
      name: a.neighborhood,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: a.locality,
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: `Provincia de ${a.region}`,
          containedInPlace: COUNTRY,
        },
      },
    },
    // Las zonas de entrega que publica /envios/: CABA, GBA (norte, oeste, sur) e interior del país.
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Ciudad Autónoma de Buenos Aires', alternateName: ['Capital Federal', 'CABA'] },
      { '@type': 'AdministrativeArea', name: 'Gran Buenos Aires' },
      { '@type': 'AdministrativeArea', name: 'Zona Norte del Gran Buenos Aires' },
      { '@type': 'AdministrativeArea', name: 'Zona Oeste del Gran Buenos Aires' },
      { '@type': 'AdministrativeArea', name: 'Zona Sur del Gran Buenos Aires' },
      COUNTRY,
    ],
    // Horario de atención del local (showroom con turno y retiro coordinado), no solo de retiro.
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: BUSINESS.hours.days,
      opens: BUSINESS.hours.opens,
      closes: BUSINESS.hours.closes,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
      availableLanguage: 'es',
      areaServed: a.countryCode,
    },
    knowsAbout: BUSINESS.topics,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Catálogo de Taller Kappa',
      itemListElement: CATEGORIES.map((c) => ({
        '@type': 'OfferCatalog',
        name: c.name,
        url: absoluteUrl(`/catalogo/${c.slug}`),
        itemListElement: productsInCategory(c.key).map((p) => ({ '@type': 'Offer', itemOffered: productStub(p) })),
      })),
    },
  };
}

export function brandNode() {
  return {
    '@type': 'Brand',
    '@id': BRAND_ID,
    name: BUSINESS.name,
    url: `${SITE}/`,
    logo: assetUrl(BUSINESS.logo.path),
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE}/`,
    name: BUSINESS.name,
    // Nombres alternativos del sitio (Google los usa para el nombre del sitio en los resultados).
    alternateName: [BUSINESS.legalName, ...BUSINESS.alternateName],
    description: BUSINESS.summary,
    inLanguage: 'es-AR',
    publisher: ref(ORG_ID),
  };
}

/** Nodos que van en TODAS las páginas (los emite Layout.jsx). */
export const siteNodes = () => [organizationNode(), brandNode(), websiteNode()];

/**
 * Producto completo. `extra` permite que la landing del Sillón BKF sume datos
 * propios (alias, galería) sobre el MISMO @id, en vez de crear otra entidad.
 */
export function productNode(p, extra = {}) {
  const category = getCategory(p.category);
  return {
    '@type': 'Product',
    '@id': productId(p.slug),
    url: absoluteUrl(productPath(p)),
    name: p.name,
    alternateName: p.alternateName,
    description: p.definition,
    image: productImages(p).map((img) => imageNode(img, p.alt)),
    category: category ? `Muebles > ${category.name}` : p.category,
    material: p.material,
    brand: ref(BRAND_ID),
    manufacturer: ref(ORG_ID),
    countryOfOrigin: COUNTRY,
    additionalProperty: (p.facts ?? [])
      .filter(([label]) => label !== 'Precio')
      .map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
    isRelatedTo: relatedProducts(p).map(productStub),
    offers: offerNode(p),
    ...extra,
  };
}

/**
 * Oferta de un producto. Sin `price` en data/products.js la oferta lleva solo
 * disponibilidad (el sitio cotiza por WhatsApp y no inventa precios). Si se
 * carga `price: { amount, currency, validUntil? }` en el producto, la oferta
 * pasa a incluir price/priceCurrency y el producto queda elegible para
 * resultados enriquecidos de producto.
 */
export function offerNode(p) {
  const price = p.price;
  return {
    '@type': 'Offer',
    url: absoluteUrl(productPath(p)),
    availability: p.stock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
    itemCondition: 'https://schema.org/NewCondition',
    seller: ref(ORG_ID),
    ...(price?.amount ? { price: String(price.amount), priceCurrency: price.currency ?? 'ARS' } : {}),
    ...(price?.amount && price.validUntil ? { priceValidUntil: price.validUntil } : {}),
  };
}

/**
 * Artículo educativo (guía). El autor y el publicador son la empresa; no se
 * inventa un autor persona. `datePublished` es la fecha real de publicación;
 * `dateModified` solo se agrega si se pasa (no se aparenta frescura).
 */
export function articleNode({ path, headline, description, image, about, datePublished, dateModified, citations = [] }) {
  return {
    '@type': 'Article',
    '@id': articleId(path),
    headline,
    description,
    inLanguage: 'es-AR',
    mainEntityOfPage: ref(pageId(path)),
    image: image ? [assetUrl(image)] : undefined,
    author: ref(ORG_ID),
    publisher: ref(ORG_ID),
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    ...(about ? { about } : {}),
    ...(citations.length ? { citation: citations.map((url) => ({ '@type': 'CreativeWork', url })) } : {}),
  };
}

/** Servicio de fabricación para empresas (página /mobiliario-comercial/). */
export function serviceNode({ path, name, serviceType, description, offers }) {
  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(path)}#servicio`,
    name,
    serviceType,
    description,
    provider: ref(ORG_ID),
    areaServed: COUNTRY,
    audience: { '@type': 'BusinessAudience', name: 'Locales gastronómicos, estaciones de servicio, comercios, hoteles y oficinas' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name,
      itemListElement: offers.map((p) => ({ '@type': 'Offer', itemOffered: productStub(p) })),
    },
  };
}

/** FAQPage a partir de [{ q, a }] — solo para preguntas que están visibles en la página. */
export function faqNode(items, path) {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/** Lista de productos de una página de catálogo o categoría. */
export function itemListNode(products, path, name) {
  return {
    '@type': 'ItemList',
    '@id': `${absoluteUrl(path)}#lista`,
    name,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      // Los productos sin slug (cargados desde Firestore) no tienen URL propia.
      item: p.slug ? productStub(p) : { '@type': 'Product', name: p.name },
    })),
  };
}

/**
 * Grafo JSON-LD de una página: el nodo de la página (WebPage, AboutPage,
 * ContactPage, CollectionPage…) enlazado a WebSite, a su breadcrumb y a la
 * entidad de la que trata (`about` / `mainEntity`, como @id), más los nodos
 * extra (Product, FAQPage, ItemList, Service…). Lo usa Seo.jsx.
 */
export function pageGraph({ title, description, path, pageType, about, mainEntity, breadcrumb, extra }) {
  const crumbs = breadcrumb ? breadcrumbList(breadcrumb) : null;
  const page = {
    '@type': pageType,
    '@id': pageId(path),
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: 'es-AR',
    isPartOf: ref(WEBSITE_ID),
    ...(about ? { about: about.map(ref) } : {}),
    ...(mainEntity ? { mainEntity: ref(mainEntity) } : {}),
    ...(crumbs ? { breadcrumb: ref(breadcrumbId(breadcrumb[breadcrumb.length - 1].path)) } : {}),
  };
  return { '@context': 'https://schema.org', '@graph': [page, ...(crumbs ? [crumbs] : []), ...extra] };
}
