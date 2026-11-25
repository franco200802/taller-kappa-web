// Pruebas de la guarda de GA4: solo el dominio publicado manda datos (no localhost, ni previews).
// Correr: npm run test:unit
import test from 'node:test';
import assert from 'node:assert/strict';
import { isProductionHost } from '../../src/lib/analytics.js';

test('isProductionHost acepta el dominio publicado, con y sin www', () => {
  assert.equal(isProductionHost('tallerkappa.com.ar'), true);
  assert.equal(isProductionHost('www.tallerkappa.com.ar'), true);
  assert.equal(isProductionHost('TallerKappa.com.ar'), true);
});

test('isProductionHost rechaza los hosts de pruebas y previews que ensuciaban GA4', () => {
  for (const host of ['localhost', '127.0.0.1', '[::1]', '192.168.0.10', 'franco200802.github.io', 'tallerkappa.com.ar.evil.test', '', undefined, null]) {
    assert.equal(isProductionHost(host), false, String(host));
  }
});
