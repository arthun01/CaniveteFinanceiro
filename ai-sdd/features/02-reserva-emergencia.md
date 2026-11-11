# 🛡️ Feature Spec — Calculadora de Reserva de Emergência

> **Origem:** Baseado em [`sources/ideia-2.md`](../sources/ideia-2.md).  
> **Rota no Portal:** `/reserva-emergencia/`  
> **Arquivos:** `reserva-emergencia/index.html`, `src/reservaMain.ts`, `src/services/reservaCalculator.ts`, `src/charts/reservaChartManager.ts`.

---

## 1. 🎯 Objetivo da Funcionalidade
Calcular o colchão financeiro mínimo necessário para proteção contra imprevistos (demissão, emergências de saúde, reparos domésticos) com base no perfil de estabilidade profissional e nos custos fixos de vida do usuário.

---

## 2. 📥 Campos de Entrada (Inputs)

| Campo | Tipo | Valores / Opções | Padrão | Validação |
| :--- | :--- | :--- | :--- | :--- |
| **Modelo de Trabalho** | Segmented Control | 🏛️ Servidor Público, 🏢 CLT, 💼 Autônomo / MEI | CLT | Obrigatório |
| **Salário / Renda Mensal** | Moeda (R$) | Reais | R$ 5.000,00 | > 0 |
| **Custo Fixo Mensal** | Moeda (R$) | Reais (aluguel, mercado, luz, contas fixas) | R$ 3.000,00 | > 0 e <= Salário |
| **Quanto Guarda por Mês** | Moeda (R$) | Reais dedicados à reserva | R$ 600,00 | >= 0 |

---

## 3. ⚖️ Regra de Negócio por Estabilidade Profissional

O número de meses de cobertura varia conforme a volatilidade e risco de interrupção de renda:

1. **🏛️ Servidor Público (Estabilidade Alta):**
   - **Recomendação:** `3 meses` de custo fixo.
   - Justificativa: Risco de demissão próximo a zero; cobertura voltada apenas a emergências pontuais de saúde ou família.
2. **🏢 Trabalhador CLT (Estabilidade Média):**
   - **Recomendação:** `6 meses` de custo fixo.
   - Justificativa: Conta com FGTS e Seguro-Desemprego, mas pode levar de 3 a 6 meses para recolocação no mercado de trabalho.
3. **💼 Autônomos, MEI, PJs e Empreendedores (Estabilidade Baixa):**
   - **Recomendação:** `12 meses` de custo fixo.
   - Justificativa: Sem qualquer benefício de rescisão, sem seguro-desemprego e com sazonalidade no fluxo de caixa de clientes.

---

## 4. 🧮 Fórmulas & Métricas de Saída

1. **Meta da Reserva Ideal (R$):**
   $$\text{Meta} = \text{Custo Fixo Mensal} \times \text{Meses Recomendados}$$
2. **Tempo para Atingir a Meta:**
   - Se aporte mensal $> 0$:
     $$\text{Meses Necessários} = \lceil \text{Meta} / \text{Aporte Mensal} \rceil$$
   - Se aporte mensal $= 0$: Exibe status informativo alertando necessidade de poupar.
3. **Taxa de Poupança (% da Renda):**
   $$\text{Taxa Poupança} = \left( \frac{\text{Aporte Mensal}}{\text{Salário Mensal}} \right) \times 100$$
4. **Margem Livre (Orçamento Discricionário):**
   $$\text{Margem Livre} = \text{Salário Mensal} - \text{Custo Fixo} - \text{Aporte}$$

---

## 5. 📊 Visualizações & Saídas

### 5.1 Cards de KPI
- **Reserva Ideal Recomendada (R$):** Destacada com badge verde da estabilidade.
- **Tempo Estimado:** Exibido em meses e anos equivalentes (ex.: "15 meses (~1,3 anos)").
- **Taxa de Poupança:** Percentual do salário poupado mensalmente.

### 5.2 Gráficos (Chart.js)
1. **Donut de Orçamento Mensal:**
   - Custo Fixo Essencial vs Aporte na Reserva vs Margem Livre do Salário.
2. **Barra de Progresso Temporal:**
   - Evolução do saldo acumulado mês a mês com linha de referência na meta ideal.

### 5.3 Tabela de Evolução da Reserva
- Mês a Mês demonstrando o acúmulo financeiro e sinalizando em qual mês exato a meta é alcançada (`Meta Batida! 🎯`).
