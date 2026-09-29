import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo, { breadcrumbList } from '../components/Seo';
import PageHero from '../components/PageHero';
import Picture from '../components/Picture';
import Modal from '../components/Modal';
import { loadFireDB } from '../lib/firebaseConfig';

const WHY = [
  { title: 'Directo de fábrica', desc: 'Sin intermediarios. Comprás al productor y ahorrás entre un 30% y 50% respecto al precio de retail.' },
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

const GALLERY = [
  { src: '/images/bkf1.jpg', alt: 'Sillón BKF', label: 'Sillón BKF Premium', tall: true, w: 1600, h: 1600 },
  { src: '/images/bkfapoyapies.jpg', alt: 'Banco BKF', label: 'Banco BKF', w: 1024, h: 1024 },
  { src: '/images/mesa.jpeg', alt: 'Base de Mesa Flat', label: 'Base de Mesa Flat', w: 1024, h: 1536 },
  { src: '/images/mesa.jpeg', alt: 'Base de Mesa Flat detalle', label: 'Base de Mesa Flat', wide: true, w: 1024, h: 1536 },
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
        title="Nosotros — Quiénes Somos | Taller Kappa"
        description="Más de 15 años fabricando muebles de hierro y cuero. Conocé a Taller Kappa, nuestros valores, historia y los clientes que confían en nosotros."
        path="/nosotros"
        jsonLd={breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Nosotros', path: '/nosotros' }])}
      />
      <PageHero
        title="Una fábrica de muebles de hierro en San Martín"
        lead="Más de 15 años fabricando con precisión, calidad y pasión."
        current="Nosotros"
      />

      <section className="about-section section-padding section-fade">
        <div className="about-grid">
          <div className="about-text">
            <h2 className="section-title">Nuestra historia</h2>
            <p>Taller Kappa nació hace más de <strong>15 años</strong> en San Martín, Buenos Aires, con una sola misión: fabricar mobiliario de hierro y cuero de calidad industrial, accesible a locales, empresas y particulares.</p>
            <p>Desde el primer día trabajamos con hierro macizo de 12mm, cuero vacuno de primera selección y pintura epoxi de doble capa. Sin atajos, sin materiales baratos.</p>
            <p>Hoy somos el proveedor de confianza de <strong>YPF, McDonald's, Burger King, Shell Select y Sandro</strong>, entre otras marcas que eligieron nuestra calidad para sus espacios. Conocé nuestro <Link to="/sillon-bkf">Sillón BKF</Link> o mirá el <Link to="/catalogo">catálogo completo</Link>.</p>
            <Link to="/contacto" className="btn-main" style={{ marginTop: 8 }}>
              Contactarnos
            </Link>
          </div>
          <div className="about-img-wrap">
            <Picture src="/images/bkf1.jpg" alt="Sillón BKF — fabricación propia Taller Kappa" width={1600} height={1600} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="why-section section-fade" aria-label="Por qué elegirnos">
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <p className="section-subtitle">Más de 15 años fabricando para los más exigentes del mercado.</p>
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
                <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" />
                <i className="fas fa-star" /><i className="fas fa-star" />
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
              key={g.alt} role="button" tabIndex={0} aria-label={`Ampliar: ${g.label}`}
              onClick={() => setLightbox(i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightbox(i); } }}>
              <Picture src={g.src} alt={g.alt} width={g.w} height={g.h} loading="lazy" />
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
            <button className="lightbox-prev" onClick={() => shiftLightbox(-1)} aria-label="Anterior"><i className="fas fa-chevron-left" /></button>
            <img className="lightbox-img" src={GALLERY[lightbox].src} alt={GALLERY[lightbox].alt} />
            <button className="lightbox-next" onClick={() => shiftLightbox(1)} aria-label="Siguiente"><i className="fas fa-chevron-right" /></button>
            <p className="lightbox-caption">{GALLERY[lightbox].label}</p>
          </>
        )}
      </Modal>
    </>
  );
}
