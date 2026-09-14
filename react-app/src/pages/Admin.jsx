import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { FireDB } from '../lib/firedb';

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
      <section className="section-padding" style={{ paddingTop: 60, maxWidth: 400, margin: '0 auto' }}>
        <h1>Panel de Administración</h1>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn-main">Ingresar</button>
          {error && <p style={{ color: '#e74c3c' }}>{error}</p>}
        </form>
      </section>
    );
  }

  return (
    <section className="section-padding" style={{ paddingTop: 60 }}>
      <h1>Panel de Administración</h1>
      <button onClick={() => signOut(auth)}>Cerrar sesión</button>
      <h2>Pedidos ({orders.length})</h2>
      {/* TODO: migrar tabs Pedidos/Clientes/Stats de admin.html */}
    </section>
  );
}
