import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Seo from '../components/Seo';
import { faqNode } from '../lib/schema';
import PageHero from '../components/PageHero';
import { loadFireDB } from '../lib/firebaseConfig';

// Cada respuesta usa datos que ya publica el sitio (ver data/business.js y
// data/products.js). Van en texto plano porque son también el `text` del FAQPage.
const FALLBACK_FAQS = [
  { id: '1', question: '¿Qué es Taller Kappa?', answer: 'Taller Kappa S.R.L. es una fábrica de muebles de hierro y cuero ubicada en Villa Chacabuco, San Martín, provincia de Buenos Aires, Argentina. Fabrica sillones BKF, bancos BKF y bases de mesa para particulares, empresas y locales gastronómicos.' },
  { id: '2', question: '¿Dónde está Taller Kappa?', answer: 'En Calle 28 Nº 3779, Villa Chacabuco (San Martín), provincia de Buenos Aires. El retiro de pedidos en el taller es de lunes a viernes de 9 a 18 hs.' },
  { id: '3', question: '¿Qué es un sillón BKF?', answer: 'El sillón BKF (también conocido como silla paleta o butterfly chair) es un diseño de 1938 creado por Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy. En Taller Kappa lo fabricamos artesanalmente con estructura de hierro y funda de cuero.' },
  { id: '4', question: '¿Dónde comprar un sillón BKF en Buenos Aires?', answer: 'En Taller Kappa, fábrica ubicada en Calle 28 Nº 3779, Villa Chacabuco (San Martín), Buenos Aires. Podés consultar stock y coordinar tu compra por WhatsApp o visitar el showroom.' },
  { id: '5', question: '¿Taller Kappa fabrica sus propios sillones BKF?', answer: 'Sí. Taller Kappa fabrica los sillones BKF en su propio taller de San Martín, con hierro macizo redondo de 12 mm y cuero vacuno, y los vende directo de fábrica.' },
  { id: '6', question: '¿Qué productos fabrica Taller Kappa?', answer: 'El catálogo incluye el Sillón BKF Premium y el Banco BKF (categoría Asientos) y la Base de Mesa Flat (categoría Mesas). Se fabrican en hierro, con colores y terminaciones a pedido.' },
  { id: '7', question: '¿Qué diferencia hay entre el sillón BKF y el banco BKF?', answer: 'Comparten diseño y materiales, y se diferencian por tamaño y uso: el Sillón BKF Premium mide 78 x 70 x 90 cm; el Banco BKF mide 38 x 38 x 45 cm y se usa como pie de cama o asiento auxiliar.' },
  { id: '8', question: '¿Qué tipos de mesas vende Taller Kappa?', answer: 'En el catálogo figura la Base de Mesa Flat: una base de chapa torneada de 10 mm con columna central, en altura de mesa (73 cm) y de barra (105 cm), pensada para uso gastronómico. Para otros modelos o medidas, consultá por WhatsApp.' },
  { id: '9', question: '¿Taller Kappa vende mobiliario comercial?', answer: 'Sí. Fabrica mobiliario de hierro a medida para locales gastronómicos, estaciones de servicio y comercios. Entre sus clientes figuran YPF, McDonald\'s, Burger King, Shell Select y Sandro.' },
  { id: '10', question: '¿De qué materiales están fabricados los productos?', answer: 'Usamos hierro macizo redondo de 12mm (sin tubos ni rellenos), pintura epoxi y cuero vacuno. Cada pieza se fabrica en nuestro taller de San Martín, Buenos Aires.' },
  { id: '11', question: '¿Cómo consulto precios o hago un pedido?', answer: 'Los precios se cotizan según cantidad, color y terminación. Escribinos por WhatsApp o completá el formulario de contacto y te respondemos con la cotización.' },
  { id: '12', question: '¿Hacen envíos?', answer: 'Sí. Coordinamos envíos en Buenos Aires (CABA y GBA) y también al interior del país mediante empresas de transporte. Los tiempos y costos varían según la zona de entrega.' },
  { id: '13', question: '¿Los productos tienen garantía?', answer: 'Sí. La estructura de hierro tiene garantía de por vida, la pintura 2 años y el cuero 1 año. Podés ver el detalle completo en la sección de garantía.' },
  { id: '14', question: '¿Fabrican productos a medida?', answer: 'Sí, adaptamos medidas, colores y terminaciones según lo que necesite cada cliente, sin costo adicional.' },
  { id: '15', question: '¿Emiten factura?', answer: 'Sí. Taller Kappa emite factura A y B, para personas y empresas.' },
  { id: '16', question: '¿Cómo los contacto?', answer: 'Por WhatsApp al 11 6124-2498, por email a ing.franciscomarotta@gmail.com, o mediante el formulario de la sección de contacto.' },
];

function FaqItem({ f }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button type="button" className="faq-question" aria-expanded={open} aria-controls={`faq-answer-${f.id}`}
        onClick={() => setOpen((o) => !o)}>
        <span>{f.question}</span>
        <i className="fas fa-chevron-down faq-icon-right" />
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
        title="Preguntas Frecuentes | Taller Kappa"
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
          <Link to="/catalogo/">catálogo de sillones, bancos y bases de mesa</Link>.
        </p>
      </section>
    </>
  );
}
