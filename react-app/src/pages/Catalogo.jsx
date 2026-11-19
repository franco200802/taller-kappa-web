import { useState } from 'react';
import Icon from '../components/Icon';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Picture from '../components/Picture';
import Modal from '../components/Modal';
import ProductTable from '../components/ProductTable';
import { OptionGroup, Product3DViewer } from '../components/Product3D';
import { BASE_FLAT_SLUG, CATEGORIES, FINISH_COLORS as COLORS, PRODUCTS, priceQuestion, productHref, productPath } from '../data/products';
import { PRODUCT_3D, canQuote, initialValues } from '../data/product3d';
import { whatsappUrl, whatsappUrlFor } from '../data/contact';
import { itemListNode } from '../lib/schema';
import { trackEvent } from '../lib/analytics';
import { loadProduct3d } from '../lib/loadProduct3d';

const MATERIALS = [
  { color: '#1a1a1a', title: 'Hierro macizo', desc: 'Varilla redonda de 12 mm, sin costuras ni rellenos. Indeformable ante el uso intensivo.' },
  { color: '#9a5a2c', title: 'Cuero vacuno', desc: 'Cuero de primera selección, curtido al vegetal. Toma color con el uso.' },
  { color: '#b71c1c', title: 'Pintura epoxi', desc: 'Tratamiento anticorrosivo de doble capa. Resiste humedad, rayones y rayos UV.' },
  { color: 'linear-gradient(135deg,#ccc,#fff,#aaa)', title: 'Cromado', desc: 'Acabado espejado de nivel industrial. Resistente a la corrosión y fácil de limpiar.' },
];

const track3d = (p) => trackEvent('view_3d', { item_name: p.name, location: 'catalogo_modal', page_path: '/catalogo/' });

/** Foto o modelo 3D de la vista rápida, con el selector arriba. El visor solo existe con el modal abierto. */
function QuickViewMedia({ product, view3d, onView, values, measures, open }) {
  return (
    <div className={`modal-img modal-media${view3d ? ' is-3d' : ''}`}>
      {view3d && open ? (
        <Product3DViewer slug={product.slug} values={values} measures={measures} />
      ) : (
        <Picture src={product.image} alt={product.alt ?? product.name} loading="lazy" width={product.imageWidth} height={product.imageHeight} sizes="(max-width: 760px) 100vw, 480px" />
      )}
      <div className="seg-group modal-media-switch" role="radiogroup" aria-label="Foto o modelo 3D">
        <button type="button" role="radio" aria-checked={!view3d} className={`seg-option${view3d ? '' : ' active'}`} onClick={() => onView(false)}>Foto</button>
        <button type="button" role="radio" aria-checked={view3d} className={`seg-option${view3d ? ' active' : ''}`} onClick={() => onView(true)}><Icon name="cube" /> 3D</button>
      </div>
    </div>
  );
}

/** Selector de acabado de los productos que no tienen 3D (hoy todos lo tienen; queda por si se suma uno). */
function FinishSelector({ value, onChange }) {
  return (
    <div className="color-selector">
      <p className="color-label">Acabado: <strong>{value}</strong></p>
      <div className="color-options">
        {COLORS.map((c) => (
          <button key={c.name} className={`color-swatch ${value === c.name ? 'active' : ''}`}
            style={{ background: c.swatch }} aria-label={c.name} aria-pressed={value === c.name} title={c.name}
            onClick={() => onChange(c.name)} />
        ))}
      </div>
    </div>
  );
}

/**
 * Vista rápida de un producto (modal del catálogo). Si el producto tiene 3D (data/product3d.js) arranca en 3D y sus
 * opciones (acabado, cuero, altura…) cambian el modelo en el momento, como en la ficha. Va con una `key` nueva en cada
 * apertura: siempre empieza en las opciones iniciales.
 */
function QuickView({ product, open, onClose, onAdd }) {
  const cfg = PRODUCT_3D[product.slug];
  const [values, setValues] = useState(() => (cfg ? initialValues(cfg) : {}));
  const [color, setColor] = useState('Negro Mate');
  const [view3d, setView3d] = useState(Boolean(cfg));
  const [measures, setMeasures] = useState(true);
  const quoteReady = !cfg || canQuote(cfg, values);
  const onView = (to3d) => {
    if (to3d && !view3d) track3d(product);
    setView3d(to3d);
  };
  return (
    <div className="modal-content">
      <button className="close-modal" onClick={onClose} aria-label="Cerrar modal">×</button>
      {cfg ? (
        <QuickViewMedia product={product} view3d={view3d} onView={onView} values={values} measures={measures} open={open} />
      ) : (
        <div className="modal-img">
          <Picture src={product.image} alt={product.alt ?? product.name} loading="lazy" width={product.imageWidth} height={product.imageHeight} sizes="(max-width: 760px) 100vw, 480px" />
        </div>
      )}
      <div className="modal-info">
        <div className="modal-badge-row">
          {product.badge && <span className="modal-badge">{product.badge}</span>}
        </div>
        <h2>{product.name}</h2>
        <div className="modal-stock"><span className="stock-dot" /> Consultar disponibilidad por WhatsApp</div>
        <p>{product.desc}</p>
        <ul className="modal-specs">
          {product.specs?.map((s) => <li key={s}><Icon name="check" /> {s}</li>)}
        </ul>
        {cfg ? cfg.options.map((o) => (
          <OptionGroup key={o.key} option={o} value={values[o.key]} onChange={(name) => setValues((v) => ({ ...v, [o.key]: name }))} />
        )) : <FinishSelector value={color} onChange={setColor} />}
        {cfg && view3d && (
          <label className="bkf3d-check">
            <input type="checkbox" checked={measures} onChange={(e) => setMeasures(e.target.checked)} /> Mostrar medidas
          </label>
        )}
        <button type="button" className="btn-main" disabled={!quoteReady} onClick={() => onAdd(cfg ? cfg.describe(values) : color)}>
          <Icon name="plus" /> {quoteReady ? 'Agregar al presupuesto' : 'Elegí la altura y el diámetro'}
        </button>
        <p className="modal-hint"><Icon name="whatsapp" /> Te pasamos el precio por WhatsApp</p>
      </div>
    </div>
  );
}

function ProductCard({ p, onOpen }) {
  const { addToCart } = useCart();
  // Los productos de Firebase (cargados vía FireDB.getProducts en el admin)
  // no tienen garantizado un `slug` propio como los de data/products.js.
  // Sin esta guarda, un producto sin slug generaría un link roto real
  // a /catalogo/undefined en vez de simplemente no enlazar a un detalle.
  const detailHref = p.slug ? productHref(p) : null;
  return (
    <article className="product-card" data-category={p.category} data-cta="catalogo_card" data-item={p.name}>
      <div className={`stock-indicator ${p.stock ? 'in-stock' : 'no-stock'}`}>
        <span className="stock-dot-small" /> Consultar disponibilidad
      </div>
      <div className="card-img-wrapper" role="button" tabIndex={0} aria-label={`Vista rápida: ${p.name}`}
        onClick={() => onOpen(p)}
        // La vista rápida abre en 3D: con el mouse encima ya se empieza a descargar three.js.
        onPointerEnter={PRODUCT_3D[p.slug] ? loadProduct3d : undefined}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(p); } }}>
        {/* El rótulo va dentro de la foto: suelto en la tarjeta quedaba encima de "Consultar disponibilidad". */}
        {p.badge && <span className="product-badge" aria-hidden="true">{p.badge}</span>}
        <Picture src={p.image} alt={p.alt ?? p.name} loading="lazy" width={p.imageWidth} height={p.imageHeight} sizes="(max-width: 700px) calc(100vw - 32px), (max-width: 1100px) 50vw, 384px" />
        <div className="card-overlay" aria-hidden="true">Vista rápida</div>
      </div>
      <div className="card-info">
        <h2 className="card-title">{detailHref ? <Link to={detailHref}>{p.name}</Link> : p.name}</h2>
        <p className="card-specs-preview">{p.specs?.[0] || ''}</p>
        <a className="card-consult" target="_blank" rel="noopener noreferrer"
          href={p.slug ? whatsappUrlFor(priceQuestion(p), productPath(p)) : whatsappUrl(priceQuestion(p))}>
          <Icon name="whatsapp" /> Consultar precio
        </a>
        <div className="card-actions">
          {detailHref && <Link to={detailHref} className="btn-detail" aria-label={`Ver ficha de ${p.name}`}>Ver ficha</Link>}
          {p.slug === BASE_FLAT_SLUG ? (
            <button type="button" className="btn-add-cart" aria-haspopup="dialog" onClick={() => onOpen(p)}>
              <Icon name="plus" /> Elegir medidas
            </button>
          ) : (
            <button className="btn-add-cart" onClick={() => addToCart(p, 'Negro Mate')}><Icon name="plus" /> Agregar al presupuesto</button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Catalogo() {
  const { addToCart } = useCart();
  // El catálogo sale de data/products.js, la misma fuente del HTML prerenderizado, el sitemap y el
  // JSON-LD. Antes, si Firestore tenía una colección `productos`, la página la descargaba al cargar y
  // reemplazaba lo que el visitante (y Google) ya habían recibido.
  const products = PRODUCTS;
  const [filter, setFilter] = useState('all');
  // El producto queda cargado al cerrar el modal: así el contenido no
  // desaparece mientras corre la animación de salida.
  const [modalProduct, setModalProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Cambia en cada apertura: la vista rápida vuelve a sus opciones iniciales aunque sea el mismo producto.
  const [modalKey, setModalKey] = useState(0);

  const openModal = (p) => {
    setModalProduct(p);
    setModalKey((k) => k + 1);
    setModalOpen(true);
    if (PRODUCT_3D[p.slug]) track3d(p);
  };
  const closeModal = () => setModalOpen(false);
  const addModalProduct = (variant) => {
    addToCart(modalProduct, variant);
    closeModal();
  };

  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);
  const FILTERS = [
    { key: 'all', label: 'Todos', icon: 'fa-border-all' },
    { key: 'asientos', label: 'Asientos', icon: 'fa-chair' },
    { key: 'mesas', label: 'Mesas', icon: 'fa-table' },
  ];

  const itemList = itemListNode(products, '/catalogo', 'Catálogo de Taller Kappa');

  return (
    <>
      <Seo
        title="Muebles de Hierro y Cuero en Buenos Aires | Catálogo | Taller Kappa"
        description="Catálogo de muebles de hierro y cuero hechos en San Martín, Buenos Aires: sillón BKF, banco BKF y bases de mesa. Directo de fábrica, con presupuesto por WhatsApp."
        path="/catalogo"
        pageType="CollectionPage"
        mainEntity={itemList['@id']}
        breadcrumb={[{ name: 'Inicio', path: '/' }, { name: 'Catálogo', path: '/catalogo' }]}
        jsonLd={itemList}
      />
      <section id="catalogo" className="section-padding">
        <h1 className="section-title">Muebles de hierro y cuero en Buenos Aires: sillones, bancos y bases de mesa</h1>
        <p className="section-subtitle">
          Catálogo de sillones BKF, bancos y bases de mesa fabricados en hierro macizo y cuero vacuno.
          Conocé en detalle nuestro producto insignia, el <Link to="/sillon-bkf/">sillón BKF</Link>, o leé <Link to="/bkf/">qué es el sillón BKF</Link>.
        </p>
        <p className="quote-note">
          En Taller Kappa no se compra online: agregá los productos al presupuesto y te lo respondemos por WhatsApp, con precio y plazo de entrega.
        </p>
        <p className="catalog-categories">
          Categorías:{' '}
          {CATEGORIES.map((c, i) => (
            <span key={c.key}>{i > 0 && ' · '}<Link to={`/catalogo/${c.slug}/`}>{c.heading}</Link></span>
          ))}
        </p>

        <div className="filters" role="group" aria-label="Filtrar productos">
          {FILTERS.map((f) => (
            <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
              <Icon name={f.icon} /> {f.label}
            </button>
          ))}
        </div>

        <div className="products-grid" aria-live="polite">
          {filtered.map((p) => <ProductCard key={p.id} p={p} onOpen={openModal} />)}
        </div>
      </section>

      <section className="why-section section-fade" aria-label="Comparación de productos">
        <h2 className="section-title">Comparación de productos</h2>
        <p className="section-subtitle">Estructura, medidas y uso de cada producto del catálogo de Taller Kappa.</p>
        <ProductTable products={PRODUCTS} />
      </section>

      <section className="materials-section section-fade" aria-label="Nuestros materiales">
        <h2 className="section-title">Calidad que se ve y se toca</h2>
        <p className="section-subtitle">Cada pieza fabricada con materiales seleccionados y controles de calidad propios.</p>
        <div className="materials-layout">
          <Picture
            src="/images/base-mesa-flat-hierro.jpg"
            alt={PRODUCTS[2].alt}
            loading="lazy"
            width={1024}
            height={1536}
            className="materials-scroll-img"
            sizes="(max-width: 860px) calc(100vw - 32px), 45vw"
          />
          <div className="materials-grid">
            {MATERIALS.map((m) => (
              <div className="material-card" key={m.title}>
                <h3><span className="material-swatch" style={{ background: m.color }} aria-hidden="true" />{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <p style={{ marginTop: 32 }}>
          ¿Tenés dudas sobre precios o medidas? <Link to="/contacto/">Contactanos</Link> o mirá las{' '}
          <Link to="/faq/">preguntas frecuentes</Link>.
        </p>
      </section>

      <Modal className="modal" label={modalProduct ? modalProduct.name : 'Detalle del producto'} open={modalOpen} onClose={closeModal}>
        {modalProduct && (
          <QuickView key={modalKey} product={modalProduct} open={modalOpen} onClose={closeModal} onAdd={addModalProduct} />
        )}
      </Modal>
    </>
  );
}
