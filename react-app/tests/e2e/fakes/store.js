/**
 * Backend SIMULADO para `npm run test:e2e:mock` (sin Java ni emuladores).
 *
 * Guarda usuarios y documentos en localStorage y la sesión en sessionStorage. Sirve para
 * probar el comportamiento del panel y de los formularios en un navegador real; NO prueba
 * las reglas de Firestore ni el SDK de Firebase: los permisos de acá abajo son una copia
 * a mano de firestore.rules. Lo que valida la seguridad de verdad es `npm run test:rules`
 * y `npm run test:e2e`, que usan los emuladores oficiales.
 *
 * Este archivo solo entra en el build de prueba (tests/e2e/vite.mock.config.js).
 */
export const ADMIN_EMAIL = 'ing.franciscomarotta@gmail.com';

const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const users = {
  all: () => read('fake-fb-users', []),
  save: (list) => write('fake-fb-users', list),
  find: (email) => users.all().find((u) => u.email === email),
};

export const docs = {
  all: () => read('fake-fb-docs', {}),
  save: (data) => write('fake-fb-docs', data),
};

export const session = {
  get: () => { try { return JSON.parse(sessionStorage.getItem('fake-fb-session')); } catch { return null; } },
  set: (email) => (email ? sessionStorage.setItem('fake-fb-session', JSON.stringify(email)) : sessionStorage.removeItem('fake-fb-session')),
};

export const fail = (code) => Object.assign(new Error(code), { code });

/** Igual que isAdmin() en firestore.rules: el email del administrador Y verificado. */
export function assertAdmin() {
  const user = users.find(session.get());
  if (!user || user.email !== ADMIN_EMAIL || !user.emailVerified) throw fail('permission-denied');
}
