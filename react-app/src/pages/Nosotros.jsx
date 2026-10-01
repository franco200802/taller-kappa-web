import { useEffect, useState } from 'react';
import Icon from '../components/Icon';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import Picture from '../components/Picture';
import Modal from '../components/Modal';
import { loadFireDB } from '../lib/firebaseConfig';
import { PRODUCTS } from '../data/products';
import { BUSINESS, addressLine } from '../data/business';
import { CONTACT_EMAIL, whatsappUrl } from '../data/contact';
import { ORG_ID } from '../lib/schema';

const WHY = [
  { title: 'Directo de fábrica', desc: 'Sin intermediarios: comprás al productor, con cotización directa por WhatsApp.' },
  { title: 'Garantía de resistencia', desc: 'Hierro macizo de primera calidad. Nuestras piezas soportan el uso gastronómico intensivo sin deformarse.' },
  { title: 'Fabricación a medida', desc: 'Adaptamos cada pieza a tus necesidades. Medidas, colores y acabados personalizados sin costo adicional.' },
  { title: 'Factura A y B', desc: 'Somos contribuyentes responsables. Emitimos cualquier tipo de comprobante para personas y empresas.' },
];

const NUMBERS = [
  { target: 15, suffix: '+', label: 'Años de experiencia' },
  { target: 100, suffix: '%', label: 'Fabricación nacional' },
  { target: 12, suffix: '', label: 'mm de hierro macizo' },
  { target: 5, suffix: '', label: 'Grandes marcas equipadas' },
];

const FALLBACK_TESTIMONIOS = [
  { id: '1', text: '"Equipamos nuestro local de YPF Full con las Bases Flat de Taller Kappa. Soportan el alto tránsito sin problemas."', author: '— Franquicia YPF Full' },
  { id: '2', text: '"La calidad del hierro es excelente y cumplieron con los tiempos pactados."', author: '— Local Gastronómico (Shell Select)' },
  { id: '3', text: '"Excelente atención de Francisco. Me asesoró con las medidas para mi mesa."', author: '— Ricardo L. (Particular)' },
];

// La cuarta foto repite la de la Base de Mesa Flat (hoy hay tres fotos de producto):
// va con alt vacío porque es decorativa, y el botón ya se llama por su `label`.
const GALLERY = [
  { src: PRODUCTS[0].image, alt: PRODUCTS[0].alt, label: PRODUCTS[0].name, tall: true, w: PRODUCTS[0].imageWidth, h: PRODUCTS[0].imageHeight },
  { src: PRODUCTS[1].image, alt: PRODUCTS[1].alt, label: PRODUCTS[1].name, w: PRODUCTS[1].imageWidth, h: PRODUCTS[1].imageHeight },
  { src: PRODUCTS[2].image, alt: PRODUCTS[2].alt, label: PRODUCTS[2].name, w: PRODUCTS[2].imageWidth, h: PRODUCTS[2].imageHeight },
  { src: PRODUCTS[2].image, alt: '', label: PRODUCTS[2].name, wide: true, w: PRODUCTS[2].imageWidth, h: PRODUCTS[2].imageHeight },
];

export default function Nosotros() {
  const [testimonios, setTestimonios] = useState(FALLBACK_TESTIMONIOS);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    loadFireDB()
      .then((db) => db.getTestimonios())
      .then((data) => { if (data.length) setTestimonios(data); })
      .catch(() => {});
  }, []);

  const shiftLightbox = (dir) => {
    setLightbox((i) => (i === null ? i : (i + dir + GALLERY.length) % GALLERY.length));
  };

  // Escape ya lo maneja el <dialog>; acá solo las flechas.
  const onLightboxKey = (e) => {
    if (e.key === 'ArrowLeft') shiftLightbox(-1);
    if (e.key === 'ArrowRight') shiftLightbox(1);
  };

  return (
    <>
      <Seo
        title="Nosotros: quiénes somos | Taller Kappa"
        description="Taller Kappa S.R.L. es una fábrica de muebles de hierro y cuero en Villa Chacabuco, San Martín, Buenos Aires. Qué fabrica, para quién y cómo contactarla."
        path="/nosotros"
        pageType="AboutPage"
        about={[ORG_ID]}
        mainEntity={ORG_ID}
        breadcrumb={[{ name: 'Inicio', path: '/' }, { name: 'Nosotros', path: '/nosotros' }]}
      />
      <PageHero
        title="Una fábrica de muebles de hierro en San Martín"
        lead="Taller Kappa S.R.L. fabrica sillones BKF, bancos y bases de mesa de hierro y cuero en Villa Chacabuco, San Martín, Buenos Aires."
        current="Nosotros"
      />

      <section className="about-section section-padding section-fade">
        <div className="about-grid">
          <div className="about-text">
            <h2 className="section-title">Nuestra historia</h2>
            <p>Taller Kappa nació hace más de <strong>15 años</strong> en San Martín, Buenos Aires, con el objetivo de fabricar mobiliario de hierro y cuero de calidad industrial, accesible a locales, empresas y particulares.</p>
            <p>Desde el primer día trabajamos con hierro macizo de 12mm, cuero vacuno de primera selección y pintura epoxi de doble capa. Sin atajos, sin materiales baratos.</p>
            <p>Hoy somos el proveedor de confianza de <strong>YPF, McDonald's, Burger King, Shell Select y Sandro</strong>, entre otras marcas que eligieron nuestra calidad para sus espacios. Conocé nuestro <Link to="/sillon-bkf/">Sillón BKF</Link> o mirá el <Link to="/catalogo/">catálogo de sillones, bancos y bases de mesa</Link>.</p>
            <Link to="/contacto/" className="btn-main" style={{ marginTop: 8 }}>
              Contactarnos
            </Link>
          </div>
          <div className="about-img-wrap">
            <Picture src="/images/sillon-bkf-hierro-cuero.jpg" alt={PRODUCTS[0].alt} width={1600} height={1600} loading="lazy" sizes="(max-width: 860px) calc(100vw - 32px), 50vw" />
          </div>
        </div>
      </section>

      <section className="section-padding about-facts section-fade" aria-labelledby="datos-empresa">
        <div>
          <h2 className="section-title" id="datos-empresa">Datos de la empresa</h2>
          <p>{BUSINESS.summary}</p>
          <p>
            Fabricamos en nuestro propio taller y vendemos directo de fábrica. Los productos se cotizan por WhatsApp y se
            pueden pedir a medida. Para pedidos de locales y franquicias, mirá los <Link to="/proyectos/">proyectos de mobiliario comercial</Link>.
          </p>
        </div>
        <dl className="facts">
          <div><dt>Razón social</dt><dd>{BUSINESS.legalName}</dd></div>
          <div><dt>Ubicación</dt><dd>{addressLine()}, Argentina</dd></div>
          <div>
            <dt>Productos</dt>
            <dd>
              {PRODUCTS.map((p, i) => (
                <span key={p.slug}>{i > 0 && ', '}<Link to={`/catalogo/${p.slug}/`}>{p.name}</Link></span>
              ))}
            </dd>
          </div>
          <div><dt>Atiende a</dt><dd>Particulares, empresas, locales gastronómicos, estaciones de servicio, comercios, hoteles y oficinas</dd></div>
          <div><dt>Facturación</dt><dd>Factura A y B</dd></div>
          <div><dt>Retiro en el taller</dt><dd>{BUSINESS.hours.label}</dd></div>
          <div>
            <dt>Contacto</dt>
            <dd>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">WhatsApp {BUSINESS.phoneDisplay}</a>
              {' · '}<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </dd>
          </div>
        </dl>
      </section>

      <section className="why-section section-fade" aria-label="Por qué elegirnos">
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <p className="section-subtitle">Lo que ofrece Taller Kappa a particulares, empresas y locales.</p>
        <div className="why-grid">
          {WHY.map((w) => (
            <div className="why-card" key={w.title}>
                            <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="numbers-section section-fade" aria-label="Números de Taller Kappa">
        <div className="numbers-grid">
          {NUMBERS.map((n) => (
            <div className="number-item" key={n.label}>
              <span className="number-value">{n.target}</span><span className="number-suffix">{n.suffix}</span>
              <p className="number-label">{n.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="clients-section section-fade" aria-label="Empresas que confían en nosotros">
        <p className="clients-label">Equipamos locales de estas marcas</p>
        <div className="clients-logos">
          <img src="/images/sandrologo.png" alt="Sandro Paris" width={211} height={63} loading="lazy" className="logo-wide" />
          <img src="/images/logoypf.png" alt="YPF Full" width={213} height={60} loading="lazy" className="logo-wide" />
          <img src="/images/mcdonaldslogo.png" alt="McDonald's" width={246} height={205} loading="lazy" />
          <Picture src="/images/burguerlogo.png" alt="Burger King" width={215} height={234} loading="lazy" />
          <img src="/images/shelllogo.png" alt="Shell" width={245} height={206} loading="lazy" />
        </div>
      </section>

      <section className="testimonials section-fade" aria-label="Testimonios de clientes">
        <h2>Lo que dicen quienes nos eligen</h2>
        <div className="testimonial-grid">
          {testimonios.map((t) => (
            <article className="testimonial-card" key={t.id}>
              <div className="stars" aria-label="5 estrellas">
                <Icon name="star" /><Icon name="star" /><Icon name="star" />
                <Icon name="star" /><Icon name="star" />
              </div>
              <p>{t.text}</p>
              <p className="testimonial-author">{t.author}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gallery-section section-fade" aria-label="Galería de trabajos">
        <h2 className="section-title">Nuestros trabajos</h2>
        <p className="section-subtitle">Cada pieza sale de nuestras manos directo a tu espacio.</p>
        <div className="gallery-grid">
          {GALLERY.map((g, i) => (
            <div className={`gallery-item ${g.tall ? 'gallery-tall' : ''} ${g.wide ? 'gallery-wide' : ''}`}
              key={g.wide ? `${g.src}-wide` : g.src} role="button" tabIndex={0} aria-label={`Ampliar: ${g.label}`}
              onClick={() => setLightbox(i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightbox(i); } }}>
              <Picture src={g.src} alt={g.alt} width={g.w} height={g.h} loading="lazy" sizes="(max-width: 760px) 50vw, 400px" />
              <div className="gallery-overlay">{g.label}</div>
            </div>
          ))}
        </div>
      </section>

      <Modal className="lightbox" label="Galería de trabajos" open={lightbox !== null}
        onClose={() => setLightbox(null)} onKeyDown={onLightboxKey}>
        {lightbox !== null && (
          <>
            <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Cerrar">×</button>
            <button className="lightbox-prev" onClick={() => shiftLightbox(-1)} aria-label="Anterior"><Icon name="chevron-left" /></button>
            <img className="lightbox-img" src={GALLERY[lightbox].src} alt={GALLERY[lightbox].alt || GALLERY[lightbox].label} />
            <button className="lightbox-next" onClick={() => shiftLightbox(1)} aria-label="Siguiente"><Icon name="chevron-right" /></button>
            <p className="lightbox-caption">{GALLERY[lightbox].label}</p>
          </>
        )}
      </Modal>
    </>
  );
}
