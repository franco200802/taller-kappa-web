import { useCallback, useEffect, useRef, useState } from 'react';
import { firebaseConfig, isFirebaseConfigured, useEmulators } from '../lib/firebaseConfig';
import { COLLECTIONS } from '../lib/leads';
import Seo from '../components/Seo';
import AdminLogin from './admin/AdminLogin';
import { authError } from './admin/authErrors';
import AdminLeads from './admin/AdminLeads';
import AdminProducts from './admin/AdminProducts';

/**
 * /admin — panel interno (no se prerenderiza ni se indexa; robots.txt lo excluye).
 *
 * - Sin credenciales de Firebase lo DICE y no descarga el SDK ni muestra un login.
 * - El SDK (auth + Firestore Lite) se importa recién acá, de forma dinámica.
 * - Con sesión: consultas del formulario y presupuestos enviados (búsqueda, estados, nota
 *   interna, detalle, borrado, exportación) y la lista de productos en solo lectura.
 * - La seguridad NO depende de este código: la deciden las reglas (firestore.rules), que
 *   solo dejan leer a la cuenta administradora con el email verificado. Si alguien llega a
 *   esta pantalla con otra cuenta, las listas responden "sin permiso".
 *
 * Puesta en marcha: docs/firebase-puesta-en-marcha.md. Pruebas: tests/e2e/admin.e2e.mjs.
 */

const kindLabel = { particular: 'Particular', empresa: 'Local o empresa' };

const VIEWS = [
  {
    key: 'consultas', tab: 'Consultas', collection: COLLECTIONS.contactos,
    noun: 'consultas', singular: 'la consulta',
    searchHint: 'Nombre, zona o texto del mensaje',
    empty: 'Todavía no llegó ninguna consulta por el formulario de contacto.',
    title: (i) => i.name || 'Sin nombre',
    snippet: (i) => [i.interest, i.message].filter(Boolean).join(' · '),
    fields: [
      { label: 'Nombre', value: (i) => i.name },
      { label: 'Le interesa', value: (i) => i.interest },
      { label: 'Zona de entrega', value: (i) => i.zone },
      { label: 'Mensaje', value: (i) => i.message, long: true },
    ],
  },
  {
    key: 'presupuestos', tab: 'Presupuestos', collection: COLLECTIONS.presupuestos,
    noun: 'presupuestos', singular: 'el presupuesto',
    searchHint: 'Nombre, zona o producto',
    empty: 'Todavía no se envió ningún presupuesto desde el sitio.',
    title: (i) => i.name || 'Sin nombre',
    snippet: (i) => `${i.totalQty} ${i.totalQty === 1 ? 'unidad' : 'unidades'} · ${String(i.detalle ?? '').replace(/\n/g, ' · ')}`,
    fields: [
      { label: 'Nombre', value: (i) => i.name },
      { label: 'Es para', value: (i) => kindLabel[i.kind] ?? '' },
      { label: 'Zona de entrega', value: (i) => i.zone },
      { label: 'Unidades', value: (i) => String(i.totalQty ?? '') },
      { label: 'Pedido', value: (i) => i.detalle, long: true },
    ],
  },
];

const SEO = <Seo title="Admin | Taller Kappa" description="Panel de administración interno." path="/admin" noindex />;

function Shell({ wide, children }) {
  return (
    <section className={`section-padding admin-panel${wide ? ' admin-panel--wide' : ''}`} translate="no">
      {SEO}
      {children}
    </section>
  );
}

function NotConfigured() {
  return (
    <Shell>
      <h1>Panel de administración</h1>
      <p className="admin-notice" role="status">
        <strong>Firebase todavía no está configurado.</strong> El panel no puede iniciar sesión ni leer consultas hasta que
        se carguen los datos del proyecto (variables <code>VITE_FIREBASE_*</code>).
      </p>
      <p>
        Mientras tanto el sitio público funciona igual: los productos salen del código y las consultas llegan por WhatsApp.
        Lo único que no se guarda es la copia de los mensajes del formulario y de los presupuestos.
      </p>
      <p>Los pasos están en <code>docs/firebase-puesta-en-marcha.md</code>.</p>
    </Shell>
  );
}

/** Aviso mientras la cuenta no verificó el email: las reglas no la dejan leer nada. */
function VerifyEmail({ sdk, user, onVerified }) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const run = async (action) => {
    if (busy) return;
    setBusy(true); setMessage('');
    try { await action(); }
    catch (err) { setMessage(authError(err)); }
    finally { setBusy(false); }
  };
  const send = () => run(async () => {
    await sdk.authApi.sendEmailVerification(user);
    setMessage(`Te enviamos un email a ${user.email}. Abrí el enlace y después tocá "Ya lo verifiqué".`);
  });
  const recheck = () => run(async () => {
    await user.reload();
    if (!user.emailVerified) { setMessage('El email todavía figura sin verificar.'); return; }
    await user.getIdToken(true); // las reglas leen email_verified del token: hay que renovarlo
    onVerified();
  });

  return (
    <div className="admin-notice" role="status">
      <p><strong>Falta verificar el email de esta cuenta.</strong> Hasta entonces las reglas de seguridad no dejan leer las consultas.</p>
      <div className="admin-dialog-actions">
        <button type="button" className="btn-main" disabled={busy} onClick={send}>Enviar email de verificación</button>
        <button type="button" className="btn-outline" disabled={busy} onClick={recheck}>Ya lo verifiqué</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

export default function Admin() {
  // null = todavía no se sabe (se está cargando el SDK o resolviendo la sesión); false = sin sesión.
  const [user, setUser] = useState(null);
  const [verified, setVerified] = useState(false);
  const [sdkError, setSdkError] = useState('');
  const [tab, setTab] = useState(VIEWS[0].key);
  const [news, setNews] = useState({});
  const sdk = useRef(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;
    let unsubscribe;
    let cancelled = false;
    Promise.all([import('firebase/auth'), import('../lib/firebase'), import('../lib/firedb')])
      .then(([authApi, { auth }, { FireDB }]) => {
        if (cancelled) return;
        sdk.current = { authApi, auth, db: FireDB };
        unsubscribe = authApi.onAuthStateChanged(auth, (u) => { setUser(u ?? false); setVerified(!!u?.emailVerified); });
      })
      .catch(() => { if (!cancelled) setSdkError('No se pudo cargar Firebase. Revisá tu conexión y recargá la página.'); });
    return () => { cancelled = true; unsubscribe?.(); };
  }, []);

  const onCount = useCallback((key, count) => setNews((prev) => (prev[key] === count ? prev : { ...prev, [key]: count })), []);

  if (!isFirebaseConfigured) return <NotConfigured />;

  if (sdkError || user === null) {
    return <Shell><h1>Panel de administración</h1><p role="status">{sdkError || 'Cargando…'}</p></Shell>;
  }

  if (!user) {
    return <Shell><h1>Panel de administración</h1><AdminLogin sdk={sdk.current} /></Shell>;
  }

  const tabs = [...VIEWS.map((v) => ({ key: v.key, label: v.tab, badge: news[v.key] })), { key: 'productos', label: 'Productos' }];

  return (
    <Shell wide>
      <div className="section-head admin-head">
        <div>
          <h1>Panel de administración</h1>
          <p className="admin-session">
            {user.email} · proyecto {firebaseConfig.projectId}{useEmulators ? ' (emulador de pruebas)' : ''}
          </p>
        </div>
        <button type="button" className="btn-outline" onClick={() => sdk.current.authApi.signOut(sdk.current.auth)}>Cerrar sesión</button>
      </div>

      {!verified && <VerifyEmail sdk={sdk.current} user={user} onVerified={() => setVerified(true)} />}

      <div className="admin-tabs" role="tablist" aria-label="Secciones del panel">
        {tabs.map((t) => (
          <button key={t.key} type="button" role="tab" id={`tab-${t.key}`} aria-selected={tab === t.key} aria-controls="admin-tabpanel"
            className={`admin-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}{t.badge > 0 && <span className="admin-badge" aria-label={`${t.badge} sin atender`}>{t.badge}</span>}
          </button>
        ))}
      </div>

      <div id="admin-tabpanel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {/* Las dos listas quedan montadas (la que no se ve, oculta): así las pestañas muestran cuántas hay
            sin atender desde el principio y cada una conserva su búsqueda. Sin email verificado no se pide nada. */}
        {verified && VIEWS.map((v) => (
          <div key={v.key} hidden={tab !== v.key}>
            <AdminLeads view={v} db={sdk.current.db} onCount={onCount} />
          </div>
        ))}
        {tab === 'productos' && <AdminProducts />}
      </div>
    </Shell>
  );
}
