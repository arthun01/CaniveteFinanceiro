# 🏦 Feature Spec — Financiamento com Prestações Fixas (Tabela Price)

> **Origem:** Baseado em [`sources/ideia-5.md`](../sources/ideia-5.md).  
> **Rota no Portal:** `/financiamento/`  
> **Arquivos:** `financiamento/index.html`, `src/financiamentoMain.ts`, `src/services/financiamentoCalculator.ts`, `src/charts/financiamentoChartManager.ts`, `src/types/financiamento.ts`.

---

## 1. 🎯 Objetivo da Funcionalidade
Recriar e aprimorar o clássico simulador de **Financiamento com Prestações Fixas** da **Calculadora do Cidadão do Banco Central do Brasil (BCB)**. 

A ferramenta permite ao usuário simular operações de crédito pessoal, CDC (Crédito Direto ao Consumidor), financiamento de veículos e empréstimos bancários baseados no **Sistema Francês de Amortização (Tabela Price)** com pagamentos postecipados (primeira parcela paga ao final do 1º período).

O usuário fornece **3 dos 4 parâmetros** da operação financeira, e o motor calcula automaticamente a **4ª variável restante**:
1. **Valor da Prestação Mensal ($p$)**
2. **Valor Financiado ($q_0$)**
3. **Taxa de Juros Mensal ($j$)**
4. **Número de Meses / Prazo ($n$)**

---

## 2. 📥 Campos de Entrada (Inputs)

| Campo | Tipo / Formato | Descrição | Restrições & Validações |
| :--- | :--- | :--- | :--- |
| **Nº de Meses ($n$)** | Inteiro | Quantidade total de parcelas mensais | $n \ge 1$ (inteiro positivo) |
| **Taxa de Juros Mensal ($j$)** | Numérico (%) | Taxa de juros ao mês em porcentagem (ex: 1,99%) | $j \ge 0$ |
| **Valor da Prestação ($p$)** | Moeda (R$) | Valor de cada parcela periódica fixa | $p > 0$ (postecipada, sem entrada no ato) |
| **Valor Financiado ($q_0$)** | Moeda (R$) | Montante total do empréstimo/bem sem a entrada | $q_0 > 0$ |

> **Nota de UX:**
> - O usuário pode alternar diretamente a aba do que deseja calcular através de um seletor no topo (*"O que você deseja calcular?"*), o que coloca o campo alvo em destaque como resultado automático.
> - Se o usuário preferir, ele pode preencher 3 dos 4 campos e o sistema detecta inteligentemente o campo vazio a ser calculado.
> - O botão "Limpar" zera todos os campos e reseta os estados de visualização.

---

## 3. 🧮 Lógica Matemática & Regras de Negócio

### 3.1 Equação Fundamental da Tabela Price
$$q_0 = \frac{1 - (1+j)^{-n}}{j} \cdot p$$

Onde:
- $q_0$: Valor financiado (Capital presente).
- $p$: Prestação periódica mensal.
- $j$: Taxa de juros periódica em base decimal ($j = \text{taxa} / 100$).
- $n$: Número total de parcelas mensais.

---

### 3.2 As Quatro Modalidades de Cálculo

#### Modalidade A: Calcular Valor da Prestação ($p$)
Dados: $q_0$, $j$, $n$.
$$p = q_0 \cdot \frac{j}{1 - (1+j)^{-n}}$$
*(Caso especial $j = 0$: $p = q_0 / n$)*

#### Modalidade B: Calcular Valor Financiado ($q_0$)
Dados: $p$, $j$, $n$.
$$q_0 = p \cdot \frac{1 - (1+j)^{-n}}{j}$$
*(Caso especial $j = 0$: $q_0 = n \cdot p$)*

#### Modalidade C: Calcular Número de Meses ($n$)
Dados: $q_0$, $p$, $j$.
Partindo de:
$$\frac{q_0 \cdot j}{p} = 1 - (1+j)^{-n} \implies (1+j)^{-n} = 1 - \frac{q_0 \cdot j}{p}$$
Aplicando logaritmo natural ($\ln$):
$$n = - \frac{\ln\left(1 - \frac{q_0 \cdot j}{p}\right)}{\ln(1+j)}$$

> **⚠️ Restrição Econômica:**
> Se $q_0 \cdot j \ge p$, a prestação informada é menor ou igual aos juros gerados já no primeiro mês. Nessa condição, a dívida **nunca amortiza**. O sistema bloqueia com mensagem amigável:  
> *"A prestação (R$ p) deve ser maior que os juros do 1º mês (R$ q_0 \times j) para que a dívida seja amortizada."*

#### Modalidade D: Calcular Taxa de Juros Mensal ($j$)
Dados: $q_0$, $p$, $n$.  
Buscamos a raiz da função $f(j) = 0$:
$$f(j) = q_0 \cdot \frac{j}{1 - (1+j)^{-n}} - p = 0$$

- **Método de Resolução:** Busca binária (Bisseção) com precisão estrita:  
  O critério de parada exige que a margem de erro sobre a prestação calculada seja **inferior a 0.000001**:
  $$|p_{\text{calc}}(j) - p| < 0.000001$$
- **Casos Especiais:**
  - Se $n \cdot p = q_0$: a taxa é exatamente $j = 0\%$.
  - Se $n \cdot p < q_0$: o total pago é inferior ao capital financiado (juros negativos), emitindo alerta de inconsistência nos valores.

---

### 3.3 Cronograma de Amortização (Tabela Price)
Para cada mês $k \in [1, n]$:
1. **Juros do Mês:** $J_k = S_{k-1} \cdot j$
2. **Amortização do Mês:** $A_k = p - J_k$
3. **Saldo Devedor Restante:** $S_k = S_{k-1} - A_k$ *(no mês $n$, $S_n \to 0$)*

---

## 4. 📊 Visualizações & Saídas

### 4.1 Cards de KPI
1. **Resultado Calculado (Destaque):** Exibe a variável calculada (ex: `Prestação: R$ 86,00` ou `Taxa de Juros: 2,57% a.m.` com equivalente anual).
2. **Total a Pagar:** Montante total desembolsado ($n \times p$).
3. **Total de Juros Pagos:** Custo financeiro total da operação ($n \times p - q_0$).
4. **Custo do Crédito (%):** Percentual do total pago que corresponde exclusivamente a juros.

### 4.2 Gráficos (Chart.js)
- **Donut Chart (Composição do Pagamento):**
  - Fatia 1: Capital Amortizado (Valor Financiado) — tom verde `--green`.
  - Fatia 2: Juros Pagos — tom lima `--lime` ou âmbar.

### 4.3 Tabela de Amortização Completa
Colunas auditáveis mês a mês:
- `Mês` ($1$ a $n$)
- `Prestação (R$)` (parcela constante)
- `Juros (R$)` (decrescente na Price)
- `Amortização (R$)` (crescente na Price)
- `Saldo Devedor (R$)` (decrescente até zerar)

### 4.4 Seção Didática
Explicação clara sobre a Tabela Price (Sistema Francês), diferença entre taxa nominal e efetiva, a fórmula oficial do Banco Central, e como amortizações antecipadas economizam juros futuros.
