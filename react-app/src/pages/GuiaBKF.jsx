import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import Picture from '../components/Picture';
import ProductTable from '../components/ProductTable';
import { SOCIAL_IMAGE_SIZE, productsInCategory, getProductBySlug, socialImage } from '../data/products';
import { whatsappUrl } from '../data/contact';
import { BUSINESS } from '../data/business';
import { articleId, articleNode, faqNode } from '../lib/schema';
import { assetUrl } from '../lib/site';

/**
 * /bkf/ — guía: qué es el sillón BKF, su historia y cómo elegir uno.
 *
 * Intención informativa ("BKF", "qué es BKF", "silla BKF", "sillón mariposa").
 * La página comercial, donde se compra, es /sillon-bkf/: acá se explica el
 * diseño y se enlaza a ella, para que no compitan por lo mismo.
 *
 * Los hechos históricos salen de las fuentes citadas al pie (Wikipedia, que a
 * su vez referencia al MoMA, y La Nación); lo que se dice de Taller Kappa sale
 * de data/products.js. Nada de esto es opinión ni marketing.
 */
const PATH = '/bkf';
const SOURCES = [
  { label: 'Silla BKF — Wikipedia', url: 'https://es.wikipedia.org/wiki/BKF' },
  { label: 'BKF, el sillón pionero y más reproducido de la Argentina — La Nación', url: 'https://www.lanacion.com.ar/opinion/bkf-el-sillon-pionero-y-mas-reproducido-de-la-argentina-nid10072022/' },
];

const FAQ = [
  { q: '¿Qué significa BKF?', a: 'BKF son las iniciales de los apellidos de sus creadores: Bonet, Kurchan y Ferrari Hardoy.' },
  { q: '¿Quién creó el sillón BKF y cuándo?', a: 'Lo crearon a fines de 1938, en Buenos Aires, los arquitectos Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy.' },
  { q: '¿El sillón BKF es lo mismo que la silla mariposa o la butterfly chair?', a: 'Sí, son nombres del mismo diseño. En inglés se lo conoce como butterfly chair ("silla mariposa") y también se lo llamó "silla Hardoy".' },
  { q: '¿De qué materiales está hecho un sillón BKF?', a: 'El diseño clásico combina una estructura de hierro macizo redondo con un asiento de cuero suspendido; algunas versiones usan lona o textil. El Sillón BKF Premium de Taller Kappa tiene estructura de hierro macizo de 12 mm y cuero vacuno curtido al vegetal.' },
  { q: '¿Qué medidas tiene un sillón BKF?', a: 'Las medidas cambian según el fabricante. El Sillón BKF Premium de Taller Kappa mide 78 x 70 x 90 cm en su versión estándar y también se fabrica a medida, sin costo adicional.' },
  { q: '¿Cuál es el sillón BKF original?', a: 'El diseño original es el de 1938 de Bonet, Kurchan y Ferrari Hardoy. Como no pudieron patentarlo, desde los años 40 circulan versiones oficiales y no oficiales, y hoy lo fabrican muchos talleres. Al comparar conviene preguntar por la estructura, el cuero y la terminación. Taller Kappa fabrica su propia versión de ese diseño.' },
  { q: '¿Cómo se cuida un sillón BKF de cuero?', a: 'Limpiá el cuero con un paño seco o apenas húmedo, aplicá crema hidratante para cuero cada 6 meses y evitá el sol directo prolongado, el alcohol y los solventes. El cuero se oscurece naturalmente con el uso. La estructura pintada se limpia con un paño húmedo y detergente neutro.' },
  { q: '¿Dónde comprar un sillón BKF en Buenos Aires y en Argentina?', a: 'Taller Kappa fabrica el Sillón BKF Premium en su taller de Villa Chacabuco, San Martín (Buenos Aires) y lo envía a todo el país. No se compra por la web: se cotiza por WhatsApp.' },
];

const TOC = [
  ['que-es', '¿Qué es el sillón BKF?'],
  ['significado', '¿Qué significa BKF?'],
  ['historia', 'Historia del sillón BKF'],
  ['materiales', 'Estructura y materiales'],
  ['como-elegir', 'Cómo elegir un sillón BKF'],
  ['donde-comprar', 'Dónde comprar un sillón BKF en Buenos Aires'],
  ['preguntas', 'Preguntas frecuentes'],
];

export default function GuiaBKF() {
  const sillon = getProductBySlug('sillon-bkf-premium');
  const description = 'Qué es el sillón BKF, qué significa BKF, quién lo creó en 1938 y cómo elegir uno: estructura, cuero y medidas. Guía de Taller Kappa, fábrica en San Martín.';

  return (
    <>
      <Seo
        title="Qué es el sillón BKF: historia y características | Taller Kappa"
        description={description}
        path={PATH}
        image={assetUrl(socialImage(sillon))}
        imageWidth={SOCIAL_IMAGE_SIZE.width}
        imageHeight={SOCIAL_IMAGE_SIZE.height}
        imageAlt={sillon.alt}
        mainEntity={articleId(PATH)}
        breadcrumb={[{ name: 'Inicio', path: '/' }, { name: 'Qué es el sillón BKF', path: PATH }]}
        jsonLd={[
          articleNode({
            path: PATH,
            headline: 'Sillón BKF: qué es, historia y características',
            description,
            image: socialImage(sillon),
            datePublished: '2026-10-01',
            // El diseño BKF como entidad, enlazada a una referencia pública; el producto de Taller Kappa va aparte.
            about: [{ '@type': 'Thing', name: 'Silla BKF', alternateName: ['Sillón BKF', 'Butterfly chair', 'Silla Hardoy'], sameAs: ['https://es.wikipedia.org/wiki/BKF'] }],
            citations: SOURCES.map((s) => s.url),
          }),
          faqNode(FAQ, PATH),
        ]}
      />
      <PageHero
        title="Sillón BKF: qué es, historia y características"
        lead="El BKF, también llamado silla BKF, sillón mariposa o butterfly chair, es un sillón de estructura de hierro y asiento de cuero suspendido, creado en Buenos Aires a fines de 1938 por los arquitectos Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy."
        current="Qué es el sillón BKF"
      />

      <article>
        <section className="section-padding guide">
          <nav className="guide-toc" aria-label="Contenido de la guía">
            <p className="guide-toc-title">En esta guía</p>
            <ol>
              {TOC.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}
            </ol>
          </nav>

          <div className="guide-body">
            <h2 id="que-es">¿Qué es el sillón BKF?</h2>
            <p>
              El sillón BKF es un diseño argentino de 1938: una estructura de hierro doblado que sostiene un asiento de cuero tensado, de modo que el
              cuerpo queda suspendido y el asiento se adapta al peso de quien se sienta. Se hizo mundialmente conocido como <em>butterfly chair</em> y hoy
              lo fabrican muchos talleres.
            </p>
            <dl className="facts">
              <div><dt>Nombres</dt><dd>BKF, silla BKF, sillón BKF, silla paleta, sillón mariposa, butterfly chair, silla Hardoy</dd></div>
              <div><dt>Creadores</dt><dd>Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy</dd></div>
              <div><dt>Origen</dt><dd>Buenos Aires, Argentina, fines de 1938</dd></div>
              <div><dt>Estructura</dt><dd>Hierro macizo redondo doblado</dd></div>
              <div><dt>Asiento</dt><dd>Cuero suspendido (algunas versiones, lona o textil)</dd></div>
              <div><dt>Reconocimiento</dt><dd>Incorporado a la colección permanente del MoMA de Nueva York en 1941</dd></div>
            </dl>

            <h2 id="significado">¿Qué significa BKF?</h2>
            <p>
              BKF son las iniciales de los apellidos de sus tres creadores: <strong>B</strong>onet, <strong>K</strong>urchan y <strong>F</strong>errari Hardoy.
              Los tres eran arquitectos y diseñaron la silla como equipamiento para su futuro estudio.
            </p>

            <h2 id="historia">Historia del sillón BKF</h2>
            <p>
              Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy la crearon a fines de 1938 en Buenos Aires. Se inspiraba en la forma de la
              Tripolina, una silla plegable de lona, y reemplazaba sus materiales por una estructura rígida de hierro esmaltado y un cuerpo de cuero.
            </p>
            <p>
              En 1940 fue premiada en una muestra de interiorismo de Buenos Aires. Ese mismo año, Edgar Kaufmann Jr. adquirió un ejemplar para la casa de
              Frank Lloyd Wright en Pensilvania y presentó el modelo a Eliot Noyes, curador del MoMA, que lo incorporó a la colección permanente del
              museo en 1941.
            </p>
            <p>
              Los autores no pudieron patentarla. A diferencia de la Tripolina, la BKF no fue pensada para la producción en serie, sino como una
              silla artesanal, de bajo costo y fácil de reproducir. Por eso se fabricó en distintos países y, hasta hoy, existen versiones de
              numerosos fabricantes.
            </p>
            <figure className="guide-figure">
              <Picture src={sillon.image} alt={sillon.alt} width={sillon.imageWidth} height={sillon.imageHeight} loading="lazy" sizes="(max-width: 860px) calc(100vw - 32px), 560px" />
              <figcaption>Sillón BKF Premium de Taller Kappa: hierro macizo de 12 mm y cuero vacuno curtido al vegetal.</figcaption>
            </figure>

            <h2 id="materiales">Estructura y materiales</h2>
            <p>
              El diseño clásico se compone de un bastidor de hierro macizo redondo, curvado para formar una geometría triangular invertida, y una
              superficie de cuero suspendida sobre él. La estructura se termina con pintura tipo epoxi; en algunas versiones el asiento es de lona o
              de textil en lugar de cuero.
            </p>

            <h2 id="como-elegir">Cómo elegir un sillón BKF</h2>
            <p>Estos son los puntos que conviene preguntar antes de comprar cualquier sillón BKF:</p>
            <ul className="guide-list">
              <li><strong>Estructura:</strong> si es de hierro macizo redondo o de tubo, y qué diámetro tiene.</li>
              <li><strong>Cuero:</strong> qué tipo de cuero es (vacuno, por ejemplo), cómo está curtido y qué espesor tiene.</li>
              <li><strong>Terminación:</strong> pintura epoxi, cromado u otro acabado, y cómo responde al uso.</li>
              <li><strong>Medidas:</strong> alto, ancho y profundidad, y si se pueden pedir a medida.</li>
              <li><strong>Uso:</strong> residencial o intensivo, como en un local gastronómico: cambia lo que se le exige a la estructura.</li>
              <li><strong>Garantía:</strong> qué cubre y por cuánto tiempo.</li>
            </ul>
            <p>
              Así lo fabrica Taller Kappa: estructura de hierro redondo macizo de 12 mm, cuero vacuno de primera selección curtido al vegetal,
              pintura epoxi anticorrosiva o cromado, 78 x 70 x 90 cm en la versión estándar (o a medida, sin costo adicional) y garantía de por vida
              en la estructura. Está todo en la <Link to="/sillon-bkf/">ficha técnica del Sillón BKF Premium</Link>.
            </p>

            <h2 id="donde-comprar">Dónde comprar un sillón BKF en Buenos Aires y Argentina</h2>
            <p>
              {BUSINESS.legalName} fabrica el <Link to="/sillon-bkf/">sillón BKF de hierro y cuero</Link>, en su taller de Villa Chacabuco, San Martín (provincia de
              Buenos Aires), y lo vende directo de fábrica. Se puede retirar en el taller (con coordinación previa) o recibir en todo el país: consultá las{' '}
              <Link to="/envios/">zonas y tiempos de envío</Link>. El pedido se cotiza por{' '}
              <a href={whatsappUrl('Hola, quiero cotizar un sillón BKF.')} target="_blank" rel="noopener noreferrer">WhatsApp</a>, según acabado, cantidad y destino.
            </p>

            <h3>Productos BKF de Taller Kappa</h3>
            <ProductTable products={productsInCategory('asientos')} showCategory={false} />
            <p>
              Del mismo diseño también fabricamos el <Link to="/catalogo/banco-bkf/">Banco BKF</Link>. Para locales gastronómicos hay{' '}
              <Link to="/catalogo/mesas/">bases de mesa de hierro</Link> y, si es para un negocio,{' '}
              <Link to="/mobiliario-comercial/">mobiliario comercial de hierro a medida</Link>.
            </p>

            <h2 id="preguntas">Preguntas frecuentes sobre el sillón BKF</h2>
            {FAQ.map(({ q, a }) => (
              <div key={q} className="bkf-faq-item">
                <h3>{q}</h3>
                <p>{a}</p>
              </div>
            ))}

            <p>Los cuidados de cada material y las condiciones están en <Link to="/garantia/">garantía y cuidados de los muebles de hierro y cuero</Link>.</p>

            <h2>Fuentes</h2>
            <p>Los datos históricos de esta guía se tomaron de:</p>
            <ul className="guide-list">
              {SOURCES.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
            </ul>
          </div>
        </section>
      </article>

      <section className="cta-section section-fade">
        <div className="cta-box">
          <h2>¿Querés un sillón BKF?</h2>
          <p>Escribinos por WhatsApp y te respondemos con la cotización.</p>
          <div className="cta-btns">
            <a href={whatsappUrl('Hola, quiero cotizar un sillón BKF.')} target="_blank" rel="noopener noreferrer" className="btn-main">Cotizar el sillón BKF</a>
            <Link to="/sillon-bkf/" className="btn-outline">Ver el Sillón BKF de Taller Kappa</Link>
          </div>
        </div>
      </section>
    </>
  );
}
