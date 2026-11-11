# 📈 Feature Spec — Calculadora de Juros Compostos

> **Origem:** Baseado em [`sources/ideia.md`](../sources/ideia.md) e [`sources/plano_de_criacao.md`](../sources/plano_de_criacao.md).  
> **Rota no Portal:** `/juros-compostos/`  
> **Arquivos:** `juros-compostos/index.html`, `src/main.ts`, `src/services/calculator.ts`, `src/charts/chartManager.ts`.

---

## 1. 🎯 Objetivo da Funcionalidade
Permitir que investidores simulem o crescimento exponencial do seu patrimônio através de juros compostos com valor inicial e aportes mensais recorrentes, visualizando a proporção entre capital próprio e rendimentos, além da evolução temporal detalhada.

---

## 2. 📥 Campos de Entrada (Inputs)

| Campo | Tipo | Unidade / Opções | Padrão | Validação |
| :--- | :--- | :--- | :--- | :--- |
| **Valor Inicial** | Moeda (R$) | Reais | R$ 5.000,00 | >= 0 |
| **Aporte Mensal** | Moeda (R$) | Reais | R$ 500,00 | >= 0 |
| **Taxa de Juros** | Numérico (%) | Anual (% a.a.) ou Mensal (% a.m.) | 10% a.a. | > 0 |
| **Período** | Inteiro | Anos ou Meses | 10 anos | >= 1 mês |

---

## 3. 🧮 Lógica Matemática & Fórmulas

### 3.1 Conversão de Taxa Anual para Mensal
Usa taxa equivalente composta (não linear):
$$i_{mensal} = (1 + i_{anual})^{\frac{1}{12}} - 1$$

### 3.2 Montante Final com Aportes Regulares
$$M = C \times (1 + i)^t + PMT \times \left[ \frac{(1 + i)^t - 1}{i} \right]$$
Onde:
- $C$ = Capital Inicial
- $PMT$ = Aporte Mensal recorrente
- $i$ = Taxa de juros mensal
- $t$ = Número de meses

### 3.3 Indicadores Chave (Outputs)
1. **Valor Total Investido:** $C + (PMT \times t)$
2. **Total Ganho em Juros:** $M - \text{Total Investido}$
3. **Valor Total Final (Montante):** $M$

---

## 4. 📊 Visualizações & Saídas

### 4.1 Cards de KPI
- 3 cards com contadores animados via GSAP (`Valor Total Final`, `Total Investido`, `Total em Juros`).

### 4.2 Gráficos (Chart.js)
1. **Gráfico de Rosca (Donut):**
   - Compara **Total Investido** (`#69756c`) vs **Total em Juros** (`#183f35`).
   - Mostra visualmente o "efeito bola de neve" onde os juros superam o capital investido em longos prazos.
2. **Gráfico de Barras Empilhadas:**
   - Eixo X: Meses ou Anos.
   - Eixo Y: Dinheiro acumulado em R$.
   - Fatias: Base azul/cinza (Investido) + Topo verde (Juros).

### 4.3 Tabela de Evolução Patrimonial
- Alternador de visão: **Mês a Mês** vs **Ano a Ano** (`.seg`).
- Colunas:
  1. `Mês` ou `Ano`
  2. `Juros do Período (R$)`
  3. `Total Investido (R$)`
  4. `Total Juros Acumulados (R$)`
  5. `Total Acumulado (R$)`
- Destaques visuais: juros com cor positiva (`var(--positive)`) e total final em verde (`var(--green)`).
