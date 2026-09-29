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
  build: {
    target: 'es2018',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
            },
          },
        },
  },
  server: {
    port: 8888,
  },
}));
