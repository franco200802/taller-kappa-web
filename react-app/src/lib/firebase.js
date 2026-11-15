/**
 * Inicialización de Firebase (SDK modular). Solo lo importan lib/firedb.js y el panel /admin,
 * siempre de forma dinámica: ninguna página pública lo descarga al cargar.
 *
 * Firestore **Lite** (`firebase/firestore/lite`): el sitio solo hace lecturas y escrituras
 * puntuales por REST; no necesita escucha en tiempo real, caché offline ni el canal
 * WebChannel del SDK completo, que pesa varias veces más.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore/lite';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { firebaseConfig, useEmulators } from './firebaseConfig';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Solo en las pruebas automatizadas (ver firebaseConfig.js): puertos de firebase.json.
if (useEmulators) {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
}
