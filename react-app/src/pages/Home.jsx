import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import Seo from '../components/Seo';
import Picture from '../components/Picture';
import { PRODUCTS } from '../data/products';
import { whatsappUrl } from '../data/contact';
import { BUSINESS, addressLine } from '../data/business';
import { ORG_ID } from '../lib/schema';

const REASONS = [
  { title: 'Directo de fábrica', text: 'Sin intermediarios: comprás al productor, con cotización directa por WhatsApp.' },
  { title: 'Hecho para uso intensivo', text: 'Hierro macizo de 12 mm. Nuestras piezas soportan el uso gastronómico diario sin deformarse.' },
  { title: 'A medida, sin recargo', text: 'Adaptamos medidas, colores y acabados a lo que necesites, sin costo adicional.' },
  { title: 'Factura A y B', text: 'Somos responsables inscriptos. Emitimos comprobante para personas y empresas.' },
];

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
        title="Taller Kappa | Sillones BKF y Muebles de Hierro en Buenos Aires"
        description="Fábrica de sillones BKF, bancos y bases de mesa de hierro y cuero en San Martín, Buenos Aires. Fabricación a medida, envíos y atención a empresas."
        path="/"
        about={[ORG_ID]}
      />

      <section className="home-hero">
        <div className="home-hero-text">
          <h1>Sillones BKF y muebles de hierro en Buenos Aires</h1>
          <p className="home-hero-lead">
            Directo de fábrica: hierro macizo de 12 mm y cuero vacuno, hechos en nuestro taller de
            San Martín. Cotizamos por WhatsApp en el día.
          </p>
          <div className="home-hero-actions">
            <Link to="/catalogo/" className="btn-main">Ver catálogo</Link>
            <a
              href={whatsappUrl('Hola, soy una empresa y necesito cotización mayorista.')}
              target="_blank" rel="noopener noreferrer" className="btn-outline"
            >
              <Icon name="whatsapp" /> Cotizar para empresas
            </a>
          </div>
        </div>
        <div className="home-hero-media">
          <Picture
            src="/images/sillon-bkf-hierro-cuero.jpg"
            alt={PRODUCTS[0].alt}
            width={1600}
            height={1600}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 860px) 100vw, 52vw"
          />
          <span className="home-hero-caption">Sillón BKF Premium, cuero suela</span>
        </div>
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

      <section className="section-padding about-facts" aria-labelledby="que-es-kappa">
        <div>
          <h2 className="section-title" id="que-es-kappa">Qué es Taller Kappa</h2>
          <p>{BUSINESS.summary}</p>
          <p>
            {BUSINESS.salesModel} Las piezas se pueden fabricar a medida. Conocé la historia de la empresa en <Link to="/nosotros/">quiénes somos</Link>. Si es para un local o una empresa,
            mirá el <Link to="/mobiliario-comercial/">mobiliario comercial de hierro a medida para locales y franquicias</Link>.
          </p>
        </div>
        <dl className="facts">
          <div><dt>Empresa</dt><dd>{BUSINESS.legalName}</dd></div>
          <div><dt>Dónde está</dt><dd>{addressLine()}, Argentina</dd></div>
          <div>
            <dt>Qué fabrica</dt>
            <dd>
              {PRODUCTS.map((p, i) => (
                <span key={p.slug}>{i > 0 && ', '}<Link to={`/catalogo/${p.slug}/`}>{p.name}</Link></span>
              ))}
            </dd>
          </div>
          <div><dt>Para quién</dt><dd>Particulares, empresas y locales gastronómicos o comerciales</dd></div>
          <div><dt>Retiro en el taller</dt><dd>{BUSINESS.hours.label}</dd></div>
          <div><dt>Cómo consultar</dt><dd><Link to="/contacto/">WhatsApp {BUSINESS.phoneDisplay} o formulario de contacto</Link></dd></div>
        </dl>
      </section>

      <section className="section-padding">
        <div className="section-head">
          <h2 className="section-title">Lo que fabricamos</h2>
          <Link to="/catalogo/" className="btn-outline">Ver catálogo completo</Link>
        </div>
        <ul className="home-products">
          {PRODUCTS.map((p) => (
            <li className="home-product" key={p.slug}>
              <Link to={`/catalogo/${p.slug}/`}>
                <div className="home-product-img">
                  <Picture src={p.image} alt={p.alt} width={p.imageWidth} height={p.imageHeight} loading="lazy" sizes="(max-width: 760px) 78vw, (max-width: 1240px) 32vw, 384px" />
                </div>
                <h3>{p.name}</h3>
                <p>{p.specs[0]}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="why-section">
        <h2 className="section-title">Por qué pedirle el presupuesto a la fábrica</h2>
        <div className="why-grid">
          {REASONS.map((r) => (
            <div className="why-card" key={r.title}>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding home-links">
        <div>
          <h2 className="section-title">Para elegir y pedir</h2>
          <p>
            <strong>Sillón BKF:</strong> conocé el <Link to="/sillon-bkf/">sillón BKF fabricado en Argentina</Link>, leé{' '}
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
    </>
  );
}
