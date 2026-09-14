import { Link } from 'react-router-dom';
import { useStaggerReveal } from '../lib/useReveal';
import Seo, { breadcrumbList } from '../components/Seo';

const WARRANTY = [
  { icon: 'fa-certificate', title: 'Garantía de Estructura', desc: 'Todas nuestras piezas de hierro tienen garantía de por vida en la estructura. Si se deforma o presenta defectos de soldadura, lo reparamos o reponemos sin cargo.' },
  { icon: 'fa-paint-roller', title: 'Garantía de Pintura', desc: 'La pintura epoxi tiene garantía de 2 años contra descascaramiento o pérdida de adherencia en condiciones normales de uso interior.' },
  { icon: 'fa-couch', title: 'Garantía del Cuero', desc: 'El cuero vacuno tiene garantía de 1 año contra defectos de fabricación (costuras, cortes). El desgaste natural del cuero no está cubierto.' },
  { icon: 'fa-undo', title: 'Cambios y Devoluciones', desc: 'Si recibís un producto con algún defecto, contactanos dentro de las 72 hs de recibido y lo resolvemos sin costo de envío.' },
];

const CARE = [
  { n: 1, title: 'Hierro Pintado (Epoxi)', ok: ['Limpiar con paño húmedo y detergente neutro', 'Secar bien después de limpiar'], no: ['No usar productos abrasivos ni virulana', 'Evitar exposición prolongada a lluvia directa'] },
  { n: 2, title: 'Hierro Cromado', ok: ['Limpiar con paño suave y limpiametales', 'Pulir cada 3-6 meses para mantener el brillo'], no: ['No usar productos ácidos', 'No dejar en exteriores húmedos'] },
  { n: 3, title: 'Cuero Vacuno', ok: ['Limpiar con paño seco o ligeramente húmedo', 'Aplicar crema hidratante para cuero cada 6 meses', 'El cuero se oscurece naturalmente con el uso — eso es normal'], no: ['No exponer al sol directo por períodos prolongados', 'No usar alcohol ni solventes'] },
];

export default function Garantia() {
  const wRef = useStaggerReveal('.warranty-card');
  const cRef = useStaggerReveal('.care-card');

  return (
    <>
      <Seo
        title="Garantía y Cuidados — Muebles de Hierro y Cuero | Taller Kappa"
        description="Política de garantía de Taller Kappa. Todos nuestros muebles de hierro y cuero tienen garantía de fabricación. Conocé cómo cuidar tus productos."
        path="/garantia"
        jsonLd={breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Garantía', path: '/garantia' }])}
      />
      <div className="page-hero">
        <div className="page-hero-content">
          <h1><i className="fas fa-shield-alt" /> Garantía y Cuidados</h1>
          <p>Respaldamos cada pieza que fabricamos con garantía de calidad.</p>
          <nav className="breadcrumb" aria-label="Ruta de navegación">
            <Link to="/">Inicio</Link>
            <i className="fas fa-chevron-right" />
            <span>Garantía</span>
          </nav>
        </div>
      </div>

      <section className="warranty-section section-padding section-fade">
        <h2 className="section-title">Nuestra Garantía</h2>
        <p className="section-subtitle">Confiamos en lo que hacemos. Por eso garantizamos cada producto.</p>

        <div className="warranty-grid" ref={wRef}>
          {WARRANTY.map((w) => (
            <div className="warranty-card" key={w.title}>
              <div className="warranty-icon"><i className={`fas ${w.icon}`} /></div>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="care-section section-fade">
        <h2 className="section-title">Cuidados del Producto</h2>
        <p className="section-subtitle">Seguí estos consejos para mantener tus muebles como nuevos por años.</p>

        <div className="care-grid" ref={cRef}>
          {CARE.map((c) => (
            <div className="care-card" key={c.title}>
              <div className="care-number">{c.n}</div>
              <h3>{c.title}</h3>
              <ul>
                {c.ok.map((t) => <li key={t}><i className="fas fa-check-circle" /> {t}</li>)}
                {c.no.map((t) => <li key={t}><i className="fas fa-times-circle" /> {t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section section-fade">
        <div className="cta-box">
          <h2>¿Tenés un problema con tu producto?</h2>
          <p>Escribinos y lo resolvemos. Tu satisfacción es nuestra prioridad.</p>
          <div className="cta-btns">
            <a href="https://wa.me/541161242498?text=Hola%2C+necesito+hacer+un+reclamo+de+garantía."
              target="_blank" rel="noopener noreferrer" className="btn-main">
              <i className="fab fa-whatsapp" /> Contactar soporte
            </a>
            <Link to="/faq" className="btn-outline">
              <i className="fas fa-question-circle" /> Preguntas Frecuentes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
