// Requiere npm run build. Usar CHROME_PATH si Chromium no está en la ruta habitual.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import puppeteer from 'puppeteer-core';
import { preview } from 'vite';

test('contacto y presupuesto en el build de producción', async (t) => {
  const executablePath = process.env.CHROME_PATH ?? [
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].find(existsSync);
  assert.ok(executablePath, 'Definí CHROME_PATH con la ruta a Chromium o Chrome');

  const server = await preview({ preview: { host: '127.0.0.1', port: 0 } });
  t.after(() => new Promise((resolve, reject) =>
    server.httpServer.close((err) => err ? reject(err) : resolve())));
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
  t.after(() => browser.close());
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 740, isMobile: true, hasTouch: true });
  await page.evaluateOnNewDocument(() => {
    window.open = (url) => {
      if (url === '') {
        return { document: { write: (html) => { window.printedQuote = html; }, close() {} } };
      }
      window.attemptedWhatsApp = url;
      return null;
    };
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        async writeText(text) {
          if (window.denyClipboard) throw new Error('Portapapeles denegado');
          window.copiedQuote = text;
        },
      },
    });
    document.addEventListener('click', (event) => {
      const link = event.target.closest?.('a[href^="https://wa.me/"]');
      if (link) {
        event.preventDefault();
        window.clickedWhatsApp = link.href;
      }
    });
  });
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (request.url().startsWith(origin + '/')) request.continue();
    else request.abort();
  });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  const go = (path) => page.goto(origin + path, { waitUntil: 'networkidle0' });
  const messageIn = (href) => new URL(href).searchParams.get('text');
  const contactForm = '#contact-form';
  const drawer = '.cart-overlay[open]';
  const catalogModal = '.modal[open]';
  const ficha = '.bkf-product-section';
  const choose = (scope, group, option) => page.click(`${scope} [aria-label="${group}"] [role="radio"]${option}`);
  const isDisabled = (selector) => page.$eval(selector, (button) => button.disabled);

  await t.test('el contacto conserva los campos si se bloquea WhatsApp y ofrece un enlace equivalente', async () => {
    await go('/contacto/');
    await page.type('#contact-name', 'Ana Prueba');
    await page.select('#contact-interest', 'Base de Mesa');
    await page.type('#contact-zone', 'San Martín');
    await page.type('#contact-message', '¿Pueden cotizar 2 bases?');
    await page.click(`${contactForm} button[type="submit"]`);
    const retry = `${contactForm} [data-cta="contacto_form_enlace"]`;
    await page.waitForSelector(retry, { visible: true });
    const href = await page.$eval(retry, (link) => link.href);
    assert.equal(href, await page.evaluate(() => window.attemptedWhatsApp));
    assert.equal(messageIn(href), 'Hola, soy Ana Prueba.\nMe interesa: Base de Mesa\nZona de entrega: San Martín\n\n¿Pueden cotizar 2 bases?');
    assert.equal(await page.$eval('#contact-name', (input) => input.value), 'Ana Prueba');
    assert.equal(await page.$eval('#contact-interest', (input) => input.value), 'Base de Mesa');
    assert.equal(await page.$eval('#contact-zone', (input) => input.value), 'San Martín');
    assert.equal(await page.$eval('#contact-message', (input) => input.value), '¿Pueden cotizar 2 bases?');
    assert.doesNotMatch(await page.$eval('body', (body) => body.innerText), /Se abrió WhatsApp/);
    await page.click(retry);
    assert.equal(await page.evaluate(() => window.clickedWhatsApp), href);
    await page.type('#contact-message', ' Gracias.');
    await page.waitForSelector(retry, { hidden: true });
  });

  await t.test('Base Flat requiere dos medidas y conserva variantes separadas por acabado al recargar', async () => {
    await go('/catalogo/');
    await page.click('.btn-add-cart[aria-haspopup="dialog"]');
    const catalogAdd = `${catalogModal} .modal-info > .btn-main`;
    await page.waitForSelector(catalogAdd, { visible: true });
    assert.equal(await isDisabled(catalogAdd), true);
    assert.equal(await page.$eval('.cart-icon-container', (button) => button.getAttribute('aria-label')), 'Abrir presupuesto');
    await choose(catalogModal, 'Acabado de la estructura', '[aria-label="Cromado"]');
    await choose(catalogModal, 'Altura de la base', ':last-child');
    assert.equal(await isDisabled(catalogAdd), true);
    await choose(catalogModal, 'Diámetro de la columna', ':last-child');
    await page.click(catalogAdd);
    await page.waitForSelector(catalogModal, { hidden: true });
    await page.waitForFunction(() => JSON.parse(sessionStorage.getItem('kappa-cart')).length === 1);

    await go('/catalogo/base-de-mesa-flat/');
    const fichaAdd = `${ficha} .bkf-actions .btn-main`;
    assert.equal(await isDisabled(fichaAdd), true);
    await choose(ficha, 'Diámetro de la columna', ':first-child');
    assert.equal(await isDisabled(fichaAdd), true);
    await choose(ficha, 'Altura de la base', ':first-child');
    assert.match(await page.$eval(`${ficha} figcaption`, (caption) => caption.textContent), /73 cm de alto, columna de 77 mm/);
    await page.click(fichaAdd);
    await page.click(fichaAdd);
    await page.waitForFunction(() => JSON.parse(sessionStorage.getItem('kappa-cart'))[1]?.qty === 2);
    await choose(ficha, 'Acabado de la estructura', '[aria-label="Cromado"]');
    await page.click(fichaAdd);
    await page.waitForFunction(() => JSON.parse(sessionStorage.getItem('kappa-cart')).length === 3);
    await page.reload({ waitUntil: 'networkidle0' });
    await page.click('.cart-icon-container');
    await page.waitForSelector(drawer, { visible: true });
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.cart-sidebar')).transform === 'none');
    assert.equal((await page.$$(`${drawer} .cart-item`)).length, 3);
    await page.type('#quote-zone', 'San Martín');
    const checkout = `${drawer} .btn-whatsapp-checkout`;
    const whatsappMessage = messageIn(await page.$eval(checkout, (link) => link.href));
    assert.match(whatsappMessage, /1 unidad - Variante: Cromado, Barra \(105 cm\), columna de 101 mm/);
    assert.match(whatsappMessage, /2 unidades - Variante: Negro Mate, Mesa \(73 cm\), columna de 77 mm/);
    assert.match(whatsappMessage, /1 unidad - Variante: Cromado, Mesa \(73 cm\), columna de 77 mm/);
    assert.match(whatsappMessage, /Zona de entrega: San Martín/);

    const copy = `${drawer} .cart-secondary-actions button:first-child`;
    await page.click(copy);
    await page.waitForFunction(() => window.copiedQuote);
    assert.equal(await page.evaluate(() => window.copiedQuote), whatsappMessage);
    await page.evaluate(() => { window.denyClipboard = true; });
    await page.click(copy);
    await page.waitForSelector('#quote-message', { visible: true });
    assert.equal(await page.$eval('#quote-message', (field) => field.value), whatsappMessage);
    assert.equal(await page.$eval('#quote-message', (field) => field.selectionEnd - field.selectionStart), whatsappMessage.length);
    assert.equal(messageIn(await page.$eval('[data-cta="presupuesto_chat"]', (link) => link.href)), null);
    await page.click(checkout);
    assert.equal(messageIn(await page.evaluate(() => window.clickedWhatsApp)), whatsappMessage);
    assert.equal((await page.$$(`${drawer} .cart-item`)).length, 3);
    await page.click(`${drawer} .cart-secondary-actions button:last-child`);
    const pdf = await page.evaluate(() => window.printedQuote);
    assert.match(pdf, /Cromado, Barra \(105 cm\), columna de 101 mm/);
    assert.match(pdf, /Negro Mate, Mesa \(73 cm\), columna de 77 mm/);
    const layout = await page.$eval(drawer, (dialog) =>
      [dialog, ...dialog.querySelectorAll('.cart-sidebar, .cart-items, #cart-footer, .cart-secondary-actions')]
        .map((element) => ({ element: element.id || element.className, width: element.clientWidth, content: element.scrollWidth })));
    for (const { element, width, content } of layout) {
      assert.ok(content <= width, `${element}: ${content}px de contenido en ${width}px disponibles`);
    }
    await page.setViewport({ width: 320, height: 568, isMobile: true, hasTouch: true });
    await page.click(copy);
    await page.waitForFunction(() => {
      const field = document.querySelector('#quote-message');
      const header = document.querySelector('.cart-header').getBoundingClientRect();
      const bounds = field.getBoundingClientRect();
      return document.activeElement === field && bounds.top >= header.bottom && bounds.bottom <= innerHeight;
    });
    await page.setViewport({ width: 360, height: 740, isMobile: true, hasTouch: true });
  });

  await t.test('el showroom también exige medidas y mantiene los acabados', async () => {
    await go('/catalogo/base-de-mesa-flat/');
    const showroom = 'section[aria-labelledby="base-3d"]';
    const showroomAdd = `${showroom} .bkf-stage-actions .btn-main`;
    assert.equal(await isDisabled(showroomAdd), true);
    await choose(showroom, 'Altura de la base', ':last-child');
    assert.equal(await isDisabled(showroomAdd), true);
    await choose(showroom, 'Diámetro de la columna', ':first-child');
    await page.click(showroomAdd);
    await page.waitForFunction(() => JSON.parse(sessionStorage.getItem('kappa-cart'))
      .some((line) => line.color === 'Negro Mate, Barra (105 cm), columna de 77 mm'));
  });

  assert.deepEqual(pageErrors, []);
});
