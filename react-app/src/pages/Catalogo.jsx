import { useEffect, useState } from 'react';
import Icon from '../components/Icon';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Picture from '../components/Picture';
import Modal from '../components/Modal';
import ProductTable from '../components/ProductTable';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { whatsappUrl } from '../data/contact';
import { loadFireDB } from '../lib/firebaseConfig';
import { itemListNode } from '../lib/schema';

const FALLBACK_PRODUCTS = PRODUCTS;

const COLORS = [
  { name: 'Negro Mate', swatch: '#1a1a1a' },
  { name: 'Blanco Crema', swatch: '#f5f0e8' },
  { name: 'Cromado', swatch: 'linear-gradient(135deg,#ccc,#fff,#aaa)' },
  { name: 'Verde Oliva', swatch: '#556b2f' },
  { name: 'Rojo Kappa', swatch: '#b71c1c' },
];

const MATERIALS = [
  { color: '#1a1a1a', title: 'Hierro macizo', desc: 'Varilla redonda de 12 mm, sin costuras ni rellenos. Indeformable ante el uso intensivo.' },
  { color: '#9a5a2c', title: 'Cuero vacuno', desc: 'Cuero de primera selección, curtido al vegetal. Toma color con el uso.' },
  { color: '#b71c1c', title: 'Pintura epoxi', desc: 'Tratamiento anticorrosivo de doble capa. Resiste humedad, rayones y rayos UV.' },
  { color: 'linear-gradient(135deg,#ccc,#fff,#aaa)', title: 'Cromado', desc: 'Acabado espejado de nivel industrial. Resistente a la corrosión y fácil de limpiar.' },
];

function ProductCard({ p, onOpen }) {
  const { addToCart } = useCart();
  // Los productos de Firebase (cargados vía FireDB.getProducts en el admin)
  // no tienen garantizado un `slug` propio como los de data/products.js.
  // Sin esta guarda, un producto sin slug generaría un link roto real
  // a /catalogo/undefined en vez de simplemente no enlazar a un detalle.
  const detailHref = p.slug ? `/catalogo/${p.slug}/` : null;
  return (
    <article className="product-card" data-category={p.category}>
      {p.badge && <div className="product-badge">{p.badge}</div>}
      <div className={`stock-indicator ${p.stock ? 'in-stock' : 'no-stock'}`}>
        <span className="stock-dot-small" /> {p.stock ? 'En stock' : 'Consultar'}
      </div>
      <div className="card-img-wrapper" role="button" tabIndex={0} aria-label={`Ver detalle de ${p.name}`}
        onClick={() => onOpen(p)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(p); } }}>
        <Picture src={p.image} alt={p.alt ?? p.name} loading="lazy" width={p.imageWidth} height={p.imageHeight} sizes="(max-width: 700px) calc(100vw - 32px), (max-width: 1100px) 50vw, 384px" />
        <div className="card-overlay" aria-hidden="true">Vista rápida</div>
      </div>
      <div className="card-info">
        <h3>{detailHref ? <Link to={detailHref}>{p.name}</Link> : p.name}</h3>
        <p className="card-specs-preview">{p.specs?.[0] || ''}</p>
        <a className="card-consult" target="_blank" rel="noopener noreferrer"
          href={whatsappUrl('Hola! Quisiera consultar el precio de: ' + p.name)}>
          <Icon name="whatsapp" /> Consultar precio
        </a>
        <div className="card-actions">
          {detailHref && <Link to={detailHref} className="btn-detail" aria-label={`Ver ficha de ${p.name}`}>Ver ficha</Link>}
          <button className="btn-add-cart" onClick={() => addToCart(p, 'Negro Mate')}><Icon name="plus" /> Agregar al presupuesto</button>
        </div>
      </div>
    </article>
  );
}

export default function Catalogo() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [filter, setFilter] = useState('all');
  // El producto queda cargado al cerrar el modal: así el contenido no
  // desaparece mientras corre la animación de salida.
  const [modalProduct, setModalProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalColor, setModalColor] = useState('Negro Mate');

  useEffect(() => {
    let cancelled = false;
    // loadFireDB solo descarga el chunk de Firebase (~105kB gzip) si hay
    // credenciales reales; si no, se queda con los productos locales.
    loadFireDB().then((db) => db.getProducts())
      .then((data) => { if (!cancelled && data.length) setProducts(data); })
      .catch(() => { /* se queda con el fallback */ });
    return () => { cancelled = true; };
  }, []);

  const openModal = (p) => {
    setModalColor('Negro Mate');
    setModalProduct(p);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

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
        title="Catálogo de Sillas de Hierro y Cuero | Taller Kappa Buenos Aires"
        description="Catálogo de sillones BKF, bancos y bases de mesa de hierro macizo y cuero vacuno. Fabricación propia en San Martín, Buenos Aires."
        path="/catalogo"
        pageType="CollectionPage"
        mainEntity={itemList['@id']}
        breadcrumb={[{ name: 'Inicio', path: '/' }, { name: 'Catálogo', path: '/catalogo' }]}
        jsonLd={itemList}
      />
      <section id="catalogo" className="section-padding">
        <h1 className="section-title">Sillas de hierro y cuero en Buenos Aires</h1>
        <p className="section-subtitle">
          Catálogo de sillones BKF, bancos y bases de mesa fabricados en hierro macizo y cuero vacuno.
          Conocé en detalle nuestro producto insignia: el <Link to="/sillon-bkf/">Sillón BKF</Link>.
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
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal} aria-label="Cerrar modal">×</button>
            <div className="modal-img">
              <Picture src={modalProduct.image} alt={modalProduct.alt ?? modalProduct.name} loading="lazy" width={modalProduct.imageWidth} height={modalProduct.imageHeight} sizes="(max-width: 760px) 100vw, 480px" />
            </div>
            <div className="modal-info">
              <div className="modal-badge-row">
                {modalProduct.badge && <span className="modal-badge">{modalProduct.badge}</span>}
              </div>
              <h2>{modalProduct.name}</h2>
              <div className="modal-stock"><span className="stock-dot" /> {modalProduct.stock ? 'En stock, entrega coordinada' : 'Consultar disponibilidad'}</div>
              <p>{modalProduct.desc}</p>
              <ul className="modal-specs">
                {modalProduct.specs?.map((s) => <li key={s}><Icon name="check" /> {s}</li>)}
              </ul>
              <div className="color-selector">
                <p className="color-label">Acabado: <strong>{modalColor}</strong></p>
                <div className="color-options">
                  {COLORS.map((c) => (
                    <button key={c.name} className={`color-swatch ${modalColor === c.name ? 'active' : ''}`}
                      style={{ background: c.swatch }} aria-label={c.name} aria-pressed={modalColor === c.name} title={c.name}
                      onClick={() => setModalColor(c.name)} />
                  ))}
                </div>
              </div>
              <button className="btn-main" onClick={() => { addToCart(modalProduct, modalColor); closeModal(); }}>
                <Icon name="plus" /> Agregar al presupuesto
              </button>
              <p className="modal-hint"><Icon name="whatsapp" /> Te pasamos el precio por WhatsApp</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
