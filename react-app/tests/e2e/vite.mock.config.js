// Build de prueba con el backend SIMULADO (npm run test:e2e:mock): es el vite.config.js del
// sitio más un plugin que cambia tres módulos por los de tests/e2e/fakes/. El código del
// sitio no sabe que existe este modo.
import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig } from 'vite';
import baseConfig from '../../vite.config.js';

const fake = (name) => fileURLToPath(new URL(`./fakes/${name}`, import.meta.url));

function fakeFirebase() {
  return {
    name: 'fake-firebase',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      if (source === 'firebase/auth') return fake('firebase-auth.js');
      if (!importer || importer.includes('/tests/e2e/fakes/') || importer.includes('\\tests\\e2e\\fakes\\')) return null;
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
      const id = resolved?.id.replace(/\\/g, '/') ?? '';
      if (id.endsWith('/src/lib/firebase.js')) return fake('firebase.js');
      if (id.endsWith('/src/lib/firedb.js')) return fake('firedb.js');
      return null;
    },
  };
}

export default defineConfig((env) => {
  const base = mergeConfig(baseConfig(env), { plugins: [fakeFirebase()] });
  // El chunk manual de Firebase no aplica: en este build el SDK no entra.
  if (base.build?.rollupOptions?.output) delete base.build.rollupOptions.output.manualChunks;
  return base;
});
