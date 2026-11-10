import { defineConfig } from 'vite';

export default defineConfig({
  // Garante que os assets sejam gerados com caminhos relativos (./assets/...)
  // essencial para funcionar perfeitamente no GitHub Pages
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
