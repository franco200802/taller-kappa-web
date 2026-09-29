import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Picture from '../components/Picture';
import { PRODUCTS } from '../data/products';
import { whatsappUrl } from '../data/contact';

const REASONS = [
  { title: 'Directo de fábrica', text: 'Sin intermediarios. Comprás al productor y ahorrás entre un 30% y 50% respecto al precio de retail.' },
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
              <i className="fab fa-whatsapp" /> Cotizar para empresas
            </a>
          </div>
        </div>
        <div className="home-hero-media">
          <Picture
            src="/images/bkf1.jpg"
            alt="Sillón BKF de hierro negro y cuero suela, fabricado por Taller Kappa"
            width={1600}
            height={1600}
            loading="eager"
            fetchPriority="high"
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
                  <Picture src={p.image} alt={p.name} width={p.imageWidth} height={p.imageHeight} loading="lazy" />
                </div>
                <h3>{p.name}</h3>
                <p>{p.specs[0]}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="why-section">
        <h2 className="section-title">Por qué comprarle a la fábrica</h2>
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
          <h2 className="section-title">Antes de pedir</h2>
          <p>
            Conocé la historia y las medidas del <Link to="/sillon-bkf/">Sillón BKF</Link>, o mirá los{' '}
            <Link to="/proyectos/">proyectos que hicimos</Link> para YPF, McDonald&apos;s y Burger King.
          </p>
          <p>
            Revisá las <Link to="/envios/">zonas y tiempos de envío</Link> y las{' '}
            <Link to="/garantia/">condiciones de garantía</Link>. Si te queda alguna duda, están las{' '}
            <Link to="/faq/">preguntas frecuentes</Link> o nos podés <Link to="/contacto/">escribir directamente</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
