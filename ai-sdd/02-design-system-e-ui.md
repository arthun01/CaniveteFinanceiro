# 🎨 02 — Design System, Tokens Visuais & Padrões de Interface

> **Objetivo:** Documentar com precisão cirúrgica a linguagem visual do projeto, tokens de cor, tipografia, dark mode, componentes de UI e comportamento responsivo para garantir identidade uniforme em todas as telas.

---

## 1. 🌈 Paleta de Cores e Tokens (`src/styles/tokens.css`)

A identidade visual utiliza tons de verde floresta, acentos em verde-limão vibrante, fundos limpos e alto contraste tanto no Light quanto no Dark Mode.

### Tokens no Modo Claro (Default):
```css
:root {
  /* Cores Principais de Marca */
  --green: #183f35;             /* Verde floresta profundo (marca, títulos, botões primários) */
  --green-hover: #123028;       /* Hover de botões primários */
  --green-soft: #eff4e7;        /* Pílulas ativas, badges e destaques leves */
  --green-subtle: #f0f4e9;      /* Fundos de ícones e chips */

  /* Cores de Acento */
  --lime: #d7f58b;              /* Verde-limão vivo (acento, chips de alta visibilidade) */
  --lime-dark: #87aa65;         /* Status ativo e bordas de foco */
  --lime-chip: rgba(215, 245, 139, 0.25);

  /* Superfícies & Fundos */
  --bg: #f7f8f2;                /* Fundo principal da página (off-white esverdeado quente) */
  --card-bg: #ffffff;           /* Fundo dos cards brancos padrão */
  --card-bg-subtle: #f0f4e9;    /* Cards secundários / informativos */
  --card-bg-daily: #eef2e5;     /* Cards de destaque e destaques de formulário */

  /* Tipografia & Linhas */
  --ink: #203c33;               /* Cor do texto principal de leitura (quase preto floresta) */
  --muted: #69756c;             /* Texto de apoio, labels, legendas e metadados */
  --line: #e4e8df;              /* Bordas padrão de cards e inputs */
  --line-subtle: #f0f1eb;       /* Divisores sutis em listas e tabelas */

  /* Feedback & Estados */
  --red: #ad493a;               /* Erro, alerta e saídas financeiras */
  --red-bg: #fbefeb;            /* Fundo suave para erros */
  --positive: #3c7254;          /* Ganhos, juros positivos e metas batidas */
}
```

### Tokens no Modo Escuro (`[data-theme="dark"]`):
```css
[data-theme="dark"] {
  --green: #23584a;
  --green-hover: #1a4539;
  --green-soft: rgba(215, 245, 139, 0.12);
  --green-subtle: #192a24;

  --lime: #d7f58b;
  --lime-dark: #a2cd6b;
  --lime-chip: rgba(215, 245, 139, 0.18);

  --bg: #0c1512;                /* Fundo ultra-escuro esverdeado */
  --card-bg: #14221d;           /* Cards escuros de alto contraste */
  --card-bg-subtle: #192a24;
  --card-bg-daily: #172722;

  --ink: #f0f7f3;               /* Texto claro com excelente legibilidade */
  --muted: #8b9f94;             /* Texto auxiliar atenuado */
  --line: #22372f;
  --line-subtle: #1a2c25;

  --red: #f87171;
  --red-bg: rgba(248, 113, 113, 0.15);
  --positive: #4ade80;          /* Verde neon suave para resultados positivos */
}
```

---

## 2. 🔤 Tipografia Oficial

O projeto utiliza duas fontes do Google Fonts importadas globalmente:
- **Display / Títulos:** `'Manrope', sans-serif` (Pesos: `600`, `700`, `750`, `800`)
  - Uso: Logo (`CaniveteFinanceiro`), cabeçalhos `h1`, `h2`, `h3`, números de KPIs (`.stat strong`), títulos de modais.
- **Corpo / UI:** `'DM Sans', sans-serif` (Pesos: `400`, `500`, `600`, `700`)
  - Uso: Texto corrido, labels de formulários, inputs, botões, células de tabelas, dicas e rodapé.

```css
--font-sans: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-display: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

---

## 3. 🧩 Componentes de Interface Padrão

### 3.1 Cartão de Formulário (`.calculator-form-card`)
Container principal dos inputs da simulação:
- Borda: `1px solid var(--line)`
- Raio: `22px` (`var(--radius-xl)`)
- Fundo: `var(--card-bg)`
- Sombra: `var(--shadow-md)`

### 3.2 Campos de Entrada e Labels (`.form-group`, `label`, `input`)
- **Label:** `font-size: 13px`, `font-weight: 600`, `color: var(--ink)`.
- **Input:**
  - `min-height: 48px;`
  - `border: 1px solid var(--line);`
  - `border-radius: 12px;`
  - `background: var(--bg);`
  - `padding: 0 16px;`
  - `font-size: 15px;`
  - `color: var(--ink);`
  - Foco: `outline: 3px solid var(--lime-dark); outline-offset: 1px;`

### 3.3 Segmented Control (`.seg`)
Alternador de opções estilo iOS (ex: Mês vs Ano, CLT vs Servidor vs MEI):
```html
<div class="seg" role="group">
  <button type="button" class="active" data-val="meses">Mensal</button>
  <button type="button" data-val="anos">Anual</button>
</div>
```
- Fundo do container: `#ebeee5` (modo claro) / `#192a24` (modo escuro).
- Botão ativo: fundo branco puro no modo claro / `--green` no escuro com sombra sutil e texto em negrito.

### 3.4 Botões Principais (`.btn`)
- **Primário (`.btn-primary`):**  
  `background: var(--green); color: white; border-radius: 12px; font-weight: 600; min-height: 48px;`
  Hover: ligeiramente mais escuro e sutil elevação.
- **Secundário / Limpar (`.btn-secondary`):**  
  `background: transparent; border: 1px solid var(--line); color: var(--muted);`
- **Apoie (`.btn-donate`):**  
  Badge elegante com ícone de coração/apoio, fundo suave rosado/esmeralda e transição rápida.

### 3.5 Cards de KPI / Resultados (`.stat` / `.stat-card`)
Exibição dos valores calculados:
- Ícone em container arredondado (`.stat-icon`) com fundo suave (`var(--green-soft)`).
- Rótulo superior (`.stat-label`): `font-size: 12px; color: var(--muted); text-transform: uppercase;`.
- Valor numérico destacado (`strong`): `font-family: var(--font-display); font-size: 24px; font-weight: 750;`.
- Subtexto (`small`): `font-size: 11px; color: var(--muted);`.

### 3.6 Tabelas de Auditoria e Evolução (`.evolution-table`, `.breakdown-table`)
- Envolvidas em container `.table-wrapper` com `overflow-x: auto;` e `-webkit-overflow-scrolling: touch;`.
- Cabeçalhos `th`: `position: sticky; top: 0; background: var(--bg); text-transform: uppercase; font-size: 11px;`.
- Células `td`: `font-variant-numeric: tabular-nums;` para que números monetários alinhem perfeitamente por dígito.
- Primeira coluna alinhada à esquerda; colunas numéricas alinhadas à direita.

### 3.7 Modal "Apoie o Projeto" (`dialog.donate-dialog`)
- Elemento nativo `<dialog id="donate-dialog" class="donate-dialog">`.
- Largura máxima de `520px` e largura mobile `calc(100vw - 24px)` com `border-radius: 18px`.
- Altura máxima com viewport dinâmico: `max-height: 90dvh; overflow-y: auto; overscroll-behavior: contain;`.
- Backdrop com desfoque: `background: rgba(16, 45, 40, 0.55); backdrop-filter: blur(6px);`.
- Fechamento nativo por clique no backdrop ou tecla ESC via script unificado `navbar.ts`.

---

## 4. 📱 Estratégia de Responsividade (Mobile-First)

Os breakpoints oficiais em `src/styles/responsive.css`:
- **Desktop Amplo (`> 1024px`):** Grids de 2 colunas (Formulário à esquerda, Resultados e Gráficos à direita).
- **Tablet (`<= 1024px` e `> 768px`):** Layouts em coluna única para formulários mais complexos com gráficos reposicionados abaixo.
- **Mobile (`<= 768px`):**
  - Links do header recolhidos no menu gaveta (hambúrguer).
  - Cards de formulário com padding reduzido para `20px 16px`.
  - Tabelas ganham suporte a rolagem horizontal suave (`overscroll-behavior-x: contain`).
- **Small Mobile (`<= 480px`):**
  - Textos de inputs com fonte `14px` (evita zoom automático no iOS Safari).
  - Redução proporcional de badges, títulos de modais e botões empilhados onde necessário.
