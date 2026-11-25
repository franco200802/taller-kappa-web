// Requiere npm run build. Usar CHROME_PATH si Chromium no está en la ruta habitual.
// Comprueba que el build servido en local NO descarga Google Analytics (las pruebas y Lighthouse
// ensuciaban GA4) y que con el dominio publicado sí lo pide. Ningún pedido sale a Google: se aborta.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import puppeteer from 'puppeteer-core';
import { preview } from 'vite';

const GA_SCRIPT = 'https://www.googletagmanager.com/gtag/js';

test('GA4 solo se carga en el dominio publicado', async (t) => {
  const executablePath = process.env.CHROME_PATH ?? [
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].find(existsSync);
  assert.ok(executablePath, 'Definí CHROME_PATH con la ruta a Chromium o Chrome');

  // allowedHosts: sin esto, vite preview responde 403 a un Host que no es local.
  const server = await preview({ preview: { host: '127.0.0.1', port: 0, allowedHosts: ['tallerkappa.com.ar'] } });
  t.after(() => new Promise((resolve, reject) => {
    server.httpServer.closeAllConnections?.(); // si no, el keep-alive de Chrome demora el cierre ~2 min
    server.httpServer.close((err) => (err ? reject(err) : resolve()));
  }));
  const port = server.httpServer.address().port;

  // El dominio publicado resuelve al servidor local: la página cree estar en tallerkappa.com.ar.
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    // Sin HTTPS-First: el servidor local solo habla http.
    args: ['--no-sandbox', `--host-resolver-rules=MAP tallerkappa.com.ar 127.0.0.1:${port}`, '--disable-features=HttpsUpgrades,HttpsFirstBalancedModeAutoEnable'],
  });
  t.after(() => browser.close());

  // Abre una ficha y espera lo que tardaría gtag.js en pedirse sin interacción (3 s después del load).
  async function gaRequestsAt(origin) {
    const page = await browser.newPage();
    const asked = [];
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const url = request.url();
      if (url.startsWith(GA_SCRIPT)) asked.push(url);
      if (url.startsWith(origin + '/')) request.continue();
      else request.abort();
    });
    await page.goto(`${origin}/sillon-bkf/`, { waitUntil: 'load' });
    assert.ok(await page.$('h1'), `${origin} no sirvió la ficha`);
    const deadline = Date.now() + 5000;
    while (!asked.length && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 200));
    const hasQueue = await page.evaluate(() => typeof window.gtag === 'function');
    await page.close();
    return { asked, hasQueue };
  }

  await t.test('en 127.0.0.1 no se define gtag ni se pide el script', async () => {
    const { asked, hasQueue } = await gaRequestsAt(`http://127.0.0.1:${port}`);
    assert.equal(hasQueue, false);
    assert.deepEqual(asked, []);
  });

  await t.test('en tallerkappa.com.ar se define gtag y se pide el script', async () => {
    const { asked, hasQueue } = await gaRequestsAt('http://tallerkappa.com.ar');
    assert.equal(hasQueue, true);
    assert.equal(asked.length, 1);
    assert.match(asked[0], /id=G-2FDMN51XDY/);
  });

  // gtag.js está abortado, así que la cola (window.dataLayer) guarda todo lo que el sitio le pidió a GA4.
  await t.test('un page_view por navegación interna, con el título de la página nueva', async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.setRequestInterception(true);
    page.on('request', (request) => (request.url().startsWith('http://tallerkappa.com.ar/') ? request.continue() : request.abort()));
    const pageviews = () => page.evaluate(() => (window.dataLayer || [])
      .filter((call) => call[0] === 'event' && call[1] === 'page_view')
      .map((call) => ({ path: call[2].page_path, title: call[2].page_title })));
    await page.goto('http://tallerkappa.com.ar/', { waitUntil: 'load' });
    await page.waitForFunction(() => (window.dataLayer || []).some((call) => call[0] === 'event' && call[1] === 'page_view'));
    await page.click('a[href="/mobiliario-comercial/"]');
    await page.waitForFunction(() => (window.dataLayer || []).filter((call) => call[0] === 'event' && call[1] === 'page_view').length >= 2);
    await new Promise((resolve) => setTimeout(resolve, 500)); // por si llegara un tercero
    const views = await pageviews();
    const title = await page.title();
    await page.close();
    assert.equal(views.length, 2, JSON.stringify(views));
    assert.equal(views[0].path, '/');
    assert.equal(views[1].path, '/mobiliario-comercial/');
    assert.match(title, /Mobiliario Comercial/);
    assert.equal(views[1].title, title, 'el page_view lleva el título de la página nueva, no el de la anterior');
  });
});
