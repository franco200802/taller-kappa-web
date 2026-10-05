import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { useEffect, useState } from 'react';
import Seo from '../components/Seo';
import { faqNode } from '../lib/schema';
import PageHero from '../components/PageHero';
import { loadFireDB } from '../lib/firebaseConfig';
import { FAQS as FALLBACK_FAQS } from '../data/faq';

function FaqItem({ f }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button type="button" className="faq-question" aria-expanded={open} aria-controls={`faq-answer-${f.id}`}
        onClick={() => setOpen((o) => !o)}>
        <span>{f.question}</span>
        <Icon name="chevron-down" className="faq-icon-right" />
      </button>
      <div className="faq-answer" id={`faq-answer-${f.id}`}><p>{f.answer}</p></div>
    </div>
  );
}

export default function FAQ() {
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);

  useEffect(() => {
    loadFireDB()
      .then((db) => db.getFAQs())
      .then((data) => { if (data.length) setFaqs(data); })
      .catch(() => {});
  }, []);

  return (
    <>
      <Seo
        title="Preguntas Frecuentes: Sillón BKF, Envíos y Garantía | Taller Kappa"
        description="Respuestas sobre Taller Kappa: qué fabrica, dónde está, sillón BKF, banco y base de mesa, mobiliario comercial, precios, envíos, garantía y contacto."
        path="/faq"
        breadcrumb={[{ name: 'Inicio', path: '/' }, { name: 'Preguntas Frecuentes', path: '/faq' }]}
        jsonLd={faqNode(faqs.map((f) => ({ q: f.question, a: f.answer })), '/faq')}
      />
      <PageHero
        title="Preguntas frecuentes sobre Taller Kappa y los sillones BKF"
        lead="Quiénes somos, qué fabricamos, precios, envíos y garantía."
        current="Preguntas frecuentes"
      />
      <section className="section-padding">
        <div id="faq">
          {faqs.map((f) => <FaqItem key={f.id} f={f} />)}
        </div>
        <p style={{ marginTop: 24 }}>
          ¿No encontraste lo que buscabas? <Link to="/contacto/">Contactanos</Link> o mirá nuestro{' '}
          <Link to="/catalogo/">catálogo de sillones, bancos y bases de mesa</Link>. Más información: <Link to="/bkf/">qué es el sillón BKF</Link>,
          el <Link to="/sillon-bkf/">cómo comprar el sillón BKF</Link> y el <Link to="/mobiliario-comercial/">mobiliario comercial a medida</Link>.
        </p>
      </section>
    </>
  );
}
