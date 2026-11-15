/**
 * Configuración de Firebase + guarda para no cargarlo mientras no exista.
 *
 * Este módulo NO importa el SDK: es liviano a propósito, para que las páginas puedan
 * preguntar si Firebase está configurado sin descargar el chunk de Firebase.
 *
 * De dónde salen los valores (ver docs/firebase-puesta-en-marcha.md):
 *   - Variables VITE_FIREBASE_* leídas al compilar: en local, de `react-app/.env.local`
 *     (plantilla en `.env.example`); en el deploy, de las *variables* del repositorio de
 *     GitHub (Settings → Secrets and variables → Actions → Variables).
 *   - Si no están, quedan los valores de ejemplo y todo el sitio se comporta como
 *     "Firebase sin configurar": nada intenta conectarse.
 *
 * Estos valores NO son secretos: viajan en el JavaScript público y solo identifican al
 * proyecto. Lo que protege los datos son las reglas (firestore.rules), la restricción de
 * la clave por dominio y el registro de usuarios cerrado. Lo que nunca va acá ni al
 * repositorio es una clave de cuenta de servicio.
 */
const env = import.meta.env ?? {};

/**
 * Modo emulador: solo para las pruebas automatizadas (`npm run test:e2e`). Usa un proyecto
 * "demo-" (Firebase garantiza que esos ids nunca tocan servicios reales) y lib/firebase.js
 * conecta Auth y Firestore a los emuladores locales. El deploy nunca define esta variable.
 */
export const useEmulators = env.VITE_FIREBASE_EMULATOR === '1';

const fromEnv = (name, placeholder) => {
  const value = env[name];
  return typeof value === 'string' && value.trim() ? value.trim() : placeholder;
};

export const firebaseConfig = useEmulators
  ? { apiKey: 'demo-key', authDomain: 'demo-taller-kappa.firebaseapp.com', projectId: 'demo-taller-kappa', appId: 'demo-app' }
  : {
      apiKey: fromEnv('VITE_FIREBASE_API_KEY', 'REEMPLAZAR_CON_TU_API_KEY'),
      authDomain: fromEnv('VITE_FIREBASE_AUTH_DOMAIN', 'REEMPLAZAR.firebaseapp.com'),
      projectId: fromEnv('VITE_FIREBASE_PROJECT_ID', 'REEMPLAZAR'),
      storageBucket: fromEnv('VITE_FIREBASE_STORAGE_BUCKET', 'REEMPLAZAR.appspot.com'),
      messagingSenderId: fromEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', 'REEMPLAZAR'),
      appId: fromEnv('VITE_FIREBASE_APP_ID', 'REEMPLAZAR'),
    };

/** Hace falta, como mínimo, la clave, el proyecto y la app: con uno solo no se conecta a nada. */
export const isFirebaseConfigured = ['apiKey', 'projectId', 'appId'].every((key) => !firebaseConfig[key].startsWith('REEMPLAZAR'));

/**
 * Carga la capa de Firestore bajo demanda. Sin configurar, rechaza sin descargar nada.
 * La usan el formulario de contacto y el presupuesto para guardar una copia del pedido
 * DESPUÉS de abrir WhatsApp; ninguna página pública lee de Firestore.
 */
export function loadFireDB() {
  if (!isFirebaseConfigured) return Promise.reject(new Error('firebase_sin_configurar'));
  return import('./firedb').then((m) => m.FireDB);
}
