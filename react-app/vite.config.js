import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Config pensada para que el bundle final sea lo más liviano posible:
// - code-splitting automático por ruta (React.lazy en App.jsx)
// - manualChunks separa vendor pesado (firebase, animejs) del código propio
//   así el navegador cachea esas libs aunque tu código cambie seguido
export default defineConfig({
  plugins: [react()],
  base: '/', // GitHub Pages con dominio custom (CNAME) usa raíz
  build: {
    target: 'es2018',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
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
});
