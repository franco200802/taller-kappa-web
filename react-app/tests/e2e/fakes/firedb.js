// Reemplazo de src/lib/firedb.js en el build de prueba simulado (ver store.js).
// Misma interfaz que el FireDB real; los documentos se arman con las mismas funciones.
import { COLLECTIONS, ESTADO_KEYS, LIMITS, contactoDoc } from '../../../src/lib/leads.js';
import { assertAdmin, docs, fail } from './store.js';

export const PAGE_SIZE = 300;
const delay = () => new Promise((r) => setTimeout(r, 40));
const stamp = (ms) => ({ toDate: () => new Date(ms) });
const hydrate = (d) => ({ ...d, createdAt: stamp(d.createdAt), ...(d.updatedAt ? { updatedAt: stamp(d.updatedAt) } : {}) });

async function add(name, data) {
  await delay();
  const all = docs.all();
  const id = `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  all[name] = [...(all[name] ?? []), { id, ...data, estado: 'nueva', createdAt: Date.now() }];
  docs.save(all);
  return { id };
}

export const FireDB = {
  createContacto: (form) => add(COLLECTIONS.contactos, contactoDoc(form)),
  createPresupuesto: (data) => add(COLLECTIONS.presupuestos, data),
  async list(name) {
    await delay();
    assertAdmin();
    return [...(docs.all()[name] ?? [])].sort((a, b) => b.createdAt - a.createdAt).slice(0, PAGE_SIZE).map(hydrate);
  },
  async update(name, id, { estado, nota }) {
    await delay();
    assertAdmin();
    if (estado !== undefined && !ESTADO_KEYS.includes(estado)) throw fail('permission-denied');
    const all = docs.all();
    all[name] = (all[name] ?? []).map((d) => (d.id === id
      ? { ...d, ...(estado !== undefined ? { estado } : {}), ...(nota !== undefined ? { nota: String(nota).slice(0, LIMITS.nota) } : {}), updatedAt: Date.now() }
      : d));
    docs.save(all);
  },
  async remove(name, id) {
    await delay();
    assertAdmin();
    const all = docs.all();
    all[name] = (all[name] ?? []).filter((d) => d.id !== id);
    docs.save(all);
  },
};
