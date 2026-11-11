import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Garante caminhos relativos para funcionar no GitHub Pages (ex: ./assets/...)
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        jurosCompostos: resolve(__dirname, 'juros-compostos/index.html'),
        reservaEmergencia: resolve(__dirname, 'reserva-emergencia/index.html'),
      },
    },
  },
});
