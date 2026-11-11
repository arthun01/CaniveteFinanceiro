# 🏢 Feature Spec — Simulador de Fundos Imobiliários (FIIs)

> **Origem:** Baseado em [`sources/ideia-4.md`](../sources/ideia-4.md).  
> **Rota no Portal:** `/fundos-imobiliarios/`  
> **Arquivos:** `fundos-imobiliarios/index.html`, `src/fiiMain.ts`, `src/services/fiiCalculator.ts`, `src/charts/fiiChartManager.ts`, `src/animations/fiiAnimManager.ts`, `src/types/fii.ts`.

---

## 1. 🎯 Objetivo da Funcionalidade
Simular a criação e aceleração do **Efeito Bola de Neve** (*Snowball Effect*) através do reinvestimento integral de dividendos mensais isentos de Imposto de Renda distribuídos por Fundos Imobiliários (FIIs), projetando a evolução patrimonial mês a mês e identificando o **Número Mágico** (*Magic Number*).

---

## 2. 📥 Campos de Entrada (Inputs)

| Campo | Tipo | Descrição | Padrão | Validação |
| :--- | :--- | :--- | :--- | :--- |
| **Nome / Ticker** | Texto | Código do FII na B3 (ex: MXRF11, HGLG11) | MXRF11 | Opcional |
| **Dividend Yield Anual** | Numérico (%) | Proventos projetados no ano (DY % a.a.) | 11,5% | >= 0 |
| **Valor da Cota** | Moeda (R$) | Preço de mercado atual da cota | R$ 10,20 | > 0 |
| **Nº de Cotas Inicial** | Inteiro | Cotas já detidas na largada (mês 1) | 100 | >= 0 (Opcional) |
| **Aporte Mensal** | Inteiro | Quantas cotas compra todo mês com dinheiro do bolso | 10 | >= 0 |
| **Período** | Seleção | 2 anos (24 meses - padrão), 3 anos ou 5 anos | 24 meses | >= 1 |

---

## 3. 🧮 Lógica Matemática & Regras de Negócio

### 3.1 Proventos Mensais Isentos
O cálculo utiliza a taxa equivalente mensal de rendimento:
$$i_{mensal} = (1 + DY_{anual})^{\frac{1}{12}} - 1$$
$$\text{Dividendo por Cota} = \text{Valor da Cota} \times i_{mensal}$$

### 3.2 O Efeito Bola de Neve (Reinvestimento com Cotas Inteiras)
Na B3, fundos imobiliários são transacionados em lotes padrão de cotas inteiras (sem frações fracionárias). Portanto, o simulador implementa a dinâmica real de mercado:

A cada mês $t$:
1. **Cotas Ativas:** $\text{Cotas que Rendem} = \text{Cotas Acumuladas Anterior} + \text{Aporte do Bolso}$.
2. **Dividendo do Mês (R$):** $\text{Rendimento} = \text{Cotas Ativas} \times \text{Dividendo por Cota}$.
3. **Caixa Total para Reinvestir:** $\text{Disponível} = \text{Rendimento} + \text{Sobra Anterior}$.
4. **Cotas Compradas com Rendimento:**
   $$\text{Cotas Reinvestidas} = \left\lfloor \frac{\text{Disponível}}{\text{Valor da Cota}} \right\rfloor$$
5. **Sobra em Caixa (Residual para o próximo mês):**
   $$\text{Sobra} = \text{Disponível} - (\text{Cotas Reinvestidas} \times \text{Valor da Cota})$$
6. **Total de Cotas Acumuladas no Fim do Mês:**
   $$\text{Total Cotas} = \text{Cotas Ativas} + \text{Cotas Reinvestidas}$$

### 3.3 Número Mágico (Magic Number)
O ponto de virada onde o investidor passa a ganhar pelo menos 1 cota inteira por mês apenas com proventos:
$$\text{Magic Number} = \left\lceil \frac{\text{Valor da Cota}}{\text{Dividendo por Cota}} \right\rceil$$

---

## 4. 📊 Visualizações & Saídas

### 4.1 Cards de KPI
1. **Patrimônio em Cotas (R$):** Valor acumulado das cotas a mercado + total de cotas.
2. **Rendimento Mensal Final (R$/mês):** Quanto cairá na conta no 24º mês (isentos de IR).
3. **Efeito Bola de Neve (Cotas):** Quantas cotas foram obtidas 100% de graça reinvestindo proventos.
4. **Número Mágico:** Quantidade de cotas necessárias e status (se já atingiu ou em qual mês atingiu).

### 4.2 Gráfico de Rosca / Donut (Chart.js)
- Mostra a proporção solicitada em `ideia-4.md`:
  - **Fatia 1:** Cotas saídas do próprio bolso (Iniciais + Aportes Mensais).
  - **Fatia 2:** Cotas compradas exclusivamente pelos rendimentos.

### 4.3 Tabela Mês a Mês (24 Meses / 2 Anos)
Colunas auditáveis:
- `Mês` (1 a 24)
- `Quantas Cotas Tenho?` (com badge destacando quando bateu o Magic Number)
- `Valor das Cotas` (Patrimônio em R$)
- `Rendimento` (R$ gerado pelas cotas no mês)
- `Quantas Cotas Eu Compro?` (Compradas com dividendos)
- `Do Bolso` (Cotas adquiridas do próprio bolso)
