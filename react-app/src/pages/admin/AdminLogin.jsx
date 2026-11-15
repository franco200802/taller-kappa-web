import { useState } from 'react';
import { authError } from './authErrors';

/** Formulario de acceso. `sdk` = { authApi, auth } ya cargados por Admin.jsx. */
export default function AdminLogin({ sdk }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  const run = async (action) => {
    if (busy) return; // evita el doble envío
    setError(''); setInfo(''); setBusy(true);
    try { await action(); }
    catch (err) { setError(authError(err)); }
    finally { setBusy(false); }
  };

  const login = (e) => {
    e.preventDefault();
    run(async () => {
      // La sesión dura lo que dura la pestaña: en una computadora compartida no queda abierta.
      await sdk.authApi.setPersistence(sdk.auth, sdk.authApi.browserSessionPersistence);
      await sdk.authApi.signInWithEmailAndPassword(sdk.auth, email.trim(), password);
    });
  };

  const reset = () => run(async () => {
    await sdk.authApi.sendPasswordResetEmail(sdk.auth, email.trim());
    // Mismo mensaje exista o no la cuenta: no se revela qué emails están registrados.
    setInfo('Si ese email tiene una cuenta, te llegó un mensaje para cambiar la contraseña.');
  });

  return (
    <form onSubmit={login} className="admin-form">
      <label htmlFor="admin-email">Email</label>
      <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label htmlFor="admin-password">Contraseña</label>
      <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit" className="btn-main" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</button>
      <button type="button" className="admin-link" disabled={busy} onClick={reset}>Olvidé la contraseña</button>
      {error && <p role="alert" className="admin-error">{error}</p>}
      {info && <p role="status">{info}</p>}
    </form>
  );
}
