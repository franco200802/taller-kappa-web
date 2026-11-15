// Pruebas de las reglas de seguridad (../../firestore.rules) contra el emulador de Firestore.
// Correr: npm run test:rules  (levanta el emulador; necesita Java 21 o superior).
//
// Cada prueba usa las mismas funciones con las que el sitio arma los documentos
// (src/lib/leads.js): si alguien cambia un límite en un lado y no en el otro, fallan.
import { after, before, beforeEach, describe, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { contactoDoc, presupuestoDoc } from '../../src/lib/leads.js';

const ADMIN_EMAIL = 'ing.franciscomarotta@gmail.com';
const rules = readFileSync(fileURLToPath(new URL('../../../firestore.rules', import.meta.url)), 'utf8');

let env;
before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-taller-kappa', firestore: { rules, host: '127.0.0.1', port: 8080 } });
});
after(() => env?.cleanup());
beforeEach(() => env.clearFirestore());

const anon = () => env.unauthenticatedContext().firestore();
const admin = () => env.authenticatedContext('admin', { email: ADMIN_EMAIL, email_verified: true }).firestore();
const adminSinVerificar = () => env.authenticatedContext('admin2', { email: ADMIN_EMAIL, email_verified: false }).firestore();
const otro = () => env.authenticatedContext('otro', { email: 'otra.persona@example.com', email_verified: true }).firestore();

const contacto = (extra = {}) => ({ ...contactoDoc({ name: 'Ana', interest: 'Sillón BKF', zone: 'Palermo', message: 'Hola, quiero un presupuesto.' }), estado: 'nueva', createdAt: serverTimestamp(), ...extra });
const cart = [{ product: { name: 'Sillón BKF Premium' }, color: 'Negro Mate', qty: 2 }];
const presupuesto = (extra = {}) => ({ ...presupuestoDoc(cart, { name: 'Juan', zone: 'Caballito', kind: 'empresa' }), estado: 'nueva', createdAt: serverTimestamp(), ...extra });

/** Carga un documento saltándose las reglas, para probar lecturas y cambios sobre algo que ya existe. */
async function seed(path, data) {
  await env.withSecurityRulesDisabled((ctx) => setDoc(doc(ctx.firestore(), path), { ...data, createdAt: Timestamp.now() }));
}

for (const [name, valid] of [['contactos', contacto], ['presupuestos', presupuesto]]) {
  describe(`${name}: crear (cualquier visitante)`, () => {
    test('acepta el documento que arma el sitio', () => assertSucceeds(addDoc(collection(anon(), name), valid())));
    test('acepta los datos opcionales vacíos', () => assertSucceeds(addDoc(collection(anon(), name), valid({ zone: '', name: name === 'contactos' ? 'Ana' : '' }))));
    test('rechaza un campo de más', () => assertFails(addDoc(collection(anon(), name), valid({ admin: true }))));
    test('rechaza que falte un campo', async () => {
      const data = valid(); delete data.zone;
      await assertFails(addDoc(collection(anon(), name), data));
    });
    test('rechaza nacer con otro estado', () => assertFails(addDoc(collection(anon(), name), valid({ estado: 'respondida' }))));
    test('rechaza una nota interna escrita por el visitante', () => assertFails(addDoc(collection(anon(), name), valid({ nota: 'ya pagado' }))));
    test('rechaza una fecha elegida por el visitante', () => assertFails(addDoc(collection(anon(), name), valid({ createdAt: Timestamp.fromDate(new Date('2020-01-01')) }))));
    test('rechaza un texto más largo que el límite', () => assertFails(addDoc(collection(anon(), name), valid({ zone: 'x'.repeat(101) }))));
    test('rechaza un tipo de dato equivocado', () => assertFails(addDoc(collection(anon(), name), valid({ zone: 123 }))));
  });

  describe(`${name}: leer, cambiar y borrar`, () => {
    beforeEach(() => seed(`${name}/uno`, { ...valid(), createdAt: undefined }));

    test('un visitante no puede leer un documento', () => assertFails(getDoc(doc(anon(), name, 'uno'))));
    test('un visitante no puede listar', () => assertFails(getDocs(collection(anon(), name))));
    test('un visitante no puede cambiar ni borrar', async () => {
      await assertFails(updateDoc(doc(anon(), name, 'uno'), { estado: 'respondida', updatedAt: serverTimestamp() }));
      await assertFails(deleteDoc(doc(anon(), name, 'uno')));
    });
    test('otra cuenta con sesión (email verificado) no puede leer, cambiar ni borrar', async () => {
      await assertFails(getDocs(collection(otro(), name)));
      await assertFails(updateDoc(doc(otro(), name, 'uno'), { estado: 'respondida', updatedAt: serverTimestamp() }));
      await assertFails(deleteDoc(doc(otro(), name, 'uno')));
    });
    test('la cuenta del administrador SIN email verificado no puede leer ni cambiar', async () => {
      await assertFails(getDocs(collection(adminSinVerificar(), name)));
      await assertFails(updateDoc(doc(adminSinVerificar(), name, 'uno'), { estado: 'respondida', updatedAt: serverTimestamp() }));
    });
    test('el administrador puede leer y listar', async () => {
      await assertSucceeds(getDoc(doc(admin(), name, 'uno')));
      await assertSucceeds(getDocs(collection(admin(), name)));
    });
    test('el administrador puede cambiar el estado y la nota', () =>
      assertSucceeds(updateDoc(doc(admin(), name, 'uno'), { estado: 'en_curso', nota: 'Le pasé el precio.', updatedAt: serverTimestamp() })));
    test('el administrador no puede editar lo que escribió el visitante', () =>
      assertFails(updateDoc(doc(admin(), name, 'uno'), { name: 'Otro nombre', estado: 'en_curso', updatedAt: serverTimestamp() })));
    test('el administrador no puede poner un estado inventado', () =>
      assertFails(updateDoc(doc(admin(), name, 'uno'), { estado: 'pagado', updatedAt: serverTimestamp() })));
    test('el administrador no puede guardar una nota de más de 1000 caracteres', () =>
      assertFails(updateDoc(doc(admin(), name, 'uno'), { estado: 'en_curso', nota: 'x'.repeat(1001), updatedAt: serverTimestamp() })));
    test('un cambio sin la fecha del servidor se rechaza', () =>
      assertFails(updateDoc(doc(admin(), name, 'uno'), { estado: 'en_curso' })));
    test('el administrador puede borrar', () => assertSucceeds(deleteDoc(doc(admin(), name, 'uno'))));
  });
}

describe('contactos: validaciones propias', () => {
  test('rechaza sin nombre', () => assertFails(addDoc(collection(anon(), 'contactos'), contacto({ name: '' }))));
  test('rechaza sin mensaje', () => assertFails(addDoc(collection(anon(), 'contactos'), contacto({ message: '' }))));
  test('acepta un mensaje de 2000 caracteres y rechaza uno de 2001', async () => {
    await assertSucceeds(addDoc(collection(anon(), 'contactos'), contacto({ message: 'x'.repeat(2000) })));
    await assertFails(addDoc(collection(anon(), 'contactos'), contacto({ message: 'x'.repeat(2001) })));
  });
});

describe('presupuestos: validaciones propias', () => {
  test('rechaza sin detalle', () => assertFails(addDoc(collection(anon(), 'presupuestos'), presupuesto({ detalle: '' }))));
  test('rechaza cantidades fuera de rango o no enteras', async () => {
    for (const totalQty of [0, -1, 10000, 1.5, '2']) await assertFails(addDoc(collection(anon(), 'presupuestos'), presupuesto({ totalQty })));
  });
  test('rechaza un tipo de cliente desconocido', () => assertFails(addDoc(collection(anon(), 'presupuestos'), presupuesto({ kind: 'vip' }))));
});

describe('el resto de la base está cerrado', () => {
  for (const path of ['productos/x', 'faqs/x', 'testimonios/x', 'orders/x', 'users/admin', 'cualquiera/x', 'contactos/uno/sub/x']) {
    test(`${path}: nadie lee ni escribe, tampoco el administrador`, async () => {
      for (const db of [anon(), otro(), admin()]) {
        await assertFails(getDoc(doc(db, path)));
        await assertFails(setDoc(doc(db, path), { a: 1 }));
      }
    });
  }
});
