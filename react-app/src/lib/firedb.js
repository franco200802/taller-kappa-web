/**
 * FireDB — capa de acceso a Firestore. Único lugar que conoce las colecciones.
 *
 * Qué guarda el sitio:
 *   - `contactos`: una copia de cada mensaje del formulario de contacto.
 *   - `presupuestos`: una copia de cada presupuesto enviado por WhatsApp.
 * Las dos se escriben sin sesión (cualquier visitante) y solo las lee la cuenta
 * administradora desde /admin. Qué campos y largos se aceptan lo deciden las reglas
 * (firestore.rules); lib/leads.js arma los documentos con esos mismos límites.
 *
 * Los productos, las preguntas y los testimonios NO están en Firestore: salen del código
 * (data/), que es de donde se generan el HTML prerenderizado, el sitemap y el JSON-LD.
 */
import {
  collection, getDocs, doc, addDoc, updateDoc, deleteDoc,
  query, orderBy, limit, serverTimestamp,
} from 'firebase/firestore/lite';
import { db } from './firebase';
import { COLLECTIONS, ESTADO_KEYS, LIMITS, contactoDoc } from './leads';

/** Tope de documentos que trae el panel por colección (los más recientes). */
export const PAGE_SIZE = 300;

const assertCollection = (name) => {
  if (!Object.values(COLLECTIONS).includes(name)) throw new Error(`Colección desconocida: ${name}`);
};

export const FireDB = {
  /** Formulario de contacto. */
  createContacto(form) {
    return addDoc(collection(db, COLLECTIONS.contactos), { ...contactoDoc(form), estado: 'nueva', createdAt: serverTimestamp() });
  },

  /** Presupuesto enviado por WhatsApp. `data` viene de presupuestoDoc() (lib/leads.js). */
  createPresupuesto(data) {
    return addDoc(collection(db, COLLECTIONS.presupuestos), { ...data, estado: 'nueva', createdAt: serverTimestamp() });
  },

  /** Panel: los más recientes primero. */
  async list(name) {
    assertCollection(name);
    const snap = await getDocs(query(collection(db, name), orderBy('createdAt', 'desc'), limit(PAGE_SIZE)));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /** Panel: cambia el estado y/o la nota interna. Las reglas no dejan tocar ningún otro campo. */
  async update(name, id, { estado, nota }) {
    assertCollection(name);
    const patch = { updatedAt: serverTimestamp() };
    if (estado !== undefined) {
      if (!ESTADO_KEYS.includes(estado)) throw new Error(`Estado desconocido: ${estado}`);
      patch.estado = estado;
    }
    if (nota !== undefined) patch.nota = String(nota).slice(0, LIMITS.nota);
    await updateDoc(doc(db, name, id), patch);
    return patch;
  },

  /** Panel: borra definitivamente (para spam o datos que la persona pidió eliminar). */
  remove(name, id) {
    assertCollection(name);
    return deleteDoc(doc(db, name, id));
  },
};
