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
import { CATEGORIES, getCategory, productsInCategory, relatedProducts } from '../data/products';
import { SITE, absoluteUrl, assetUrl, breadcrumbId, breadcrumbList, pageId } from './site';

export const ORG_ID = `${SITE}/#organization`;
export const BRAND_ID = `${SITE}/#brand`;
export const WEBSITE_ID = `${SITE}/#website`;
export const productId = (slug) => `${absoluteUrl(`/catalogo/${slug}`)}#producto`;

const ref = (id) => ({ '@id': id });

/** Nodo mínimo de un producto (enlace con nombre y URL), para listas y relaciones. */
export function productStub(p) {
  return {
    '@type': 'Product',
    '@id': productId(p.slug),
    name: p.name,
    url: absoluteUrl(`/catalogo/${p.slug}`),
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
    '@type': 'LocalBusiness',
    '@id': ORG_ID,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    alternateName: BUSINESS.alternateName,
    description: BUSINESS.summary,
    url: `${SITE}/`,
    logo: { '@type': 'ImageObject', url: assetUrl(BUSINESS.logo.path), width: BUSINESS.logo.width, height: BUSINESS.logo.height },
    image: assetUrl(BUSINESS.logo.path),
    brand: ref(BRAND_ID),
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${a.street}, ${a.neighborhood}`,
      addressLocality: a.locality,
      addressRegion: a.region,
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
    areaServed: COUNTRY,
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
    url: absoluteUrl(`/catalogo/${p.slug}`),
    name: p.name,
    alternateName: p.alternateName,
    description: p.definition,
    image: [assetUrl(p.image)],
    category: category ? `Muebles > ${category.name}` : p.category,
    material: p.material,
    brand: ref(BRAND_ID),
    manufacturer: ref(ORG_ID),
    countryOfOrigin: COUNTRY,
    additionalProperty: (p.facts ?? [])
      .filter(([label]) => label !== 'Precio')
      .map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
    isRelatedTo: relatedProducts(p).map(productStub),
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/catalogo/${p.slug}`),
      availability: p.stock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      itemCondition: 'https://schema.org/NewCondition',
      seller: ref(ORG_ID),
    },
    ...extra,
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
