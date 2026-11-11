# 🚀 03 — Guia Passo a Passo para Criar Novas Features

> **Playbook Operacional para Agentes de IA e Desenvolvedores.**  
> Siga rigorosamente este checklist de 10 passos para implementar uma nova calculadora ou simulador em tempo recorde sem quebrar a consistência da plataforma.

---

## 📋 Checklist de Execução

```markdown
- [ ] 1. Definir Modelo e Tipos (`src/types/<feature>.ts`)
- [ ] 2. Implementar Motor Matemático Puro (`src/services/<feature>Calculator.ts`)
- [ ] 3. Criar a Página HTML (`<feature-slug>/index.html`)
- [ ] 4. Registrar a Página no Bundler (`vite.config.ts`)
- [ ] 5. Criar o Controlador de Tela (`src/<feature>Main.ts`)
- [ ] 6. (Opcional) Implementar Gráficos Chart.js (`src/charts/<feature>ChartManager.ts`)
- [ ] 7. Sincronizar o Navbar em Todas as Páginas Existentes
- [ ] 8. Adicionar o Card de Acesso no Portal (`index.html`)
- [ ] 9. Testar Responsividade e Dark Mode
- [ ] 10. Validar Build e Tipagem (`npm run build`)
```

---

## Passo 1: Definir Modelo e Tipos (`src/types/<feature>.ts`)
Crie a interface que define os inputs e outputs financeiros.

```typescript
// Exemplo: src/types/financiamento.ts
export interface FinanciamentoInput {
  valorImovel: number;
  valorEntrada: number;
  taxaJurosAnual: number;
  prazoMeses: number;
  sistemaAmortizacao: 'SAC' | 'PRICE';
}

export interface ParcelaFinanciamento {
  mes: number;
  parcela: number;
  amortizacao: number;
  juros: number;
  saldoDevedor: number;
}

export interface FinanciamentoResult {
  totalPago: number;
  totalJuros: number;
  primeiraParcela: number;
  ultimaParcela: number;
  cronograma: ParcelaFinanciamento[];
}
```

---

## Passo 2: Implementar Motor Matemático Puro (`src/services/<feature>Calculator.ts`)
**Regra de Ouro:** Este arquivo não pode importar nada de DOM (`document`, `window`, etc.). Deve conter apenas funções matemáticas puras com fórmulas auditáveis.

```typescript
// Exemplo: src/services/financiamentoCalculator.ts
import { FinanciamentoInput, FinanciamentoResult } from '../types/financiamento';

export function calcularFinanciamento(input: FinanciamentoInput): FinanciamentoResult {
  const saldoInicial = input.valorImovel - input.valorEntrada;
  // ... cálculos puramente matemáticos ...
  return {
    totalPago,
    totalJuros,
    primeiraParcela,
    ultimaParcela,
    cronograma,
  };
}
```

---

## Passo 3: Criar a Página HTML (`<feature-slug>/index.html`)
Crie a pasta na raiz do projeto (ex: `financiamento-imobiliario/index.html`).
Copie a casca semântica de uma página existente (ex: `reserva-emergencia/index.html`):
1. **Head:** Meta tags SEO, title, link para fonts (`DM Sans` e `Manrope`) e CSS (`../src/styles/...`).
2. **Navbar:** Header padrão com logo, links de navegação, badge "Apoie", toggle dark mode e menu mobile.
3. **Hero:** Título principal, subtítulo explicativo e tags contextuais.
4. **Grid Principal:**
   - Coluna 1: `.calculator-form-card` com inputs e botões (Calcular / Limpar).
   - Coluna 2: Cards de KPI (`.stat`), gráficos (se aplicável) e tabela de amortização.
5. **Seção Didática:** Explicação de como a fórmula funciona, dicas financeiras e alertas legais.
6. **Footer:** Rodapé unificado com o link para "Conheça o Saldo ©" e créditos ao autor.
7. **Modal Apoie:** Tag `<dialog id="donate-dialog" class="donate-dialog">` no final do body.
8. **Script:** `<script type="module" src="../src/<feature>Main.ts"></script>`.

---

## Passo 4: Registrar no Bundler (`vite.config.ts`)
Abra `vite.config.ts` e inclua o novo ponto de entrada:

```typescript
// vite.config.ts
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        juros: resolve(__dirname, 'juros-compostos/index.html'),
        reserva: resolve(__dirname, 'reserva-emergencia/index.html'),
        ir: resolve(__dirname, 'imposto-de-renda/index.html'),
        // Adicione aqui:
        financiamento: resolve(__dirname, 'financiamento-imobiliario/index.html'),
      },
    },
  },
});
```

---

## Passo 5: Criar o Controlador de Tela (`src/<feature>Main.ts`)
Conecta os eventos da página ao motor matemático:
1. Importe `initNavbar` de `./utils/navbar`.
2. Importe formatadores de `./utils/formatters` (`formatCurrency`, `parseCurrency`, etc.).
3. Aplique máscaras de digitação em tempo real em inputs monetários.
4. Execute o cálculo inicial com dados de exemplo pré-preenchidos.
5. Adicione listener de `submit` ou `click` no botão Calcular para atualizar a tela.
6. Adicione listener no botão Limpar para restaurar os campos.

---

## Passo 6: Gráficos Chart.js (Se Aplicável)
Se a ferramenta incluir gráficos:
- Crie `src/charts/<feature>ChartManager.ts`.
- Mantenha referência da instância do gráfico e chame `.destroy()` antes de recriar.
- Leia cores dinamicamente das variáveis CSS ou use o helper de tema para atualizar quando o usuário alternar Dark/Light mode.

---

## Passo 7: Sincronizar o Navbar em Todas as Páginas
Atualize o menu desktop e o menu gaveta mobile em:
1. `index.html` (Portal)
2. `juros-compostos/index.html`
3. `reserva-emergencia/index.html`
4. `imposto-de-renda/index.html`
5. A nova página recém-criada

Garanta que a classe `.active` esteja aplicada apenas no link da página atual.

---

## Passo 8: Adicionar o Card no Portal (`index.html`)
Insira o novo cartão de acesso no grid de ferramentas do portal (`.portal-tools-grid`):
- Ícone temático representativo.
- Título claro da ferramenta.
- Breve descrição de valor para o usuário.
- Pílula/Badge de categoria (ex: "Crédito & Imóveis", "Planejamento").
- Link para a pasta da ferramenta.

---

## Passo 9: Verificação de UI & Responsividade
Teste os seguintes cenários:
- [ ] Telas de celular estreito (360px a 390px): nada transborda horizontalmente (`overflow-x`).
- [ ] Dark Mode: contraste de textos legível e fundo escuro coerente (`#0c1512` / `#14221d`).
- [ ] Modal Apoie: abre corretamente via botão da navbar e do menu mobile.
- [ ] Chave Pix: botão "Copiar" copia com sucesso e altera o texto para "Copiado! ✓".

---

## Passo 10: Validar Build e Tipagem
Rode no terminal:
```bash
npm run build
```
Certifique-se de que o comando `tsc && vite build` termine com **código 0** e todos os arquivos HTML e JS sejam gerados em `dist/`.
