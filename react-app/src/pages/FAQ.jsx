import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Seo, { breadcrumbList } from '../components/Seo';
import { useStaggerReveal } from '../lib/useReveal';

const FALLBACK_FAQS = [
  { id: '1', question: '¿Qué es un sillón BKF?', answer: 'El sillón BKF (también conocido como silla paleta o butterfly chair) es un diseño de 1938 creado por Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy. En Taller Kappa lo fabricamos artesanalmente con estructura de hierro y funda de cuero.' },
  { id: '2', question: '¿Dónde comprar un sillón BKF en Buenos Aires?', answer: 'En Taller Kappa, fábrica ubicada en Calle 28 Nº 3779, Villa Chacabuco (San Martín), Buenos Aires. Podés consultar stock y coordinar tu compra por WhatsApp o visitar el showroom.' },
  { id: '3', question: '¿De qué materiales están fabricados los productos?', answer: 'Usamos hierro macizo redondo de 12mm (sin tubos ni rellenos), pintura epoxi y cuero vacuno. Cada pieza se fabrica en nuestro taller de San Martín, Buenos Aires.' },
  { id: '4', question: '¿Qué productos fabrica Taller Kappa?', answer: 'Fabricamos sillones BKF, bancos BKF y bases de mesa de hierro, con distintos colores y terminaciones a pedido. Podés ver el detalle de cada producto en el catálogo.' },
  { id: '5', question: '¿Cómo consulto precios o hago un pedido?', answer: 'Los precios se cotizan según cantidad, color y terminación. Escribinos por WhatsApp o completá el formulario de contacto y te respondemos con la cotización.' },
  { id: '6', question: '¿Hacen envíos?', answer: 'Sí. Coordinamos envíos en Buenos Aires (CABA y GBA) y también al interior del país mediante empresas de transporte. Los tiempos y costos varían según la zona de entrega.' },
  { id: '7', question: '¿Los productos tienen garantía?', answer: 'Sí. La estructura de hierro tiene garantía de por vida, la pintura 2 años y el cuero 1 año. Podés ver el detalle completo en la sección de garantía.' },
  { id: '8', question: '¿Fabrican productos a medida?', answer: 'Sí, adaptamos medidas, colores y terminaciones según lo que necesite cada cliente, sin costo adicional.' },
  { id: '9', question: '¿Cómo los contacto?', answer: 'Por WhatsApp al 11 6124-2498, por email a ing.franciscomarotta@gmail.com, o mediante el formulario de la sección de contacto.' },
];

function FaqItem({ f }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <div className="faq-question" role="button" tabIndex={0} aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpen((o) => !o)}>
        <span>{f.question}</span>
        <i className="fas fa-chevron-down faq-icon-right" />
      </div>
      <div className="faq-answer">{f.answer}</div>
    </div>
  );
}

export default function FAQ() {
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);
  // useStaggerReveal anima vía estilos inline (anime.js), por eso es inmune
  // a que React reescriba el className de cada .faq-item al abrir/cerrar
  // el acordeón (a diferencia del sistema global de reveal por classList).
  const listRef = useStaggerReveal('.faq-item', { staggerMs: 60 });

  useEffect(() => {
    import('../lib/firedb')
      .then(({ FireDB }) => FireDB.getFAQs())
      .then((data) => { if (data.length) setFaqs(data); })
      .catch(() => {});
  }, []);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <section className="section-padding" style={{ paddingTop: 60 }}>
      <Seo
        title="Preguntas Frecuentes | Taller Kappa"
        description="Respuestas sobre precios, envíos, garantía y materiales de los sillones BKF y muebles de hierro de Taller Kappa."
        path="/faq"
        jsonLd={[faqSchema, breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Preguntas Frecuentes', path: '/faq' }])]}
      />
      <h1>Preguntas Frecuentes sobre Sillones BKF y Envíos en Buenos Aires</h1>
      <div id="faq" ref={listRef}>
        {faqs.map((f) => <FaqItem key={f.id} f={f} />)}
      </div>
      <p style={{ marginTop: 24 }}>
        ¿No encontraste lo que buscabas? <Link to="/contacto">Contactanos</Link> o mirá nuestro{' '}
        <Link to="/catalogo">catálogo completo</Link>.
      </p>
    </section>
  );
}
