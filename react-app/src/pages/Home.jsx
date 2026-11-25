import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import Seo from '../components/Seo';
import Picture from '../components/Picture';
import ScrollText from '../components/ScrollText';
import ShimmerText from '../components/ShimmerText';
import TypeWriter from '../components/TypeWriter';
import Showroom3D from '../components/Showroom3D';
import { PRODUCTS, factOf, productHref } from '../data/products';
import { whatsappUrlFor } from '../data/contact';
import { BUSINESS, addressLine } from '../data/business';
import { ORG_ID } from '../lib/schema';

const REASONS = [
  { title: 'Directo de fábrica', text: 'Sin intermediarios: comprás al productor, con cotización directa por WhatsApp.' },
  { title: 'Hecho para uso intensivo', text: 'Hierro macizo de 12 mm. Nuestras piezas soportan el uso gastronómico diario sin deformarse.' },
  { title: 'A medida, sin recargo', text: 'Adaptamos medidas, colores y acabados a lo que necesites, sin costo adicional.' },
  { title: 'Garantía de por vida', text: 'La estructura de hierro tiene garantía de por vida; la pintura, 2 años.' },
];

// Lo que se escribe en el hero (la primera frase es la que ve quien no ejecuta JavaScript).
const HERO_PHRASES = ['sillones BKF', 'bancos BKF', 'bases de mesa de hierro', 'mobiliario comercial a medida'];

// Datos cortos bajo los botones del hero: salen de la ficha del sillón y de /garantia/ y /envios/.
const HERO_FACTS = ['Hierro macizo de 12 mm', 'Garantía de por vida en la estructura', 'A medida, sin costo adicional', 'Envíos a todo el país'];

// Foto sin editar del sillón en una casa (assets-src/fotos/sillon-bkf-cuero-en-casa.jpg).
const REAL_PHOTO = {
  src: '/images/sillon-bkf-cuero-en-casa.jpg',
  alt: 'Sillón BKF de hierro negro y cuero marrón en el living de una casa, junto a un ventanal',
  width: 960,
  height: 1200,
};
const BKF = PRODUCTS[0];
// Filas de la ficha del sillón que se repiten junto a la foto (misma fuente: data/products.js).
const BKF_FACTS = ['Estructura', 'Tapizado', 'Medidas', 'Garantía'];

const CLIENTS = [
  { src: '/images/logoypf.png', alt: 'YPF', w: 213, h: 60, wide: true },
  { src: '/images/mcdonaldslogo.png', alt: "McDonald's", w: 246, h: 205 },
  { src: '/images/burguerlogo.png', alt: 'Burger King', w: 215, h: 234 },
  { src: '/images/shelllogo.png', alt: 'Shell', w: 245, h: 206 },
  { src: '/images/sandrologo.png', alt: 'Sandro Paris', w: 211, h: 63, wide: true },
];

export default function Home() {
  return (
    <>
      <Seo
        title="Fábrica de Sillón BKF y Muebles de Hierro | Taller Kappa, Buenos Aires"
        description="Fábrica de sillones BKF, bancos y bases de mesa de hierro y cuero en San Martín, Buenos Aires. Fabricación a medida, envíos y atención a empresas."
        path="/"
        about={[ORG_ID]}
      />

      <section className="home-hero">
        <div className="home-hero-text">
          <p className="eyebrow">Fábrica de muebles de hierro y cuero en San Martín</p>
          <h1>Sillones BKF y muebles de hierro en Buenos Aires</h1>
          <p className="home-hero-typed">
            Fabricamos{' '}
            <TypeWriter
              sequences={HERO_PHRASES}
              srText="sillones BKF, bancos BKF, bases de mesa de hierro y mobiliario comercial a medida"
            />
          </p>
          <p className="home-hero-lead">
            Directo de fábrica: hierro macizo de 12 mm y cuero vacuno, hechos en nuestro taller de
            San Martín. <ShimmerText>Cotizamos por WhatsApp en el día.</ShimmerText>
          </p>
          <div className="home-hero-actions" data-cta="home_hero">
            <Link to="/sillon-bkf/" className="btn-main">Ver el sillón BKF</Link>
            <a
              href={whatsappUrlFor('Hola, quiero consultar el precio del sillón BKF.', '/')}
              target="_blank" rel="noopener noreferrer" className="btn-outline"
            >
              <Icon name="whatsapp" /> Consultar precio
            </a>
          </div>
          <ul className="hero-facts">
            {HERO_FACTS.map((f) => <li key={f}>{f}</li>)}
          </ul>
          <p className="home-hero-b2b">
            ¿Es para un local o una empresa? <Link to="/mobiliario-comercial/">Cotizá mobiliario comercial a medida</Link>
          </p>
        </div>
        <figure className="home-hero-media">
          <Picture
            src="/images/sillon-bkf-hierro-cuero.jpg"
            alt={PRODUCTS[0].alt}
            width={1600}
            height={1600}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 860px) 100vw, 52vw"
          />
          <figcaption className="home-hero-caption">Sillón BKF Premium, cuero suela</figcaption>
        </figure>
      </section>

      <section className="clients-strip" aria-label="Empresas que equipamos">
        <div className="clients-strip-inner">
          <p>Equipamos locales de estas marcas</p>
          <div className="clients-strip-logos">
            {CLIENTS.map((c) => (
              <Picture key={c.src} src={c.src} alt={c.alt} width={c.w} height={c.h} loading="lazy" className={c.wide ? 'logo-wide' : undefined} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" aria-labelledby="lo-que-fabricamos">
        <div className="section-head">
          <div>
            <p className="eyebrow">Catálogo</p>
            <h2 className="section-title" id="lo-que-fabricamos">Lo que fabricamos</h2>
          </div>
          <Link to="/catalogo/" className="btn-outline">Ver catálogo completo</Link>
        </div>
        {/* Cada tarjeta dice para qué sirve el producto (fila "Uso" de su ficha): así se elige sin abrir las tres. */}
        <ul className="home-products">
          {PRODUCTS.map((p) => (
            <li className="home-product" key={p.slug}>
              <Link to={productHref(p)}>
                <div className="home-product-img">
                  <Picture src={p.image} alt={p.alt} width={p.imageWidth} height={p.imageHeight} loading="lazy" sizes="(max-width: 760px) 78vw, (max-width: 1240px) 32vw, 400px" />
                </div>
                {p.badge && <span className="home-product-tag">{p.badge}</span>}
                <h3>{p.name}</h3>
                <p>{p.specs[0]}</p>
                <p className="home-product-use">{factOf(p, 'Uso')}</p>
                <span className="home-product-more" aria-hidden="true">Ver ficha <Icon name="chevron-right" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* El sillón en 3D que se mueve con el scroll (three.js se descarga recién al acercarse a esta sección). */}
      <Showroom3D slug="sillon-bkf-premium" location="home_showroom" cta="home_3d" fadeTo="var(--blanco)" />

      <section className="home-feature" aria-labelledby="bkf-en-casa">
        <figure className="home-feature-media">
          <Picture {...REAL_PHOTO} loading="lazy" sizes="(max-width: 860px) 100vw, 46vw" />
          <figcaption>Foto sin editar, en una casa</figcaption>
        </figure>
        <div className="home-feature-text">
          <p className="eyebrow">Sillón BKF Premium</p>
          <h2 className="section-title" id="bkf-en-casa">El sillón BKF, puesto en una casa</h2>
          <p>
            Hierro redondo macizo de 12 mm y cuero vacuno curtido al vegetal, que toma color con el uso. Lo fabricamos en nuestro taller de San Martín y lo enviamos a todo el país.
          </p>
          <dl className="facts">
            {BKF_FACTS.map((label) => (
              <div key={label}><dt>{label}</dt><dd>{factOf(BKF, label)}</dd></div>
            ))}
          </dl>
          <div className="cta-btns" data-cta="home_feature" data-item={BKF.name}>
            <Link to="/sillon-bkf/" className="btn-main">Ver medidas y colores</Link>
            <a
              href={whatsappUrlFor('Hola, quiero pedir un presupuesto del Sillón BKF Premium.', '/')}
              target="_blank" rel="noopener noreferrer" className="btn-outline"
            >
              <Icon name="whatsapp" /> Pedir presupuesto
            </a>
          </div>
        </div>
      </section>

      <section className="section-padding how-section section-fade" aria-labelledby="como-comprar-home">
        <div className="how-head">
          <p className="eyebrow">Cómo se compra</p>
          <h2 className="section-title" id="como-comprar-home">Comprar en Taller Kappa: cómo funciona</h2>
          <p>
            Comprás directo a la fábrica, sin pagar nada en el sitio. Elegís lo que necesitás, pedís el presupuesto y el pedido se acuerda con el taller.
          </p>
        </div>
        <ol className="buy-steps buy-steps--cards">
          <li><strong>Elegí en el catálogo</strong> y agregá los productos al presupuesto.</li>
          <li><strong>Enviá el presupuesto por WhatsApp</strong> y te respondemos con el precio final y el plazo.</li>
          <li><strong>Fabricamos a medida</strong> y coordinamos el envío o el retiro en el taller de San Martín (el plazo depende del stock).</li>
        </ol>
        <div className="how-notes">
          <p>
            Entregamos en San Martín y alrededores, en Capital Federal (CABA), en el Gran Buenos Aires (Zona Norte, Oeste y Sur) y en todo el país. Mirá las{' '}
            <Link to="/envios/">zonas y tiempos de envío</Link>.
          </p>
          <p>
            ¿Querés comprar un sillón BKF? Conocé el <Link to="/sillon-bkf/">Sillón BKF Premium</Link>, con medidas, colores, garantía y envíos.
            Para locales y empresas, el <Link to="/mobiliario-comercial/">mobiliario comercial a medida</Link>.
          </p>
        </div>
      </section>

      <section className="why-section">
        <p className="eyebrow">Directo de fábrica</p>
        <h2 className="section-title">Por qué pedirle el presupuesto a la fábrica</h2>
        <ScrollText items={REASONS.map((r) => ({ title: r.title, text: r.text }))} />
      </section>

      <section className="section-padding about-facts" aria-labelledby="que-es-kappa">
        <div>
          <p className="eyebrow">La empresa</p>
          <h2 className="section-title" id="que-es-kappa">Qué es Taller Kappa</h2>
          <p>{BUSINESS.summary}</p>
          <p>
            {BUSINESS.salesModel} Las piezas se pueden fabricar a medida. Conocé la historia de la empresa en <Link to="/nosotros/">quiénes somos</Link>. Si es para un local o una empresa,
            mirá el <Link to="/mobiliario-comercial/">mobiliario comercial de hierro a medida para locales y franquicias</Link>.
          </p>
        </div>
        <dl className="facts">
          <div><dt>Empresa</dt><dd>{BUSINESS.legalName}</dd></div>
          <div><dt>Dónde está</dt><dd>{addressLine()}</dd></div>
          <div>
            <dt>Qué fabrica</dt>
            <dd>
              {PRODUCTS.map((p, i) => (
                <span key={p.slug}>{i > 0 && ', '}<Link to={productHref(p)}>{p.name}</Link></span>
              ))}
            </dd>
          </div>
          <div><dt>Para quién</dt><dd>Particulares, empresas y locales gastronómicos o comerciales</dd></div>
          <div><dt>Showroom</dt><dd>{BUSINESS.showroom.short}</dd></div>
          <div><dt>Retiro en el taller</dt><dd>{BUSINESS.pickup.short}; {BUSINESS.hours.label}</dd></div>
          <div><dt>Cómo consultar</dt><dd><Link to="/contacto/">WhatsApp {BUSINESS.phoneDisplay} o formulario de contacto</Link></dd></div>
        </dl>
      </section>

      <section className="section-padding home-links">
        <p className="eyebrow">Antes de pedir</p>
        <h2 className="section-title">Para elegir y pedir</h2>
        <div className="home-links-grid">
          <p>
            <strong>Sillón BKF:</strong> conocé el <Link to="/sillon-bkf/">sillón BKF de hierro y cuero fabricado en Buenos Aires</Link>, leé{' '}
            <Link to="/bkf/">qué es el sillón BKF, su historia y cómo elegir uno</Link> o mirá los{' '}
            <Link to="/catalogo/asientos/">sillones y bancos BKF</Link> del catálogo.
          </p>
          <p>
            <strong>Mesas y locales:</strong> las <Link to="/catalogo/mesas/">bases de mesa de hierro</Link> para bares y restaurantes, el{' '}
            <Link to="/mobiliario-comercial/">mobiliario comercial a medida</Link> y los <Link to="/proyectos/">proyectos que hicimos</Link> para YPF,
            McDonald&apos;s y Burger King.
          </p>
          <p>
            <strong>Antes de pedir tu presupuesto:</strong> revisá las <Link to="/envios/">zonas y tiempos de envío</Link> y las{' '}
            <Link to="/garantia/">condiciones de garantía</Link>. Si te queda alguna duda, están las{' '}
            <Link to="/faq/">preguntas frecuentes</Link> o podés <Link to="/contacto/">escribirnos directamente</Link>.
          </p>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-box">
          <p className="eyebrow">Sin pagar nada en el sitio</p>
          <h2>¿Armamos tu presupuesto?</h2>
          <p>Contanos qué necesitás, la cantidad y la zona de entrega, y te respondemos por WhatsApp con el precio y el plazo.</p>
          <div className="cta-btns" data-cta="home_cta_final">
            <a
              href={whatsappUrlFor('Hola, quiero pedir un presupuesto.', '/')}
              target="_blank" rel="noopener noreferrer" className="btn-main"
            >
              <Icon name="whatsapp" /> Pedir presupuesto por WhatsApp
            </a>
            <Link to="/catalogo/" className="btn-outline">Ver catálogo completo</Link>
          </div>
        </div>
      </section>
    </>
  );
}
