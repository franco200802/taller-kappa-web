import { useCallback, useEffect, useRef, useState } from 'react';
import { isFirebaseConfigured } from '../lib/firebaseConfig';
import Seo from '../components/Seo';

/**
 * /admin — panel interno (no se prerenderiza ni se indexa).
 *
 * - Mientras lib/firebaseConfig.js tenga credenciales de ejemplo, el panel lo DICE y no
 *   descarga el SDK ni muestra un login: antes aparecía el formulario y cualquier intento
 *   terminaba en "Usuario o contraseña incorrectos", que era falso (no había proyecto).
 * - El SDK (firebase/auth + firestore, ~105 kB gzip) se importa recién acá, de forma dinámica.
 * - Los errores de login distinguen credenciales incorrectas de red, bloqueo o configuración.
 * - Con sesión iniciada muestra las consultas del formulario de contacto (colección
 *   `contactos`) y permite marcarlas como leídas. Las reglas (firestore.rules) solo dejan
 *   leerlas a la cuenta administradora con el email verificado.
 *
 * Pasos para ponerlo en marcha: docs/firebase-puesta-en-marcha.md.
 */

const LOGIN_ERRORS = {
  'auth/invalid-credential': 'Usuario o contraseña incorrectos.',
  'auth/wrong-password': 'Usuario o contraseña incorrectos.',
  'auth/user-not-found': 'Usuario o contraseña incorrectos.',
  'auth/invalid-email': 'El email no tiene un formato válido.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada.',
  'auth/too-many-requests': 'Demasiados intentos. Esperá unos minutos y volvé a probar.',
  'auth/network-request-failed': 'No hay conexión con Firebase. Revisá tu conexión a internet.',
  'auth/operation-not-allowed': 'El acceso con email y contraseña no está habilitado en el proyecto de Firebase.',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'La clave de Firebase (apiKey) no es válida. Revisá lib/firebaseConfig.js.',
};

const loginError = (err) => LOGIN_ERRORS[err?.code] ?? `No se pudo iniciar sesión (${err?.code ?? 'error desconocido'}).`;

const dataError = (err) => (err?.code === 'permission-denied'
  ? 'Esta cuenta no tiene permiso para leer las consultas. Tiene que ser la cuenta administradora y tener el email verificado.'
  : `No se pudieron cargar las consultas (${err?.code ?? 'error desconocido'}).`);

const formatDate = (ts) => {
  const date = ts?.toDate?.();
  return date ? date.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : 'Sin fecha';
};

const SEO = <Seo title="Admin | Taller Kappa" description="Panel de administración interno." path="/admin" noindex />;

function NotConfigured() {
  return (
    <section className="section-padding admin-panel" translate="no">
      {SEO}
      <h1>Panel de administración</h1>
      <p className="admin-notice" role="status">
        <strong>Firebase todavía no está configurado.</strong> El panel no puede iniciar sesión ni leer consultas hasta que
        se carguen las credenciales del proyecto en <code>react-app/src/lib/firebaseConfig.js</code>.
      </p>
      <p>
        Mientras tanto el sitio público funciona igual: los productos salen del código y las consultas llegan por WhatsApp.
        Lo único que no se guarda es la copia de cada mensaje del formulario de contacto.
      </p>
      <p>Los pasos están en <code>docs/firebase-puesta-en-marcha.md</code>.</p>
    </section>
  );
}

function LoginForm({ sdk }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (busy || !sdk.current) return; // evita el doble envío
    setError('');
    setBusy(true);
    try { await sdk.current.authApi.signInWithEmailAndPassword(sdk.current.auth, email.trim(), password); }
    catch (err) { setError(loginError(err)); }
    finally { setBusy(false); }
  };

  return (
    <section className="section-padding admin-panel" translate="no">
      {SEO}
      <h1>Panel de administración</h1>
      <form onSubmit={handleLogin} className="admin-form">
        <label htmlFor="admin-email">Email</label>
        <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="admin-password">Contraseña</label>
        <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn-main" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</button>
        {error && <p role="alert" className="admin-error">{error}</p>}
      </form>
    </section>
  );
}

function ContactList({ contactos, onRead }) {
  return (
    <ul className="admin-list">
      {contactos.map((c) => (
        <li key={c.id} className={c.leido ? 'is-read' : undefined}>
          <p className="admin-list-meta">
            <strong>{c.name}</strong> · {formatDate(c.createdAt)}
            {c.interest ? ` · ${c.interest}` : ''}{c.zone ? ` · ${c.zone}` : ''}
          </p>
          <p>{c.message}</p>
          {!c.leido && <button className="btn-detail" onClick={() => onRead(c.id)}>Marcar como leída</button>}
        </li>
      ))}
    </ul>
  );
}

export default function Admin() {
  // null = todavía no se sabe (se está cargando el SDK o resolviendo la sesión); false = sin sesión.
  const [user, setUser] = useState(null);
  const [sdkError, setSdkError] = useState('');
  const [contactos, setContactos] = useState(null);
  const [loadError, setLoadError] = useState('');
  const sdk = useRef(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;
    let unsubscribe;
    let cancelled = false;
    Promise.all([import('firebase/auth'), import('../lib/firebase'), import('../lib/firedb')])
      .then(([authApi, { auth }, { FireDB }]) => {
        if (cancelled) return;
        sdk.current = { authApi, auth, FireDB };
        unsubscribe = authApi.onAuthStateChanged(auth, (u) => setUser(u ?? false));
      })
      .catch(() => { if (!cancelled) setSdkError('No se pudo cargar Firebase. Revisá tu conexión y recargá la página.'); });
    return () => { cancelled = true; unsubscribe?.(); };
  }, []);

  const loadContactos = useCallback(() => {
    setLoadError('');
    sdk.current.FireDB.getContactos()
      .then(setContactos)
      .catch((err) => { setContactos([]); setLoadError(dataError(err)); });
  }, []);

  useEffect(() => { if (user) loadContactos(); else setContactos(null); }, [user, loadContactos]);

  const markRead = async (id) => {
    try {
      await sdk.current.FireDB.markContactoLeido(id);
      setContactos((list) => list.map((c) => (c.id === id ? { ...c, leido: true } : c)));
    } catch (err) { setLoadError(`No se pudo marcar como leída (${err?.code ?? 'error'}).`); }
  };

  if (!isFirebaseConfigured) return <NotConfigured />;

  if (sdkError || user === null) {
    return (
      <section className="section-padding admin-panel" translate="no">
        {SEO}
        <h1>Panel de administración</h1>
        <p role="status">{sdkError || 'Cargando…'}</p>
      </section>
    );
  }

  if (!user) return <LoginForm sdk={sdk} />;

  const unread = contactos?.filter((c) => !c.leido).length ?? 0;

  return (
    <section className="section-padding admin-panel admin-panel--wide" translate="no">
      {SEO}
      <div className="section-head">
        <h1>Panel de administración</h1>
        <button className="btn-outline" onClick={() => sdk.current.authApi.signOut(sdk.current.auth)}>Cerrar sesión</button>
      </div>
      <p>Sesión: {user.email}{user.emailVerified ? '' : ' (email sin verificar: las reglas no dejan leer datos hasta verificarlo)'}</p>

      <h2>Consultas del formulario{contactos ? ` (${contactos.length}, ${unread} sin leer)` : ''}</h2>
      {loadError && <p role="alert" className="admin-error">{loadError}</p>}
      {contactos === null && <p role="status">Cargando consultas…</p>}
      {contactos?.length === 0 && !loadError && <p>Todavía no hay consultas guardadas.</p>}
      {contactos?.length > 0 && <ContactList contactos={contactos} onRead={markRead} />}
    </section>
  );
}
