# 💻 04 — Padrões de Código, Tipagem & Boas Práticas

> **Objetivo:** Estabelecer os padrões técnicos de TypeScript, manipulação de dados monetários, ciclo de vida de componentes e acessibilidade.

---

## 1. 📐 Padrões TypeScript

### 1.1 Strict Mode & Tipos Explícitos
- O compilador está configurado com `strict: true`.
- **Proibido o uso de `any`:** Declare tipos estritos para entradas, saídas, eventos e estados.
- Use `type` ou `interface` para estruturas de dados e contratos de cálculo.
- Trate sempre elementos nulos do DOM usando tipagem correta:
  ```typescript
  const inputEl = document.getElementById('valor-input') as HTMLInputElement | null;
  if (!inputEl) return;
  ```

### 1.2 Imutabilidade em Funções de Cálculo
Os motores em `src/services/` devem sempre retornar novos objetos e arrays sem alterar parâmetros recebidos:
```typescript
// Correto:
export function simular(input: Readonly<SimulationInput>): SimulationResult {
  const cronograma: ReadonlyArray<MonthlyRecord> = [];
  // ...
  return { ...resultado, cronograma };
}
```

---

## 2. 💰 Tratamento de Valores Monetários & Moeda BRL

### 2.1 Ponto Flutuante vs Precisão Monetária
- Arredonde sempre os cálculos para 2 casas decimais no momento da geração dos registros tabulares e totais para evitar discrepâncias clássicas de ponto flutuante do JavaScript (`0.1 + 0.2 = 0.30000000000000004`).
- Utilize a função utilitária padrão `round2(val: number): number`:
  ```typescript
  export const round2 = (num: number): number => Math.round((num + Number.EPSILON) * 100) / 100;
  ```

### 2.2 Formatação Internacionalizada (`src/utils/formatters.ts`)
Toda exibição de valores em tela deve utilizar a API nativa `Intl.NumberFormat`:
```typescript
export const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(isNaN(value) ? 0 : value);
}
```

### 2.3 Sanitização de Inputs de Usuário (`parseCurrency`)
Nunca confie em `parseFloat(el.value)` direto em campos com máscara `R$`:
```typescript
export function parseCurrency(str: string): number {
  if (!str) return 0;
  // Remove R$, espaços, pontos de milhar e substitui vírgula decimal por ponto
  const clean = str.replace(/[R$\s.]/g, '').replace(',', '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}
```

---

## 3. 📊 Ciclo de Vida do Chart.js

Ao atualizar gráficos em resposta a novas entradas do usuário:
1. **Destruição Prévia Obrigatória:** Sempre chame `.destroy()` na instância existente antes de instanciar um novo `new Chart()`, caso contrário ocorrerão vazamentos de memória e sobreposições visuais com flickering de canvas.
2. **Design Tokens Dinâmicos:** Ao desenhar o gráfico, busque as cores das variáveis CSS ativas no momento (`getComputedStyle(document.documentElement).getPropertyValue('--green')`) para que os gráficos respeitem automaticamente trocas de tema entre Light e Dark Mode.

Exemplo de padrão seguro:
```typescript
export class FeatureChartManager {
  private chartInstance: Chart | null = null;

  public render(data: ChartData) {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    const ctx = document.getElementById('myCanvas') as HTMLCanvasElement;
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: { ... },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }
}
```

---

## 4. 🎭 Animações com GSAP

Utilize animações discretas e com propósito:
- **Odômetro Numérico:** Cards de KPI utilizam GSAP para tweening suave do valor 0 até o valor final formatado em BRL:
  ```typescript
  gsap.to(counterObj, {
    val: targetValue,
    duration: 0.8,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = formatCurrency(counterObj.val);
    }
  });
  ```
- **Acessibilidade (`prefers-reduced-motion`):** Sempre respeite a preferência de movimento reduzido do sistema operacional:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

---

## 5. ♿ Acessibilidade (A11y) & SEO

- **Rótulos de Formulário:** Todo `<input>` deve possuir seu respectivo `<label for="...">` ou `aria-label`.
- **Foco Visível:** Nunca remova o `:focus-visible` sem fornecer uma alternativa de alto contraste:
  ```css
  button:focus-visible,
  input:focus-visible,
  a:focus-visible {
    outline: 3px solid var(--lime-dark);
    outline-offset: 2px;
  }
  ```
- **Semântica HTML5:** Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>` e `<footer>`.
- **Tabelas Acessíveis:** Utilize `<thead>`, `<tbody>`, `<th scope="col">` e números tabulares (`font-variant-numeric: tabular-nums`).
