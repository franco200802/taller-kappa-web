import { useCallback, useEffect, useMemo, useState } from 'react';
import Modal from '../../components/Modal';
import { ESTADOS, countByEstado, estadoLabel, estadoOf, filterLeads, toCsv } from '../../lib/leads';

/**
 * Lista de consultas o de presupuestos (misma pantalla, distinta colección): búsqueda,
 * filtro por estado, detalle con cambio de estado y nota interna, borrado y exportación.
 *
 * `view` describe la colección (ver VIEWS en Admin.jsx) y `db` es FireDB. Todo lo que se
 * muestra viene de visitantes anónimos: se renderiza siempre como texto (React lo escapa),
 * nunca como HTML.
 */

const formatDate = (ts) => {
  const date = ts?.toDate?.();
  return date ? date.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : 'Sin fecha';
};

const errorText = (err, action) => (err?.code === 'permission-denied'
  ? 'Esta cuenta no tiene permiso. Tiene que ser la cuenta administradora y tener el email verificado.'
  : `No se pudo ${action} (${err?.code ?? err?.message ?? 'error desconocido'}).`);

function LeadDetail({ item, view, db, onChanged, onRemoved, onClose }) {
  const [estado, setEstado] = useState(estadoOf(item));
  const [nota, setNota] = useState(item.nota ?? '');
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const dirty = estado !== estadoOf(item) || nota !== (item.nota ?? '');

  const save = async (e) => {
    e.preventDefault();
    if (busy || !dirty) return;
    setBusy(true); setError('');
    try {
      await db.update(view.collection, item.id, { estado, nota });
      onChanged(item.id, { estado, nota });
      onClose();
    } catch (err) { setError(errorText(err, 'guardar')); }
    finally { setBusy(false); }
  };

  const remove = async () => {
    if (busy) return;
    setBusy(true); setError('');
    try {
      await db.remove(view.collection, item.id);
      onRemoved(item.id);
      onClose();
    } catch (err) { setError(errorText(err, 'eliminar')); setBusy(false); }
  };

  return (
    <form className="admin-dialog" onSubmit={save}>
      <div className="admin-dialog-head">
        <h2>{view.title(item)}</h2>
        <button type="button" className="cart-close" aria-label="Cerrar detalle" onClick={onClose}>×</button>
      </div>
      <dl className="facts">
        <div><dt>Recibida</dt><dd>{formatDate(item.createdAt)}</dd></div>
        {view.fields.map((f) => {
          const value = f.value(item);
          return value ? <div key={f.label}><dt>{f.label}</dt><dd className={f.long ? 'admin-long' : undefined}>{value}</dd></div> : null;
        })}
        {item.updatedAt && <div><dt>Último cambio</dt><dd>{formatDate(item.updatedAt)}</dd></div>}
      </dl>
      <div className="form-group">
        <label htmlFor="lead-estado">Estado</label>
        <select id="lead-estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
          {ESTADOS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="lead-nota">Nota interna (no la ve el cliente)</label>
        <textarea id="lead-nota" maxLength={1000} value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej.: le pasé el precio el lunes, espera respuesta." />
      </div>
      {error && <p role="alert" className="admin-error">{error}</p>}
      <div className="admin-dialog-actions">
        <button type="submit" className="btn-main" disabled={busy || !dirty}>{busy ? 'Guardando…' : 'Guardar cambios'}</button>
        {confirming ? (
          <>
            <button type="button" className="btn-outline admin-danger" disabled={busy} onClick={remove}>Sí, eliminar definitivamente</button>
            <button type="button" className="btn-outline" disabled={busy} onClick={() => setConfirming(false)}>No eliminar</button>
          </>
        ) : (
          <button type="button" className="btn-outline" disabled={busy} onClick={() => setConfirming(true)}>Eliminar…</button>
        )}
      </div>
    </form>
  );
}

export default function AdminLeads({ view, db, onCount }) {
  const [items, setItems] = useState(null); // null = cargando
  const [error, setError] = useState('');
  const [estado, setEstado] = useState('todas');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const load = useCallback(() => {
    setItems(null); setError('');
    db.list(view.collection)
      .then(setItems)
      .catch((err) => { setItems([]); setError(errorText(err, 'cargar la lista')); });
  }, [db, view.collection]);

  useEffect(() => { load(); }, [load]);

  const counts = useMemo(() => countByEstado(items ?? []), [items]);
  useEffect(() => { if (items) onCount(view.key, counts.nueva); }, [items, counts.nueva, onCount, view.key]);

  const visible = useMemo(() => filterLeads(items ?? [], { estado, search }), [items, estado, search]);

  const onChanged = (id, patch) => setItems((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const onRemoved = (id) => setItems((list) => list.filter((i) => i.id !== id));

  const exportCsv = () => {
    const csv = toCsv(visible, [
      { label: 'Fecha', value: (i) => formatDate(i.createdAt) },
      { label: 'Estado', value: (i) => estadoLabel(estadoOf(i)) },
      ...view.fields.map((f) => ({ label: f.label, value: f.value })),
      { label: 'Nota interna', value: (i) => i.nota ?? '' },
    ]);
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = Object.assign(document.createElement('a'), { href: url, download: `${view.key}-taller-kappa.csv` });
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-leads">
      <div className="admin-toolbar">
        <div className="form-group admin-search">
          <label htmlFor={`search-${view.key}`}>Buscar</label>
          <input id={`search-${view.key}`} type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={view.searchHint} />
        </div>
        <div className="admin-toolbar-actions">
          <button type="button" className="btn-detail" onClick={load} disabled={items === null}>Actualizar</button>
          <button type="button" className="btn-detail" onClick={exportCsv} disabled={!visible.length}>Exportar CSV</button>
        </div>
      </div>

      <div className="filters admin-filters" role="group" aria-label="Filtrar por estado">
        {[{ key: 'todas', label: 'Todas' }, ...ESTADOS].map((s) => (
          <button key={s.key} type="button" className={`filter-btn${estado === s.key ? ' active' : ''}`} aria-pressed={estado === s.key} onClick={() => setEstado(s.key)}>
            {s.label} <span className="admin-count">{counts[s.key]}</span>
          </button>
        ))}
      </div>

      {error && <p role="alert" className="admin-error">{error}</p>}
      <p className="admin-status" role="status">
        {items === null ? 'Cargando…' : `${visible.length} de ${items.length} ${view.noun}`}
      </p>

      {items !== null && !error && items.length === 0 && <p className="admin-empty">{view.empty}</p>}
      {items !== null && items.length > 0 && visible.length === 0 && <p className="admin-empty">Nada coincide con la búsqueda o el filtro.</p>}

      {visible.length > 0 && (
        <ul className="admin-list">
          {visible.map((item) => (
            <li key={item.id}>
              <button type="button" className={`admin-row is-${estadoOf(item)}`} onClick={() => { setSelected(item); setDetailOpen(true); }}>
                <span className="admin-row-main">
                  <strong>{view.title(item)}</strong>
                  <span className="admin-row-snippet">{view.snippet(item)}</span>
                </span>
                <span className="admin-row-side">
                  <span className={`admin-pill is-${estadoOf(item)}`}>{estadoLabel(estadoOf(item))}</span>
                  <span className="admin-row-date">{formatDate(item.createdAt)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal className="modal" label={`Detalle de ${view.singular}`} open={detailOpen} onClose={() => setDetailOpen(false)}>
        {/* `key`: al abrir otro elemento, el formulario arranca con sus datos y no con los del anterior. */}
        {selected && (
          <LeadDetail key={selected.id} item={items?.find((i) => i.id === selected.id) ?? selected} view={view} db={db}
            onChanged={onChanged} onRemoved={onRemoved} onClose={() => setDetailOpen(false)} />
        )}
      </Modal>
    </div>
  );
}
