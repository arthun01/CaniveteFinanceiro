import { resolve, relative } from 'path';
import { readFileSync, existsSync } from 'fs';
import { defineConfig, Plugin } from 'vite';

/**
 * Plugin Vite para Injeção de Partials HTML (Navbar, Footer, etc.)
 * Permite que cada página use <include-navbar /> e <include-footer />
 * resolvendo caminhos relativos ({{root}}) e destacando a página ativa automaticamente.
 */
function htmlPartialsPlugin(): Plugin {
  const partialsDir = resolve(__dirname, 'src/partials');

  return {
    name: 'vite-plugin-html-partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html: string, ctx: { path: string; filename?: string }) {
        const rawPath = ctx.path || (ctx.filename ? relative(__dirname, ctx.filename) : '/index.html');
        const normalized = rawPath.replace(/\\/g, '/').replace(/^\//, '');
        const segments = normalized.split('/').filter(Boolean);
        const depth = segments.length > 1 ? segments.length - 1 : 0;
        const root = depth === 0 ? '.' : Array(depth).fill('..').join('/');

        // Detecta a página ativa para aplicar a classe 'active' no link correto
        let activePage = 'home';
        if (normalized.includes('juros-compostos')) activePage = 'juros-compostos';
        else if (normalized.includes('reserva-emergencia')) activePage = 'reserva-emergencia';
        else if (normalized.includes('imposto-de-renda')) activePage = 'imposto-de-renda';
        else if (normalized.includes('fundos-imobiliarios')) activePage = 'fundos-imobiliarios';
        else if (normalized.includes('financiamento')) activePage = 'financiamento';

        function loadPartial(name: string): string {
          const file = resolve(partialsDir, `${name}.html`);
          if (!existsSync(file)) return `<!-- [Partial não encontrada: ${name}] -->`;
          let content = readFileSync(file, 'utf-8');

          // Substitui {{root}} pelo prefixo relativo adequado (ex: '.' para root ou '..' para subpastas)
          content = content.replace(/\{\{root\}\}/g, root);

          // Marca o item ativo
          content = content.replace(new RegExp(`\\{\\{active-${activePage}\\}\\}`, 'g'), 'active');
          content = content.replace(/\{\{active-[^}]+\}\}/g, '');

          return content;
        }

        // Suporta <include-navbar />, <include-footer /> ou <!-- @include navbar -->
        return html
          .replace(/<include-([a-zA-Z0-9_-]+)\s*\/?>/g, (_, name) => loadPartial(name))
          .replace(/<!--\s*@include\s+([a-zA-Z0-9_-]+)\s*-->/g, (_, name) => loadPartial(name));
      },
    },
    handleHotUpdate({ file, server }: any) {
      if (file.includes('src/partials')) {
        server.ws.send({ type: 'full-reload' });
      }
    },
  };
}

export default defineConfig({
  // Garante caminhos relativos para funcionar no GitHub Pages (ex: ./assets/...)
  base: './',
  plugins: [htmlPartialsPlugin()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        jurosCompostos: resolve(__dirname, 'juros-compostos/index.html'),
        reservaEmergencia: resolve(__dirname, 'reserva-emergencia/index.html'),
        impostoRenda: resolve(__dirname, 'imposto-de-renda/index.html'),
        fundosImobiliarios: resolve(__dirname, 'fundos-imobiliarios/index.html'),
        financiamento: resolve(__dirname, 'financiamento/index.html'),
      },
    },
  },
});
