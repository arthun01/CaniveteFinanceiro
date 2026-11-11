# 🌐 Feature Spec — Portal, Navegação Unificada & Modal de Apoio

> **Rota:** `/` (Raiz do projeto: `index.html`)  
> **Arquivos:** `index.html`, `src/portalMain.ts`, `src/utils/navbar.ts`, `src/styles/components.css`.

---

## 1. 🎯 Objetivo da Funcionalidade
O Portal é o cartão de visitas e centro de controle do **CaniveteFinanceiro**. Ele apresenta a proposta de valor da suíte, lista os cards de acesso rápido a cada simulador, unifica a navegação entre todas as páginas e abriga o canal de contribuição comunitária (Chave Pix).

---

## 2. 🧭 Componentes Centrais

### 2.1 Barra de Navegação Unificada (`.navbar`)
Presente em **todas as páginas** do projeto (`index.html` e subpáginas):
1. **Logo CaniveteFinanceiro:**
   - Link para `/` com ícone de canivete/ferramenta e tipografia `Manrope` 800.
2. **Links de Navegação Desktop (`.nav-links`):**
   - Juros Compostos
   - Reserva de Emergência
   - Imposto de Renda
   - *(Novas calculadoras devem ser adicionadas aqui)*
3. **Ações da Direita (`.nav-actions`):**
   - Botão **Apoie** (`#open-donate-btn`, `.btn-donate`): badge suave com coração.
   - Alternador **Dark/Light Mode** (`#theme-toggle-btn`): alterna `data-theme="dark"` no elemento `<html>` e persiste no `localStorage`.
   - Botão **Menu Hambúrguer** (`#hamburger-btn`): visível apenas no mobile (`<= 768px`).

### 2.2 Menu Gaveta Mobile (`.mobile-menu`)
- Drawer deslizante que lista todas as ferramentas, atalho para apoiar o projeto e link externo.
- Fecha automaticamente ao clicar em qualquer link interno ou no backdrop.

### 2.3 Grid de Ferramentas do Portal (`.portal-tools-grid`)
Cards ricos no `index.html`:
- **Card Juros Compostos:** Ícone de crescimento exponencial, badge "Investimentos", resumo e link direto.
- **Card Reserva de Emergência:** Ícone de escudo, badge "Segurança Financeira", resumo e link direto.
- **Card Imposto de Renda:** Ícone de documento fiscal, badge "Tributos", resumo e link direto.

---

## 3. 💚 Modal "Apoie o Projeto" (`dialog.donate-dialog`)

Gerenciado globalmente em `src/utils/navbar.ts`:
- **Chave Pix Oficial:** `arthur.rv@gmail.com`
- **Funcionalidade Copiar:** Copia a chave via `navigator.clipboard.writeText` com fallback para `document.execCommand('copy')`.
- Altera o texto do botão de "Copiar" para "Copiado! ✓" por 2,5 segundos.
- Link direto para o repositório GitHub com estrela: `https://github.com/arthun01/calculadora_juros_compostos`.
- **Adaptação Mobile:** `width: calc(100vw - 24px)`, padding otimizado, sem quebra horizontal, fechamento com toque fora da caixa de diálogo.

---

## 4. 🌓 Gerenciamento de Tema (Dark / Light Mode)

Lógica em `src/utils/navbar.ts`:
```typescript
const THEME_KEY = 'canivete_theme';

export function initThemeToggle() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const current = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', current);

  // Toggle handler
  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
  });
}
```
Todas as páginas executam essa sincronização antes do primeiro render para evitar flash de estilo incorreto (*FOUC*).
