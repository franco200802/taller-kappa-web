import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { FireDB } from '../lib/firedb';

// Mensaje según el código de error de Firebase Auth: "clave incorrecta" solo cuando lo es.
const LOGIN_ERRORS = {
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/wrong-password': 'Email o contraseña incorrectos.',
  'auth/user-not-found': 'Email o contraseña incorrectos.',
  'auth/invalid-email': 'El email no es válido.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada.',
  'auth/too-many-requests': 'Demasiados intentos. Esperá unos minutos y volvé a probar.',
  'auth/network-request-failed': 'No hay conexión. Revisá internet y volvé a probar.',
};

const formatDate = (ts) => {
  const date = ts?.toDate?.();
  return date ? date.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : 'Sin fecha';
};

/**
 * Panel interno. Se carga solo con Firebase configurado (ver Admin.jsx).
 *
 * Quién es administrador lo deciden las reglas de Firestore (firestore.rules),
 * no este archivo: una cuenta que ingresa pero no es admin recibe
 * `permission-denied` al leer y se le avisa, sin mostrarle nada.
 */
export default function AdminPanel() {
  // undefined = todavía no se sabe si hay sesión (evita mostrar el login un instante a quien ya ingresó).
  const [user, setUser] = useState(undefined);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [contactos, setContactos] = useState([]);
  const [ordersCount, setOrdersCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataError, setDataError] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u ?? null)), []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setDataError('');
    try {
      setContactos(await FireDB.getContactos());
      // Los pedidos son una colección heredada; si falla no bloquea las consultas.
      FireDB.getOrders().then((o) => setOrdersCount(o.length)).catch(() => setOrdersCount(null));
    } catch (err) {
      setContactos([]);
      setDataError(err?.code === 'permission-denied'
        ? 'Esta cuenta no tiene permisos de administrador.'
        : 'No se pudieron cargar las consultas. Revisá la conexión y volvé a intentar.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (user) loadData(); }, [user, loadData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword('');
    } catch (err) {
      setLoginError(LOGIN_ERRORS[err?.code] ?? 'No se pudo ingresar. Volvé a intentar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setContactos([]);
    setOrdersCount(null);
    setDataError('');
  };

  const toggleLeido = async (c) => {
    setUpdating(c.id);
    try {
      await FireDB.setContactoLeido(c.id, !c.leido);
      setContactos((prev) => prev.map((x) => (x.id === c.id ? { ...x, leido: !c.leido } : x)));
    } catch {
      setDataError('No se pudo actualizar la consulta. Volvé a intentar.');
    } finally {
      setUpdating(null);
    }
  };

  if (user === undefined) return <p className="admin-status" role="status">Comprobando la sesión…</p>;

  if (!user) {
    return (
      <form onSubmit={handleLogin} className="admin-form">
        <div className="form-group">
          <label htmlFor="admin-email">Email</label>
          <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="admin-password">Contraseña</label>
          <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-main" disabled={submitting}>{submitting ? 'Ingresando…' : 'Ingresar'}</button>
        {loginError && <p role="alert" className="admin-error">{loginError}</p>}
      </form>
    );
  }

  const sinLeer = contactos.filter((c) => !c.leido).length;

  return (
    <>
      <div className="admin-bar">
        <p>Sesión: <strong>{user.email}</strong></p>
        <button type="button" className="btn-outline" onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <div className="admin-head">
        <h2>Consultas del formulario ({contactos.length}{sinLeer > 0 ? `, ${sinLeer} sin leer` : ''})</h2>
        <button type="button" className="btn-outline" onClick={loadData} disabled={loading}>{loading ? 'Actualizando…' : 'Actualizar'}</button>
      </div>
      {dataError && <p role="alert" className="admin-error">{dataError}</p>}
      {loading && contactos.length === 0 && <p className="admin-status" role="status">Cargando consultas…</p>}
      {!loading && !dataError && contactos.length === 0 && <p className="admin-status">Todavía no hay consultas guardadas.</p>}

      <ul className="admin-leads">
        {contactos.map((c) => (
          <li key={c.id} className={c.leido ? 'is-read' : undefined}>
            <div className="admin-lead-head">
              <strong>{c.name}</strong>
              <span>{formatDate(c.createdAt)}</span>
            </div>
            {c.interest && <p className="admin-lead-interest">Interés: {c.interest}</p>}
            <p className="admin-lead-message">{c.message}</p>
            <button type="button" className="btn-detail" onClick={() => toggleLeido(c)} disabled={updating === c.id}>
              {c.leido ? 'Marcar como no leída' : 'Marcar como leída'}
            </button>
          </li>
        ))}
      </ul>

      {ordersCount !== null && <p className="admin-status">Pedidos registrados: {ordersCount}</p>}
    </>
  );
}
