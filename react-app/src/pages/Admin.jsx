import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { FireDB } from '../lib/firedb';
import Seo from '../components/Seo';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (user) FireDB.getOrders().then(setOrders).catch(console.error);
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch { setError('Usuario o contraseña incorrectos'); }
  };

  if (!user) {
    return (
      <section className="section-padding" style={{ maxWidth: 536, margin: '0 auto' }}>
        <Seo title="Admin | Taller Kappa" description="Panel de administración interno." path="/admin" noindex />
        <h1>Panel de administración</h1>
        <form onSubmit={handleLogin} className="admin-form">
          <input type="email" placeholder="Email" aria-label="Email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" aria-label="Contraseña" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn-main">Ingresar</button>
          {error && <p role="alert" style={{ color: 'var(--kappa)' }}>{error}</p>}
        </form>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <Seo title="Admin | Taller Kappa" description="Panel de administración interno." path="/admin" noindex />
      <h1>Panel de administración</h1>
      <button className="btn-outline" onClick={() => signOut(auth)}>Cerrar sesión</button>
      <h2>Pedidos ({orders.length})</h2>
      {/* TODO: migrar tabs Pedidos/Clientes/Stats de admin.html */}
    </section>
  );
}
