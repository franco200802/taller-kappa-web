import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Config pensada para que el bundle final sea lo más liviano posible:
// - code-splitting automático por ruta (React.lazy en App.jsx)
// - manualChunks separa vendor pesado (firebase) del código propio
//   así el navegador cachea esas libs aunque tu código cambie seguido
//
// `isSsrBuild` distingue el build del navegador del build de prerender:
// en SSR todo se empaqueta en un único archivo para Node, así que
// manualChunks no aplica (Rollup lo rechaza junto a inlineDynamicImports).
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // El año del footer se fija al compilar: con new Date() en runtime, entre
  // el 1° de enero y el próximo deploy el HTML prerenderizado y el cliente
  // no coinciden y React descarta el HTML de toda la página al hidratar.
  define: { __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()) },
  base: '/', // GitHub Pages con dominio custom (CNAME) usa raíz
  // El SDK de Firebase 13 usa literales BigInt, que no existen en es2018. En vez de subir el
  // target de TODO el sitio (dejaría de transpilar `?.` y `??` para navegadores viejos), se le
  // dice a esbuild que deje pasar solo BigInt. Ese código vive en el chunk de Firebase, que se
  // descarga únicamente en /admin y al guardar la copia de una consulta: un navegador sin
  // BigInt (Safari < 14) navega el sitio y abre WhatsApp igual; solo no guarda la copia.
  esbuild: { supported: { bigint: true } },
  build: {
    target: 'es2018',
    sourcemap: false,
    cssCodeSplit: true,
    // El chunk de three.js (lib/bkf3d.js, ~580 kB / 144 kB gzip) supera el aviso por defecto de 500 kB. No afecta la
    // carga de ninguna página: se descarga solo cuando alguien toca "Ver en 3D" en /sillon-bkf/.
    chunkSizeWarningLimit: 600,
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              firebase: ['firebase/app', 'firebase/firestore/lite', 'firebase/auth'],
            },
          },
        },
  },
  server: {
    port: 8888,
  },
}));
