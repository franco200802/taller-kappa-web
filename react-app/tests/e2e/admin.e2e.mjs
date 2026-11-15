// Recorrido completo del panel y de los dos formularios públicos, en un navegador real.
// Nunca toca un servicio real. Tiene dos modos:
//
//   npm run test:e2e       contra los EMULADORES de Firebase (Auth + Firestore con las reglas
//                          de ../../firestore.rules y el SDK real). Necesita Java 21+.
//                          Es el que valida la seguridad y la integración.
//   npm run test:e2e:mock  con un backend SIMULADO en el navegador (tests/e2e/fakes/). No
//                          necesita Java. Valida el comportamiento del panel y de los
//                          formularios, NO las reglas ni el SDK.
//
// Las dos corren exactamente las mismas comprobaciones. Necesitan Chrome o Edge; si no está
// en la ruta habitual: CHROME_PATH=/ruta/al/chrome npm run test:e2e
//
// Qué hace: compila el sitio en modo de prueba (carpeta dist-e2e, aparte del build real),
// lo sirve en local y lo maneja con puppeteer-core.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const PORT = 4179;
const BASE = `http://127.0.0.1:${PORT}`;
const PROJECT = 'demo-taller-kappa';
const MOCK = process.env.E2E_BACKEND === 'mock' || process.argv.includes('--mock');
const AUTH = 'http://127.0.0.1:9099';
const FIRESTORE = 'http://127.0.0.1:8080';
const ADMIN = { email: 'ing.franciscomarotta@gmail.com', password: 'clave-de-prueba-123' };
const INTRUSO = { email: 'otra.persona@example.com', password: 'otra-clave-456' };

const chromePath = process.env.CHROME_PATH ?? [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => existsSync(p));
if (!chromePath) { console.error('No se encontró Chrome ni Edge. Definí CHROME_PATH.'); process.exit(1); }

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${!ok && detail ? ` — ${detail}` : ''}`);
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(fn, label, ms = 8000) {
  const end = Date.now() + ms;
  let last;
  while (Date.now() < end) {
    try { last = await fn(); if (last) return last; } catch (err) { last = err.message; }
    await wait(150);
  }
  throw new Error(`Tiempo agotado esperando: ${label} (último valor: ${JSON.stringify(last)})`);
}

// ---------- Backend de prueba: usuarios y lectura directa de lo guardado ----------
// `control` es una pestaña del mismo origen que usa el modo simulado para tocar su almacén.
let control;
const owner = { Authorization: 'Bearer owner', 'Content-Type': 'application/json' };
const emulator = {
  async createUser({ email, password }, emailVerified) {
    const res = await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, returnSecureToken: true }) });
    const { localId } = await res.json();
    if (emailVerified) await emulator.setVerified(localId, true);
    return localId;
  },
  setVerified: (localId, emailVerified) => fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts:update`, { method: 'POST', headers: owner, body: JSON.stringify({ localId, emailVerified }) }),
  async docsOf(name) {
    const res = await fetch(`${FIRESTORE}/v1/projects/${PROJECT}/databases/(default)/documents/${name}`, { headers: owner });
    return ((await res.json()).documents ?? []).map((d) => Object.fromEntries(Object.entries(d.fields).map(([k, v]) => [k, Object.values(v)[0]])));
  },
  reset: () => Promise.all([
    fetch(`${FIRESTORE}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: 'DELETE' }),
    fetch(`${AUTH}/emulator/v1/projects/${PROJECT}/accounts`, { method: 'DELETE' }),
  ]),
};
const mock = {
  createUser: (user, emailVerified) => control.evaluate((u, v) => {
    const list = JSON.parse(localStorage.getItem('fake-fb-users') || '[]');
    localStorage.setItem('fake-fb-users', JSON.stringify([...list, { ...u, emailVerified: v }]));
    return u.email;
  }, user, emailVerified),
  setVerified: (email, emailVerified) => control.evaluate((e, v) => {
    const list = JSON.parse(localStorage.getItem('fake-fb-users') || '[]').map((u) => (u.email === e ? { ...u, emailVerified: v } : u));
    localStorage.setItem('fake-fb-users', JSON.stringify(list));
  }, email, emailVerified),
  docsOf: (name) => control.evaluate((n) => JSON.parse(localStorage.getItem('fake-fb-docs') || '{}')[n] ?? [], name),
  reset: () => control.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }),
};
const backend = MOCK ? mock : emulator;
const { createUser, setVerified, reset } = backend;
const docsOf = backend.docsOf;

// ---------- Build en modo emulador + servidor local ----------
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const buildArgs = ['vite', 'build', '--outDir', 'dist-e2e', '--logLevel', 'error', ...(MOCK ? ['--config', 'tests/e2e/vite.mock.config.js'] : [])];
console.log(`Backend de prueba: ${MOCK ? 'SIMULADO (no valida reglas ni SDK)' : 'emuladores de Firebase'}\n`);
const out = spawnSync(npx, buildArgs, { cwd: ROOT, env: { ...process.env, VITE_FIREBASE_EMULATOR: '1' }, stdio: 'inherit', shell: process.platform === 'win32' });
if (out.status !== 0) { console.error('Falló el build de prueba.'); process.exit(1); }
const server = spawn(npx, ['vite', 'preview', '--outDir', 'dist-e2e', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore', shell: process.platform === 'win32' });
await until(() => fetch(BASE).then((r) => r.ok), 'el servidor local', 20000);

const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new', args: ['--no-sandbox'] });
const consoleErrors = [];
async function open(path, width = 1280) {
  const page = await browser.newPage();
  page.on('pageerror', (e) => consoleErrors.push(`${path}: ${String(e).slice(0, 200)}`));
  await page.setViewport({ width, height: 900, isMobile: width < 700, hasTouch: width < 700 });
  await page.goto(BASE + path, { waitUntil: 'networkidle2' });
  return page;
}
const text = (page, sel = 'main') => page.$eval(sel, (el) => el.innerText);
const clickText = (page, sel, label) => page.evaluate((s, t) => {
  const el = [...document.querySelectorAll(s)].find((e) => e.innerText.trim().startsWith(t));
  if (!el) throw new Error(`No hay "${t}" en ${s}`);
  el.click();
}, sel, label);
async function login(page, { email, password }) {
  await page.waitForSelector('#admin-email');
  for (const [selector, value] of [['#admin-email', email], ['#admin-password', password]]) {
    await page.focus(selector);
    await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); // selecciona lo que hubiera
    await page.keyboard.press('Backspace');
    await page.type(selector, value);
  }
  await page.click('.admin-form button[type="submit"]');
}

let exitCode = 0;
try {
  if (MOCK) control = await open('/admin');
  await reset();
  const adminId = await createUser(ADMIN, false);
  await createUser(INTRUSO, true);

  // ===== 1. Sitio público: el formulario de contacto guarda la consulta =====
  {
    const page = await open('/contacto/', 390);
    await page.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }; });
    await page.type('#contact-name', 'Ana Prueba');
    await page.select('#contact-interest', 'Sillón BKF');
    await page.type('#contact-zone', 'Palermo');
    await page.type('#contact-message', 'Quiero dos sillones en negro mate.');
    await page.click('.form-submit button');
    check('contacto: abre WhatsApp aunque Firestore tarde', (await page.evaluate(() => window.__opened.length)) === 1);
    const docs = await until(async () => { const d = await docsOf('contactos'); return d.length ? d : null; }, 'la consulta en Firestore');
    check('contacto: se guarda una sola consulta con los campos esperados',
      docs.length === 1 && docs[0].name === 'Ana Prueba' && docs[0].zone === 'Palermo' && docs[0].estado === 'nueva' && docs[0].message.includes('dos sillones'), JSON.stringify(docs));
    check('contacto: avisa que se guarda una copia', (await text(page)).includes('guardamos una copia del mensaje'));
    await page.close();
  }

  // ===== 2. Sitio público: el presupuesto se guarda una vez, aunque se toque dos veces =====
  {
    const page = await open('/catalogo/', 390);
    await clickText(page, '.btn-add-cart', 'Agregar');
    await page.click('.cart-icon-container');
    await page.waitForSelector('#quote-name', { visible: true });
    await page.type('#quote-name', 'Local Centro');
    await page.select('#quote-kind', 'empresa');
    await page.type('#quote-zone', 'San Martín');
    // El enlace abre wa.me en otra pestaña: se anula la navegación, no el manejador del sitio.
    await page.$eval('.btn-whatsapp-checkout', (a) => a.addEventListener('click', (e) => e.preventDefault()));
    await page.click('.btn-whatsapp-checkout');
    const docs = await until(async () => { const d = await docsOf('presupuestos'); return d.length ? d : null; }, 'el presupuesto en Firestore');
    check('presupuesto: se guarda con el detalle, la cantidad y el tipo de cliente',
      docs[0].detalle.includes('Sillón BKF Premium - 1 unidad') && String(docs[0].totalQty) === '1' && docs[0].kind === 'empresa' && docs[0].name === 'Local Centro', JSON.stringify(docs));
    await page.click('.btn-whatsapp-checkout');
    await wait(1200);
    check('presupuesto: tocar el botón otra vez no lo duplica', (await docsOf('presupuestos')).length === 1);
    await page.click('.qty-btn[aria-label^="Agregar una unidad"]');
    await page.click('.btn-whatsapp-checkout');
    await until(async () => (await docsOf('presupuestos')).length === 2, 'el segundo presupuesto');
    check('presupuesto: un pedido distinto sí se guarda', true);
    await page.close();
  }

  // ===== 3. Panel: acceso =====
  const page = await open('/admin');
  await login(page, { email: ADMIN.email, password: 'incorrecta' });
  await until(async () => (await text(page)).includes('Usuario o contraseña incorrectos'), 'el error de login');
  check('admin: una contraseña incorrecta se informa y no entra', !(await page.$('.admin-tabs')));

  await login(page, INTRUSO);
  await page.waitForSelector('.admin-tabs');
  await until(async () => (await text(page)).includes('no tiene permiso'), 'el aviso de permisos');
  check('admin: otra cuenta con sesión no ve ninguna consulta (lo impiden las reglas)', !(await page.$('.admin-row')));
  await clickText(page, 'button', 'Cerrar sesión');
  await page.waitForSelector('#admin-email');
  check('admin: cerrar sesión vuelve al formulario de acceso', true);

  await login(page, ADMIN);
  await until(async () => (await text(page)).includes('Falta verificar el email'), 'el aviso de email sin verificar');
  check('admin: la cuenta administradora sin email verificado no carga nada', !(await page.$('.admin-leads')));
  await clickText(page, 'button', 'Ya lo verifiqué');
  await until(async () => (await text(page)).includes('todavía figura sin verificar'), 'el rechazo de la verificación');
  check('admin: "Ya lo verifiqué" no alcanza si el email sigue sin verificar', !(await page.$('.admin-leads')));
  await setVerified(adminId, true);
  await clickText(page, 'button', 'Ya lo verifiqué');
  await page.waitForSelector('.admin-row');
  check('admin: con el email verificado aparecen las consultas', (await page.$$('.admin-row')).length >= 1);

  // ===== 4. Panel: consultas =====
  const visibleRows = () => page.$$eval('.admin-leads', (lists) => { const el = lists.find((l) => !l.parentElement.hidden); return [...el.querySelectorAll('.admin-row')].map((r) => r.innerText); });
  const badges = () => page.$$eval('.admin-tab', (tabs) => tabs.map((t) => t.innerText.replace(/\s+/g, ' ').trim()));
  await until(async () => (await badges()).join('|') === 'Consultas 1|Presupuestos 2|Productos', 'los contadores de las pestañas');
  check('admin: las pestañas muestran cuántas hay sin atender', true);
  check('admin: la consulta muestra nombre, interés y mensaje', /Ana Prueba[\s\S]*Sillón BKF[\s\S]*dos sillones/.test((await visibleRows())[0]));

  await page.type('#search-consultas', 'no-existe-xyz');
  await until(async () => (await visibleRows()).length === 0, 'la búsqueda sin resultados');
  check('admin: la búsqueda sin coincidencias lo dice', (await text(page)).includes('Nada coincide'));
  await page.$eval('#search-consultas', (i) => { i.value = ''; });
  await page.type('#search-consultas', 'PALERMO sillones');
  await until(async () => (await visibleRows()).length === 1, 'la búsqueda con resultados');
  check('admin: la búsqueda encuentra por zona y por texto del mensaje', true);

  await page.click('.admin-leads .admin-row');
  await page.waitForSelector('#lead-estado', { visible: true });
  check('admin: el detalle muestra la zona de entrega', (await text(page, 'dialog[open]')).includes('Palermo'));
  check('admin: "Guardar" está deshabilitado si no cambió nada', await page.$eval('dialog[open] button[type="submit"]', (b) => b.disabled));
  await page.select('#lead-estado', 'respondida');
  await page.type('#lead-nota', 'Le pasé el precio por WhatsApp.');
  await page.click('dialog[open] button[type="submit"]');
  await until(async () => (await visibleRows())[0]?.includes('Respondida'), 'el estado nuevo en la lista');
  const saved = (await docsOf('contactos'))[0];
  check('admin: el estado y la nota quedan guardados en Firestore', saved.estado === 'respondida' && saved.nota === 'Le pasé el precio por WhatsApp.' && saved.name === 'Ana Prueba', JSON.stringify(saved));
  await until(async () => (await badges())[0] === 'Consultas', 'el contador en cero');
  check('admin: al responderla, la pestaña deja de marcarla como pendiente', true);

  await page.$eval('#search-consultas', (i) => { i.value = ''; });
  await page.type('#search-consultas', ' ');
  await clickText(page, '.admin-leads .filter-btn', 'Nueva');
  await until(async () => (await visibleRows()).length === 0, 'el filtro "Nueva" vacío');
  await clickText(page, '.admin-leads .filter-btn', 'Respondida');
  await until(async () => (await visibleRows()).length === 1, 'el filtro "Respondida"');
  check('admin: el filtro por estado funciona', true);
  await clickText(page, '.admin-leads .filter-btn', 'Todas');

  // ===== 5. Panel: presupuestos, borrado y productos =====
  await clickText(page, '.admin-tab', 'Presupuestos');
  await until(async () => (await visibleRows()).length === 2, 'los dos presupuestos');
  check('admin: la pestaña de presupuestos lista los pedidos con su detalle', (await visibleRows()).every((r) => r.includes('Local Centro') && r.includes('Sillón BKF Premium')));
  await page.evaluate(() => [...document.querySelectorAll('.admin-leads')].find((l) => !l.parentElement.hidden).querySelector('.admin-row').click());
  await page.waitForSelector('dialog[open] #lead-estado', { visible: true });
  check('admin: el detalle del presupuesto dice para quién es', (await text(page, 'dialog[open]')).includes('Local o empresa'));
  await clickText(page, 'dialog[open] button', 'Eliminar');
  check('admin: eliminar pide confirmación y todavía no borra', (await docsOf('presupuestos')).length === 2 && (await text(page, 'dialog[open]')).includes('Sí, eliminar definitivamente'));
  await clickText(page, 'dialog[open] button', 'Sí, eliminar');
  await until(async () => (await docsOf('presupuestos')).length === 1, 'el borrado en Firestore');
  await until(async () => (await visibleRows()).length === 1, 'la lista sin el presupuesto borrado');
  check('admin: al confirmar, el presupuesto se borra de Firestore y de la lista', true);

  await clickText(page, '.admin-tab', 'Productos');
  const products = await text(page, '.admin-products');
  check('admin: productos en solo lectura, con los tres del catálogo', ['Sillón BKF Premium', 'Banco BKF', 'Base de Mesa Flat'].every((n) => products.includes(n)) && !(await page.$('.admin-products input, .admin-products textarea')));

  // ===== 6. Panel: celular y sesión =====
  await page.setViewport({ width: 360, height: 760 }); // sin isMobile: cambiarlo recarga la página
  await clickText(page, '.admin-tab', 'Consultas');
  await wait(300);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check('admin: a 360 px no hay desborde horizontal', overflow <= 1, `sobran ${overflow} px`);
  await page.click('.admin-leads .admin-row');
  await page.waitForSelector('#lead-estado', { visible: true });
  const dialogFits = await page.$eval('dialog[open] .admin-dialog', (d) => d.getBoundingClientRect().right <= window.innerWidth + 1);
  check('admin: a 360 px el detalle entra en la pantalla', dialogFits);
  await page.keyboard.press('Escape');

  const other = await open('/admin');
  await other.waitForSelector('#admin-email');
  check('admin: la sesión no pasa a otra pestaña (dura lo que dura la pestaña)', true);
  await other.close();

  await page.setViewport({ width: 1280, height: 900 });
  await clickText(page, 'button', 'Cerrar sesión');
  await page.waitForSelector('#admin-email');
  check('admin: después de cerrar sesión no queda ningún dato en pantalla', !(await text(page)).includes('Ana Prueba'));

  check('sin errores de JavaScript en todo el recorrido', consoleErrors.length === 0, consoleErrors.join(' / '));
} catch (err) {
  check(`el recorrido se interrumpió: ${err.message}`, false);
  for (const p of await browser.pages()) console.log('  pantalla al fallar:', (await p.evaluate(() => document.querySelector('main')?.innerText ?? '').catch(() => '')).replace(/\s+/g, ' ').slice(0, 300));
} finally {
  await browser.close();
  server.kill();
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  rmSync(new URL('../../dist-e2e', import.meta.url), { recursive: true, force: true });
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length} de ${results.length} comprobaciones correctas.`);
  if (failed.length) exitCode = 1;
}
process.exit(exitCode);
