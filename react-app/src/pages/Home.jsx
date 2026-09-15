import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { animateHeroTitle, animateHeroParagraph, useReveal, useStaggerReveal } from '../lib/useReveal';
import Seo from '../components/Seo';

export default function Home() {
  const titleRef = useRef(null);
  const introRef = useRef(null);
  const whyRef = useStaggerReveal('.why-card');
  const collectionRef = useReveal({ delay: 100 });

  useEffect(() => {
    // Anima el H1 letra por letra al montar (patrón splitText de anime.js v4)
    if (titleRef.current) animateHeroTitle('#hero-title');
    // Anima el copy debajo del H1 palabra por palabra (splitText words + clip)
    if (introRef.current) animateHeroParagraph('#hero-intro');
  }, []);

  return (
    <>
      <Seo
        title="Taller Kappa | Sillones BKF y Muebles de Hierro en Buenos Aires"
        description="Fábrica de sillones BKF, bancos y bases de mesa de hierro y cuero en San Martín, Buenos Aires. Fabricación a medida, envíos y atención a empresas."
        path="/"
      />
      <section className="hero">
        <div className="hero-content">
          <h1 id="hero-title" ref={titleRef} data-split>
            Sillones BKF y Sillas de Hierro en <span className="hero-highlight">Buenos Aires</span>
          </h1>
          <p id="hero-intro" ref={introRef}>Fabricamos sillones BKF, sillas y mesas de hierro y cuero directo de fábrica. Calidad elegida por YPF, McDonald's y Burger King.</p>
          <p className="hero-seo-tag">Sillón BKF · Sillas de Hierro Buenos Aires · Cuero Vacuno · San Martín, GBA</p>
          <div className="hero-buttons">
            <Link to="/catalogo" className="btn-main">
              <i className="fas fa-th-large" style={{ marginRight: 8 }} /> Ver Catálogo
            </Link>
            <a
              href="https://wa.me/541161242498?text=Hola%2C+soy+una+empresa+y+necesito+cotizaci%C3%B3n+mayorista."
              target="_blank" rel="noopener noreferrer" className="btn-outline"
            >
              <i className="fab fa-whatsapp" style={{ marginRight: 8 }} /> Atención Empresas
            </a>
          </div>
        </div>
      </section>

      <section className="why-section" ref={whyRef}>
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <div className="why-grid">
          {[
            { icon: 'fa-industry', title: 'Directo de Fábrica', text: 'Sin intermediarios. Comprás al productor y ahorrás entre un 30% y 50% respecto al precio de retail.' },
            { icon: 'fa-shield-alt', title: 'Garantía de Resistencia', text: 'Hierro macizo de primera calidad. Nuestras piezas soportan el uso gastronómico intensivo sin deformarse.' },
            { icon: 'fa-ruler-combined', title: 'Fabricación a Medida', text: 'Adaptamos cada pieza a tus necesidades. Medidas, colores y acabados personalizados sin costo adicional.' },
            { icon: 'fa-file-invoice', title: 'Factura A y B', text: 'Somos contribuyentes responsables. Emitimos cualquier tipo de comprobante para personas y empresas.' },
          ].map((c) => (
            <div className="why-card" key={c.title}>
              <i className={`fas ${c.icon}`} />
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding" ref={collectionRef}>
        <h2 className="section-title">Sillones BKF y Muebles de Hierro — Buenos Aires</h2>
        <p style={{ textAlign: 'center', marginBottom: 30 }}>
          Mobiliario industrial fabricado a mano en San Martín, Buenos Aires.{' '}
          <Link to="/sillon-bkf">Ver todo sobre el Sillón BKF →</Link>
        </p>
        <p style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 20px' }}>
          Además de sillones, equipamos locales gastronómicos y comercios con bases de mesa de hierro.
          Conocé nuestros <Link to="/proyectos">proyectos realizados</Link> para marcas como YPF, McDonald's
          y Burger King, o descubrí la <Link to="/nosotros">historia de Taller Kappa</Link>.
        </p>
        <p style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          Antes de comprar, revisá nuestras <Link to="/envios">zonas y tiempos de envío</Link> y las{' '}
          <Link to="/garantia">condiciones de garantía</Link>. Si tenés dudas, visitá las{' '}
          <Link to="/faq">preguntas frecuentes</Link> o <Link to="/contacto">contactanos</Link> directamente.
        </p>
        {/* El grid de productos vive en /catalogo — acá solo el teaser + CTA */}
      </section>
    </>
  );
}
