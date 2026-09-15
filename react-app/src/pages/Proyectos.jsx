import { Link } from 'react-router-dom';
import { useStaggerReveal } from '../lib/useReveal';
import Seo, { breadcrumbList } from '../components/Seo';

const PROJECTS = [
  {
    logo: '/images/logoypf.png', alt: 'Equipamiento YPF Full - muebles de hierro', w: 225, h: 225,
    title: 'YPF Full — Estaciones de Servicio', tag: 'Múltiples sucursales, Buenos Aires',
    desc: 'Fabricamos y entregamos bases de mesa Flat y bancos de hierro para las tiendas YPF Full. Diseño resistente al uso intensivo 24/7 con acabado en pintura epoxi negra.',
    specs: ['Bases de mesa entregadas', 'Acabado epoxi negro mate', 'Fabricación resistente a uso intensivo'],
  },
  {
    logo: '/images/mcdonaldslogo.png', alt: "Equipamiento McDonald's - mesas de hierro", w: 246, h: 205,
    title: "McDonald's — Locales Gastronómicos", tag: 'Capital Federal y GBA',
    desc: 'Proveemos estructuras metálicas para mobiliario de salón. Sillas y mesas que soportan el alto tránsito diario de la cadena más grande del mundo.',
    specs: ['Hierro macizo 12mm', 'Entrega en plazos ajustados', 'Factura A'],
  },
  {
    logo: '/images/burguerlogo.png', alt: 'Equipamiento Burger King - sillas de hierro', w: 215, h: 234,
    title: 'Burger King — Franquicias', tag: 'Buenos Aires',
    desc: 'Fabricamos sillas y bancos de hierro para locales Burger King. Diseño moderno, resistente y fácil de mantener para uso gastronómico diario.',
    specs: ['Diseño a medida del local', 'Pintura epoxi anticorrosiva', 'Reposición rápida'],
  },
  {
    logo: '/images/sandrologo.png', alt: 'Equipamiento Sandro Paris - mobiliario comercial', w: 225, h: 225,
    title: 'Sandro Paris — Locales de Indumentaria', tag: 'Palermo, Buenos Aires',
    desc: 'Desarrollamos mobiliario exhibidor en hierro para los locales Sandro. Percheros, mesas de exhibición y estructuras decorativas con acabado cromado.',
    specs: ['Acabado cromado premium', 'Diseño exclusivo', 'Medidas personalizadas'],
  },
  {
    logo: '/images/shelllogo.png', alt: 'Equipamiento Shell Select - muebles gastronómicos', w: 245, h: 206,
    title: 'Shell Select — Tiendas de Conveniencia', tag: 'Zona Norte, Buenos Aires',
    desc: 'Equipamos el sector gastronómico de Shell Select con bases de mesa y sillas de hierro. Producto resistente a uso intensivo con estética industrial moderna.',
    specs: ['Estética industrial', 'Resistente a intemperie', 'Entrega coordinada'],
  },
];

export default function Proyectos() {
  const gridRef = useStaggerReveal('.project-card');

  return (
    <>
      <Seo
        title="Proyectos — Clientes que Confían en Taller Kappa"
        description="Equipamos locales de YPF, McDonald's, Burger King, Shell y Sandro con mobiliario de hierro y cuero fabricado en Buenos Aires."
        path="/proyectos"
        jsonLd={breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Proyectos', path: '/proyectos' }])}
      />
      <div className="page-hero">
        <div className="page-hero-content">
          <h1><i className="fas fa-briefcase" /> Proyectos de Mobiliario de Hierro para Empresas</h1>
          <p>Equipamiento comercial y gastronómico fabricado a medida para locales y franquicias.</p>
          <nav className="breadcrumb" aria-label="Ruta de navegación">
            <Link to="/">Inicio</Link>
            <i className="fas fa-chevron-right" />
            <span>Proyectos</span>
          </nav>
        </div>
      </div>

      <section className="projects-section section-padding section-fade">
        <h2 className="section-title">Nuestros Clientes</h2>
        <p className="section-subtitle">Grandes marcas eligen Taller Kappa para su equipamiento comercial.</p>
        <p style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 30px' }}>
          Fabricamos mobiliario de hierro y cuero a medida para locales gastronómicos, estaciones de servicio
          y comercios. Si tenés un proyecto para tu empresa, <Link to="/contacto">contactanos</Link> y te asesoramos.
        </p>

        <div className="projects-grid" ref={gridRef}>
          {PROJECTS.map((p) => (
            <article className="project-card" key={p.title}>
              <div className="project-card-img">
                <img src={p.logo} alt={p.alt} width={p.w} height={p.h} loading="lazy" />
              </div>
              <div className="project-card-body">
                <h3>{p.title}</h3>
                <p className="project-tag"><i className="fas fa-map-marker-alt" /> {p.tag}</p>
                <p>{p.desc}</p>
                <ul className="project-specs">
                  {p.specs.map((s) => (
                    <li key={s}><i className="fas fa-check" /> {s}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section section-fade">
        <div className="cta-box">
          <h2>¿Querés equipar tu local o empresa?</h2>
          <p>Trabajamos con franquicias, restaurantes, bares, hoteles y oficinas. Pedí tu cotización sin compromiso.</p>
          <div className="cta-btns">
            <a href="https://wa.me/541161242498?text=Hola%2C+soy+de+una+empresa+y+necesito+cotización+para+equipamiento."
              target="_blank" rel="noopener noreferrer" className="btn-main">
              <i className="fab fa-whatsapp" /> Cotizar por WhatsApp
            </a>
            <Link to="/catalogo" className="btn-outline">
              <i className="fas fa-th-large" /> Ver Catálogo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
