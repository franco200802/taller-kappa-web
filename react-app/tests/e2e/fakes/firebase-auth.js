// Reemplazo de 'firebase/auth' en el build de prueba simulado (ver store.js).
import { fail, session, users } from './store.js';

const listeners = new Set();
const delay = () => new Promise((r) => setTimeout(r, 30));

function userObject(email) {
  const record = users.find(email);
  if (!record) return null;
  const user = {
    email: record.email,
    emailVerified: record.emailVerified,
    async reload() { user.emailVerified = !!users.find(email)?.emailVerified; },
    async getIdToken() { return 'token-simulado'; },
  };
  return user;
}
const emit = () => { const user = userObject(session.get()); listeners.forEach((fn) => fn(user)); };

export const browserSessionPersistence = 'SESSION';
export async function setPersistence() { /* la sesión simulada ya vive en sessionStorage */ }
export function onAuthStateChanged(_auth, callback) {
  listeners.add(callback);
  setTimeout(() => { if (listeners.has(callback)) callback(userObject(session.get())); }, 30);
  return () => listeners.delete(callback);
}
export async function signInWithEmailAndPassword(_auth, email, password) {
  await delay();
  const record = users.find(email);
  if (!record || record.password !== password) throw fail('auth/invalid-credential');
  session.set(email);
  emit();
}
export async function signOut() { session.set(null); emit(); }
export async function sendEmailVerification() { await delay(); }
export async function sendPasswordResetEmail(_auth, email) { await delay(); if (!email) throw fail('auth/missing-email'); }
