import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Config pensada para que el bundle final sea lo más liviano posible:
// - code-splitting automático por ruta (React.lazy en App.jsx)
// - manualChunks separa vendor pesado (firebase, animejs) del código propio
//   así el navegador cachea esas libs aunque tu código cambie seguido
//
// `isSsrBuild` distingue el build del navegador del build de prerender:
// en SSR todo se empaqueta en un único archivo para Node, así que
// manualChunks no aplica (Rollup lo rechaza junto a inlineDynamicImports).
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
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
              animejs: ['animejs'],
            },
          },
        },
  },
  server: {
    port: 8888,
  },
}));
