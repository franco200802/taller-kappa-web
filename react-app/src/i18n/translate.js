/**
 * Motor del modo en inglés.
 *
 * El sitio está escrito en español y se prerenderiza así (es lo que indexa Google). El inglés es un
 * modo secundario que se activa a pedido del visitante: este módulo traduce el DOM ya hidratado
 * usando el diccionario de en.js, sin tocar los componentes. Lo que no está en el diccionario
 * queda en español, nunca en blanco.
 *
 * Los nodos de texto cambian de valor pero React sigue siendo dueño de ellos: si re-renderiza uno,
 * el MutationObserver lo vuelve a traducir; al volver a español se restauran los originales.
 */

const ATTRS = ['alt', 'aria-label', 'title', 'placeholder'];
const META_SELECTOR = 'meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[name="twitter:title"], meta[name="twitter:description"]';
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE']);

/** Reglas para textos con datos variables (nombre de producto, color…) que no pueden ir en el diccionario. */
const RULES = [
  [/^"(.+)" \((.+)\) agregado al presupuesto$/, (tr, n, c) => `"${tr(n)}" (${tr(c)}) added to your quote`],
  [/^Quitar una unidad de (.+)$/, (tr, n) => `Remove one unit of ${tr(n)}`],
  [/^Agregar una unidad de (.+)$/, (tr, n) => `Add one unit of ${tr(n)}`],
  [/^Eliminar (.+)$/, (tr, n) => `Remove ${tr(n)}`],
  [/^Ficha de (.+)$/, (tr, n) => `${tr(n)} data sheet`],
  [/^Vista rápida: (.+)$/, (tr, n) => `Quick view: ${tr(n)}`],
  [/^Ver ficha de (.+)$/, (tr, n) => `See data sheet for ${tr(n)}`],
  [/^Agregar en (.+)$/, (tr, n) => `Add in ${tr(n)}`],
];

/** Traduce `text` (puede traer espacios de más) o devuelve null si no hay traducción. */
export function translateText(text, dict) {
  const core = text.replace(/\s+/g, ' ').trim();
  if (!core) return null;
  const tr = (s) => dict[s] ?? s;
  let out = dict[core];
  if (out === undefined) {
    for (const [re, fn] of RULES) {
      const m = core.match(re);
      if (m) { out = fn(tr, ...m.slice(1)); break; }
    }
  }
  if (out === undefined || out === core) return null;
  const lead = text.match(/^\s*/)[0];
  const trail = text.match(/\s*$/)[0];
  return lead + out + trail;
}

const inNoTranslate = (el) => !el || !!el.closest?.('[translate="no"], svg');
const isSkipped = (el) => !el || SKIP_TAGS.has(el.nodeName) || inNoTranslate(el);

/**
 * Crea el traductor del DOM. `start()` traduce todo y queda observando los cambios;
 * `stop()` deja de observar y devuelve el texto original.
 */
export function createDomTranslator(dict) {
  const texts = new Map(); // nodo de texto → { orig, out }
  const attrs = new Map(); // elemento → Map(atributo → { orig, out })
  let observer = null;

  function doText(node) {
    if (isSkipped(node.parentElement)) return;
    const cur = node.nodeValue;
    const rec = texts.get(node);
    if (rec && rec.out === cur) return; // ya traducido por nosotros
    const out = translateText(cur, dict);
    if (out === null) { if (rec) texts.delete(node); return; }
    texts.set(node, { orig: cur, out });
    node.nodeValue = out;
  }

  function doAttr(el, name) {
    const cur = el.getAttribute(name);
    if (!cur || inNoTranslate(el)) return;
    let map = attrs.get(el);
    const rec = map?.get(name);
    if (rec && rec.out === cur) return;
    const out = translateText(cur, dict);
    if (out === null) { map?.delete(name); return; }
    if (!map) attrs.set(el, (map = new Map()));
    map.set(name, { orig: cur, out });
    el.setAttribute(name, out);
  }

  function doMeta(el) {
    const cur = el.getAttribute('content');
    if (!cur) return;
    let map = attrs.get(el);
    const rec = map?.get('content');
    if (rec && rec.out === cur) return;
    const out = translateText(cur, dict);
    if (out === null) return;
    if (!map) attrs.set(el, (map = new Map()));
    map.set('content', { orig: cur, out });
    el.setAttribute('content', out);
  }

  function doTree(root) {
    if (root.nodeType === Node.TEXT_NODE) { doText(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) doText(n);
    const sel = ATTRS.map((a) => `[${a}]`).join(',');
    if (root.matches(sel)) ATTRS.forEach((a) => root.hasAttribute(a) && doAttr(root, a));
    root.querySelectorAll(sel).forEach((el) => ATTRS.forEach((a) => el.hasAttribute(a) && doAttr(el, a)));
  }

  function doHead() {
    const title = document.head.querySelector('title');
    if (title) title.childNodes.forEach((n) => n.nodeType === Node.TEXT_NODE && doText(n));
    document.head.querySelectorAll(META_SELECTOR).forEach(doMeta);
  }

  function prune() {
    for (const n of texts.keys()) if (!n.isConnected) texts.delete(n);
    for (const e of attrs.keys()) if (!e.isConnected) attrs.delete(e);
  }

  function onMutations(records) {
    for (const r of records) {
      if (r.type === 'characterData') doText(r.target);
      else if (r.type === 'attributes') {
        if (r.target.matches?.(META_SELECTOR)) doMeta(r.target);
        else doAttr(r.target, r.attributeName);
      } else {
        r.addedNodes.forEach((n) => {
          if (n.nodeType === Node.ELEMENT_NODE && n.matches(META_SELECTOR)) doMeta(n);
          else doTree(n);
        });
        // <title> se actualiza reemplazando su hijo de texto
        if (r.target.nodeName === 'TITLE') r.target.childNodes.forEach((n) => n.nodeType === Node.TEXT_NODE && doText(n));
      }
    }
    if (texts.size > 4000) prune();
  }

  return {
    start() {
      doTree(document.body);
      doHead();
      observer = new MutationObserver(onMutations);
      const opts = { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: [...ATTRS, 'content'] };
      observer.observe(document.documentElement, opts);
    },
    stop() {
      observer?.disconnect();
      observer = null;
      texts.forEach((rec, node) => { if (node.nodeValue === rec.out) node.nodeValue = rec.orig; });
      attrs.forEach((map, el) => map.forEach((rec, name) => { if (el.getAttribute(name) === rec.out) el.setAttribute(name, rec.orig); }));
      texts.clear();
      attrs.clear();
    },
  };
}
