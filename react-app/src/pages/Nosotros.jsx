import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStaggerReveal } from '../lib/useReveal';
import Seo, { breadcrumbList } from '../components/Seo';

const WHY = [
  { icon: 'fa-industry', title: 'Directo de Fábrica', desc: 'Sin intermediarios. Comprás al productor y ahorrás entre un 30% y 50% respecto al precio de retail.' },
  { icon: 'fa-shield-alt', title: 'Garantía de Resistencia', desc: 'Hierro macizo de primera calidad. Nuestras piezas soportan el uso gastronómico intensivo sin deformarse.' },
  { icon: 'fa-pencil-ruler', title: 'Fabricación a Medida', desc: 'Adaptamos cada pieza a tus necesidades. Medidas, colores y acabados personalizados sin costo adicional.' },
  { icon: 'fa-file-invoice', title: 'Factura A y B', desc: 'Somos contribuyentes responsables. Emitimos cualquier tipo de comprobante para personas y empresas.' },
];

const NUMBERS = [
  { target: 15, suffix: '+', label: 'Años de experiencia' },
  { target: 500, suffix: '+', label: 'Proyectos entregados' },
  { target: 12, suffix: '', label: 'mm de hierro macizo' },
  { target: 5, suffix: '', label: 'Grandes marcas equipadas' },
];

const FALLBACK_TESTIMONIOS = [
  { id: '1', text: '"Equipamos nuestro local de YPF Full con las Bases Flat de Taller Kappa. Soportan el alto tránsito sin problemas."', author: '— Franquicia YPF Full' },
  { id: '2', text: '"La calidad del hierro es excelente y cumplieron con los tiempos pactados."', author: '— Local Gastronómico (Shell Select)' },
  { id: '3', text: '"Excelente atención de Francisco. Me asesoró con las medidas para mi mesa."', author: '— Ricardo L. (Particular)' },
];

const GALLERY = [
  { src: '/images/bkf1.jpg', alt: 'Sillón BKF', label: 'Sillón BKF Premium', tall: true },
  { src: '/images/bkfapoyapies.jpg', alt: 'Banco BKF', label: 'Banco BKF' },
  { src: '/images/mesa.jpeg', alt: 'Base de Mesa Flat', label: 'Base de Mesa Flat' },
  { src: '/images/mesa.jpeg', alt: 'Base de Mesa Flat detalle', label: 'Base de Mesa Flat', wide: true },
];

function AnimatedNumber({ target, suffix, label }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame;
    let started = false;
    const el = document.getElementById(`num-${target}-${label}`);
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        const duration = 1200;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          setValue(Math.floor(progress * target));
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(frame); };
  }, [target, label]);

  return (
    <div className="number-item" id={`num-${target}-${label}`}>
      <span className="number-value">{value}</span><span className="number-suffix">{suffix}</span>
      <p className="number-label">{label}</p>
    </div>
  );
}

export default function Nosotros() {
  const whyRef = useStaggerReveal('.why-card');
  const [testimonios, setTestimonios] = useState(FALLBACK_TESTIMONIOS);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    import('../lib/firedb')
      .then(({ FireDB }) => FireDB.getTestimonios())
      .then((data) => { if (data.length) setTestimonios(data); })
      .catch(() => {});
  }, []);

  const shiftLightbox = (dir) => {
    setLightbox((i) => (i === null ? i : (i + dir + GALLERY.length) % GALLERY.length));
  };

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft') shiftLightbox(-1);
      if (e.key === 'ArrowRight') shiftLightbox(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <>
      <Seo
        title="Nosotros — Quiénes Somos | Taller Kappa"
        description="Más de 15 años fabricando muebles de hierro y cuero. Conocé a Taller Kappa, nuestros valores, historia y los clientes que confían en nosotros."
        path="/nosotros"
        jsonLd={breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Nosotros', path: '/nosotros' }])}
      />
      <div className="page-hero">
        <div className="page-hero-content">
          <h1><i className="fas fa-users" /> Nosotros</h1>
          <p>Más de 15 años fabricando con precisión, calidad y pasión.</p>
          <nav className="breadcrumb" aria-label="Ruta de navegación">
            <Link to="/">Inicio</Link>
            <i className="fas fa-chevron-right" />
            <span>Nosotros</span>
          </nav>
        </div>
      </div>

      <section className="about-section section-padding section-fade">
        <div className="about-grid">
          <div className="about-text">
            <h2 className="section-title">Nuestra Historia</h2>
            <p>Taller Kappa nació hace más de <strong>15 años</strong> en San Martín, Buenos Aires, con una sola misión: fabricar mobiliario de hierro y cuero de calidad industrial, accesible a locales, empresas y particulares.</p>
            <p>Desde el primer día trabajamos con hierro macizo de 12mm, cuero vacuno de primera selección y pintura epoxi de doble capa. Sin atajos, sin materiales baratos.</p>
            <p>Hoy somos el proveedor de confianza de <strong>YPF, McDonald's, Burger King, Shell Select y Sandro</strong>, entre otras marcas que eligieron nuestra calidad para sus espacios.</p>
            <Link to="/contacto" className="btn-main" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: '1.5rem' }}>
              <i className="fas fa-envelope" /> Contactarnos
            </Link>
          </div>
          <div className="about-img-wrap">
            <img src="/images/bkf1.jpg" alt="Sillón BKF — fabricación propia Taller Kappa" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="why-section section-fade" aria-label="Por qué elegirnos">
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <p className="section-subtitle">Más de 15 años fabricando para los más exigentes del mercado.</p>
        <div className="why-grid" ref={whyRef}>
          {WHY.map((w) => (
            <div className="why-card" key={w.title}>
              <div className="why-icon"><i className={`fas ${w.icon}`} /></div>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="numbers-section section-fade" aria-label="Números de Taller Kappa">
        <div className="numbers-grid">
          {NUMBERS.map((n) => (
            <AnimatedNumber key={n.label} target={n.target} suffix={n.suffix} label={n.label} />
          ))}
        </div>
      </section>

      <section className="clients-section section-fade" aria-label="Empresas que confían en nosotros">
        <p className="clients-label">Confían en nuestra calidad:</p>
        <div className="clients-logos">
          <img src="/images/sandrologo.png" alt="Sandro Paris" loading="lazy" />
          <img src="/images/logoypf.png" alt="YPF Full" loading="lazy" />
          <img src="/images/mcdonaldslogo.png" alt="McDonald's" loading="lazy" />
          <img src="/images/burguerlogo.png" alt="Burger King" loading="lazy" />
          <img src="/images/shelllogo.png" alt="Shell" loading="lazy" />
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
              key={i} onClick={() => setLightbox(i)}>
              <img src={g.src} alt={g.alt} loading="lazy" />
              <div className="gallery-overlay"><i className="fas fa-search-plus" /><span>{g.label}</span></div>
            </div>
          ))}
        </div>
      </section>

      {lightbox !== null && (
        <div className="lightbox" style={{ display: 'flex' }} onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Cerrar">×</button>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); shiftLightbox(-1); }} aria-label="Anterior"><i className="fas fa-chevron-left" /></button>
          <img className="lightbox-img" src={GALLERY[lightbox].src} alt={GALLERY[lightbox].alt} onClick={(e) => e.stopPropagation()} />
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); shiftLightbox(1); }} aria-label="Siguiente"><i className="fas fa-chevron-right" /></button>
          <p className="lightbox-caption">{GALLERY[lightbox].label}</p>
        </div>
      )}
    </>
  );
}
