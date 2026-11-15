# 🏷️ Feature Spec — Calculadora de Margem de Lucro e Markup

> **Origem:** Baseado em [`sources/ideia-6.md`](../sources/ideia-6.md).  
> **Rota no Portal:** `/margem-de-lucro/`  
> **Arquivos:** `margem-de-lucro/index.html`, `src/margemLucroMain.ts`, `src/services/margemLucroCalculator.ts`, `src/charts/margemLucroChartManager.ts`, `src/animations/margemLucroAnimManager.ts`, `src/types/margemLucro.ts`.

---

## 1. 🎯 Objetivo da Funcionalidade
Fornecer aos comerciantes, lojistas, prestadores de serviços e autônomos uma ferramenta precisa e didática para **precificação de produtos e serviços**, calculando:
1. **Lucro Bruto** (Unitário e Total para lotes de produtos).
2. **Margem de Lucro Comercial** (calculada sobre o preço final de venda).
3. **Markup Multiplicador e Percentual** (calculados sobre o custo de aquisição).
4. **Formação de Preço de Venda Ideal** a partir de uma margem pretendida.
5. **Tabela de Sensibilidade de Precificação** (faixas de 10% a 80% de margem).

A ferramenta resolve um dos erros mais comuns no varejo brasileiro: supor que somar 30% ou 50% ao custo de compra resulta em 30% ou 50% de margem líquida no caixa.

---

## 2. 📥 Campos de Entrada (Inputs)

| Campo | Tipo / Formato | Descrição | Restrições & Validações |
| :--- | :--- | :--- | :--- |
| **Quantidade de Itens** | Inteiro | Número de unidades adquiridas/vendidas | Opcional (assume 1 se vazio; inteiro positivo $\ge 1$) |
| **Custo de Compra Unitário** | Moeda (R$) | Valor de aquisição ou custo unitário do produto | Obrigatório; deve ser $> 0$ |
| **Preço de Venda Unitário** | Moeda (R$) | Preço final cobrado do cliente | Obrigatório no modo de cálculo de margem; deve ser $> 0$ |
| **Margem de Lucro Desejada** | Numérico (%) | Meta de margem sobre a receita de venda | Obrigatório no modo de formação de preço; $-100\% < M < 100\%$ |

---

## 3. 🧮 Lógica Matemática & Regras de Negócio

Seja:
- $C$: Custo de compra unitário
- $V$: Preço de venda unitário
- $Q$: Quantidade de itens (padrão: 1)
- $M$: Margem de lucro em porcentagem (\%)
- $L$: Lucro bruto unitário

### 3.1 Relações Fundamentais

#### 1. Lucro Bruto Unitário & Total
$$L_{\text{unitário}} = V - C$$
$$L_{\text{total}} = (V - C) \times Q$$
$$\text{Gasto Total de Compra} = C \times Q$$
$$\text{Faturamento Total da Venda} = V \times Q$$

#### 2. Margem de Lucro (Bruta sobre a Venda)
A margem mede quanto de cada real que entra no faturamento se converte em lucro:
$$M = \frac{V - C}{V} \times 100 = \frac{L_{\text{unitário}}}{V} \times 100$$

> **⚠️ Restrição Matemática e Econômica:**  
> Se o produto teve custo positivo ($C > 0$), a margem de lucro $M$ é **estritamente menor que 100%**. Para que a margem atingisse 100%, o custo precisaria ser zero ou o preço de venda tender ao infinito:
> $$\lim_{V \to \infty} \frac{V - C}{V} = 100\%$$
> O sistema valida e rejeita $M \ge 100\%$.

#### 3. Markup Multiplicador (Índice sobre o Custo)
Mostra por qual fator o custo é multiplicado para chegar ao preço de venda:
$$\text{Markup Multiplicador} = \frac{V}{C}$$

#### 4. Markup Percentual (% sobre o Custo)
Percentual acrescido ao custo de compra:
$$\text{Markup Percentual} = \frac{V - C}{C} \times 100 = \left(\frac{V}{C} - 1\right) \times 100$$

#### 5. Formação de Preço a partir da Margem Desejada
Partindo da definição de margem:
$$\frac{V - C}{V} = \frac{M}{100} \implies 1 - \frac{C}{V} = \frac{M}{100} \implies \frac{C}{V} = 1 - \frac{M}{100}$$
$$V = \frac{C}{1 - \frac{M}{100}}$$

---

### 3.2 Exemplo Canônico Validado (ideia-6.md)
Para $C = \text{R\$ } 5,00$ e $V = \text{R\$ } 15,00$:
- **Lucro Bruto Unitário:** $\text{R\$ } 15,00 - \text{R\$ } 5,00 = \mathbf{\text{R\$ } 10,00}$
- **Margem de Lucro:** $(\text{R\$ } 10,00 \div \text{R\$ } 15,00) \times 100 = \mathbf{66,67\%}$
- **Markup Multiplicador:** $\text{R\$ } 15,00 \div \text{R\$ } 5,00 = \mathbf{3,0x}$ (o produto é vendido pelo triplo do custo)
- **Markup Percentual:** $(\text{R\$ } 10,00 \div \text{R\$ } 5,00) \times 100 = \mathbf{200,0\%}$

---

## 4. 📊 Tabela de Sensibilidade de Precificação
Com base no custo informado, a ferramenta gera uma simulação comparativa instantânea para 8 faixas comerciais:

| Margem ($M$) | Preço Sugerido ($V$) | Lucro Unitário ($L$) | Markup Mult. | Markup % |
| :---: | :---: | :---: | :---: | :---: |
| **10%** | $C / 0,90$ | $V - C$ | $1,11\text{x}$ | $11,1\%$ |
| **20%** | $C / 0,80$ | $V - C$ | $1,25\text{x}$ | $25,0\%$ |
| **30%** | $C / 0,70$ | $V - C$ | $1,43\text{x}$ | $42,9\%$ |
| **40%** | $C / 0,60$ | $V - C$ | $1,67\text{x}$ | $66,7\%$ |
| **50%** | $C / 0,50$ | $V - C$ | $2,00\text{x}$ | $100,0\%$ |
| **60%** | $C / 0,40$ | $V - C$ | $2,50\text{x}$ | $150,0\%$ |
| **70%** | $C / 0,30$ | $V - C$ | $3,33\text{x}$ | $233,3\%$ |
| **80%** | $C / 0,20$ | $V - C$ | $5,00\text{x}$ | $400,0\%$ |

O usuário pode clicar diretamente em qualquer linha da tabela para carregar automaticamente a margem desejada e recalcular os totais com base na quantidade.

---

## 5. 🎨 Interface & Experiência de Uso
1. **Header & Hero:** Indicador visual de precificação e subtítulo orientativo.
2. **Seletor de Modo:**
   - *Modo A: Tenho o Preço de Venda (Calcular Margem)*
   - *Modo B: Tenho a Margem Desejada (Formar Preço)*
3. **Cards de KPI:**
   - Lucro Bruto Total (com lucro unitário no rodapé)
   - Margem de Lucro (%) (com indicação "Sob o faturamento")
   - Markup Percentual (com multiplicador ex: 3,0x no rodapé)
   - Faturamento Total (com gasto total de custo no rodapé)
4. **Gráfico Doughnut (Chart.js):**
   - Proporção visual entre Custo de Aquisição e Lucro Bruto.
   - Suporte a tema Claro e Escuro.
5. **Seção Didática:**
   - Explicação minuciosa de por que somar $X\%$ ao custo não resulta em $X\%$ de margem.
   - Exemplo clássico ilustrado passo a passo.
6. **SEO & Indexação:**
   - Canonical `https://arthurrv.me/CaniveteFinanceiro/margem-de-lucro/`
   - Open Graph, Twitter Cards e Schema.org (`WebApplication` + `BreadcrumbList`).
