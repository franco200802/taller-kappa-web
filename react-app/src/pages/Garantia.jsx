import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { whatsappUrl } from '../data/contact';

const WARRANTY = [
  { icon: 'fa-certificate', title: 'Garantía de la estructura', desc: 'Todas nuestras piezas de hierro tienen garantía de por vida en la estructura. Si se deforma o presenta defectos de soldadura, lo reparamos o reponemos sin cargo.' },
  { icon: 'fa-paint-roller', title: 'Garantía de la pintura', desc: 'La pintura epoxi tiene garantía de 2 años contra descascaramiento o pérdida de adherencia en condiciones normales de uso interior.' },
  { icon: 'fa-couch', title: 'Garantía del cuero', desc: 'El cuero vacuno tiene garantía de 1 año contra defectos de fabricación (costuras, cortes). El desgaste natural del cuero no está cubierto.' },
  { icon: 'fa-undo', title: 'Cambios y devoluciones', desc: 'Si recibís un producto con algún defecto, contactanos dentro de las 72 hs de recibido y lo resolvemos sin costo de envío.' },
];

const CARE = [
  { n: 1, title: 'Hierro pintado (epoxi)', ok: ['Limpiar con paño húmedo y detergente neutro', 'Secar bien después de limpiar'], no: ['No usar productos abrasivos ni virulana', 'Evitar exposición prolongada a lluvia directa'] },
  { n: 2, title: 'Hierro cromado', ok: ['Limpiar con paño suave y limpiametales', 'Pulir cada 3-6 meses para mantener el brillo'], no: ['No usar productos ácidos', 'No dejar en exteriores húmedos'] },
  { n: 3, title: 'Cuero vacuno', ok: ['Limpiar con paño seco o ligeramente húmedo', 'Aplicar crema hidratante para cuero cada 6 meses', 'El cuero se oscurece naturalmente con el uso — eso es normal'], no: ['No exponer al sol directo por períodos prolongados', 'No usar alcohol ni solventes'] },
];

export default function Garantia() {
  return (
    <>
      <Seo
        title="Garantía y Cuidados — Muebles de Hierro y Cuero | Taller Kappa"
        description="Política de garantía de Taller Kappa. Todos nuestros muebles de hierro y cuero tienen garantía de fabricación. Conocé cómo cuidar tus productos."
        path="/garantia"
        breadcrumb={[{ name: 'Inicio', path: '/' }, { name: 'Garantía', path: '/garantia' }]}
      />
      <PageHero
        title="Garantía y cuidados de muebles de hierro y cuero"
        lead="Respaldamos cada pieza que fabricamos con garantía de calidad."
        current="Garantía"
      />

      <section className="warranty-section section-padding section-fade">
        <h2 className="section-title">Nuestra garantía</h2>
        <p className="section-subtitle">Confiamos en lo que hacemos. Por eso garantizamos cada producto.</p>

        <div className="warranty-grid">
          {WARRANTY.map((w) => (
            <div className="warranty-card" key={w.title}>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="care-section section-fade">
        <h2 className="section-title">Cuidados del producto</h2>
        <p className="section-subtitle">Seguí estos consejos para mantener tus muebles como nuevos por años.</p>

        <div className="care-grid">
          {CARE.map((c) => (
            <div className="care-card" key={c.title}>
              <div className="care-number">{c.n}</div>
              <h3>{c.title}</h3>
              <ul>
                {c.ok.map((t) => <li key={t}><Icon name="check-circle" /> {t}</li>)}
                {c.no.map((t) => <li key={t}><Icon name="times-circle" /> {t}</li>)}
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
            <a href={whatsappUrl('Hola, necesito hacer un reclamo de garantía.')}
              target="_blank" rel="noopener noreferrer" className="btn-main">
              <Icon name="whatsapp" /> Contactar soporte
            </a>
            <Link to="/faq/" className="btn-outline">
              <Icon name="question-circle" /> Preguntas frecuentes
            </Link>
          </div>
          <p className="cta-links">
            Ver el <Link to="/catalogo/">catálogo completo</Link> o{' '}
            <Link to="/contacto/">contactanos</Link> por cualquier consulta.
          </p>
        </div>
      </section>
    </>
  );
}
