import { useEffect, useState } from 'react';
import Seo, { breadcrumbList } from '../components/Seo';
import { useStaggerReveal } from '../lib/useReveal';

const FALLBACK_FAQS = [
  { id: '1', question: '¿Dónde comprar un sillón BKF en Buenos Aires?', answer: 'En Taller Kappa, fábrica ubicada en San Martín, Buenos Aires.' },
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
    </section>
  );
}
