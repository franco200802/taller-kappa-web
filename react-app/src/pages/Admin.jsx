import { lazy, Suspense } from 'react';
import Seo from '../components/Seo';
import { isFirebaseConfigured } from '../lib/firebaseConfig';

// El panel real (y con él el SDK de Firebase, ~105 kB gzip) se descarga solo si
// hay credenciales reales. Con las de ejemplo, antes se inicializaba Firebase
// contra un proyecto inexistente y cualquier intento de ingreso terminaba en
// "Usuario o contraseña incorrectos", que es falso: el problema no es la clave.
const AdminPanel = lazy(() => import('./AdminPanel'));

export default function Admin() {
  return (
    <section className="section-padding admin">
      <Seo title="Admin | Taller Kappa" description="Panel de administración interno." path="/admin" noindex />
      <h1>Panel de administración</h1>
      {isFirebaseConfigured ? (
        <Suspense fallback={<p className="admin-status" role="status">Cargando el panel…</p>}>
          <AdminPanel />
        </Suspense>
      ) : (
        <div className="admin-notice" role="status">
          <p><strong>El panel todavía no está conectado.</strong></p>
          <p>
            Falta cargar las credenciales del proyecto de Firebase en <code>src/lib/firebaseConfig.js</code> y
            publicar <code>firestore.rules</code>. Hasta entonces no se puede ingresar y las consultas del
            formulario de contacto no se guardan (llegan solo por WhatsApp).
          </p>
        </div>
      )}
    </section>
  );
}
