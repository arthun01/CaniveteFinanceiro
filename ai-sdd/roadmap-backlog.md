# 🗺️ Roadmap & Backlog de Ideias Futuras

> **Objetivo:** Guardar o planejamento, ideias de novas calculadoras e requisitos preliminares para que futuras features sejam concebidas e executadas com rapidez.

---

## 💡 Próximas Calculadoras no Radar

Abaixo estão as 4 calculadoras mais solicitadas e prioritárias para expansão da suíte CaniveteFinanceiro:

---

### 1. 🏠 Simulador de Financiamento Imobiliário: SAC vs. PRICE
> *Nota: O motor da Tabela Price com Prestações Fixas do Banco Central foi implementado na feature `/financiamento/` ([`features/06-financiamento-prestacoes-fixas.md`](./features/06-financiamento-prestacoes-fixas.md)). O comparativo imobiliário completo com seguros MIP/DFI e SAC vs PRICE permanece planejado como evolução.*
- **Proposta de Valor:** Ajudar o comprador a comparar o custo total e o comportamento das parcelas entre a Tabela SAC (amortização constante, parcelas decrescentes) e a Tabela PRICE (parcelas fixas).
- **Inputs Sugeridos:**
  - Valor do Imóvel (R$)
  - Valor de Entrada (R$)
  - Prazo em Anos (ou Meses)
  - Taxa de Juros Efetiva Anual (% a.a.)
  - Custos Adicionais Mensais (Seguros MIP/DFI e taxa de administração)
- **Outputs & Gráficos:**
  - Comparativo Lado a Lado: Total de Juros Pagos no SAC vs PRICE.
  - Primeira e Última Parcela de cada sistema.
  - Gráfico de Linha ou Barras: Curva de amortização do saldo devedor ao longo dos anos.
  - Tabela com opção de simular amortização extraordinária (efeito de abater prazo vs parcela).

---

### 2. ⚖️ Comparador Salarial: CLT vs. PJ
- **Proposta de Valor:** Mostrar quanto um profissional CLT precisa pedir como PJ (e vice-versa) para manter o mesmo padrão de vida líquido.
- **Inputs Sugeridos:**
  - Salário Bruto CLT ou Valor da Hora/Mensal PJ
  - Benefícios CLT (VR, VA, Plano de Saúde, PLR, Vale Transporte, 13º Salário, 1/3 Férias)
  - Custos PJ (Simples Nacional / Anexo III ou V, contador, emissão de nota, pró-labore, INSS do pró-labore)
- **Outputs & Gráficos:**
  - Salário Líquido Real Anualizado em ambos os regimes.
  - Gráfico de Colunas: Divisão de Onde Vai o Dinheiro (Impostos vs Benefícios vs Salário Líquido no Bolso).
  - Tabela comparativa mês a mês e provisão de 13º/férias para PJ.

---

### 3. 📈 Comparador de Renda Fixa: CDB vs. LCI/LCA vs. Tesouro Selic
- **Proposta de Valor:** Comparar rendimentos líquidos de investimentos tributados (CDB e Tesouro Direto com tabela regressiva de IR) contra investimentos isentos de IR (LCI, LCA, CRI, CRA).
- **Inputs Sugeridos:**
  - Valor a Investir (R$)
  - Prazo de Aplicação (Dias ou Meses)
  - % do CDI do CDB ofertado (ex: 110% do CDI)
  - % do CDI da LCI/LCA ofertada (ex: 90% do CDI)
  - Taxa CDI / Selic Meta atual (% a.a.)
- **Outputs:**
  - Qual opção rende mais líquido no bolso.
  - Cálculo automático da alíquota regressiva de IR (22,5% até 180 dias, ..., 15% acima de 720 dias).
  - Ponto de indiferença (ex: "Para bater este CDB a 110%, a LCI precisa pagar pelo menos 90,75%").

---

### 4. 🏖️ Calculadora de Independência Financeira & Regra dos 4% (FIRE)
- **Proposta de Valor:** Descobrir o "Número FIRE" — quanto dinheiro você precisa ter acumulado para viver apenas dos rendimentos dos seus investimentos.
- **Inputs Sugeridos:**
  - Custo de Vida Mensal Desejado na Aposentadoria (R$)
  - Taxa Segura de Retirada (Default: 4% ao ano — Regra de Trinity)
  - Patrimônio Atual já investido (R$)
  - Capacidade de Aporte Mensal Atual (R$)
  - Taxa de Rentabilidade Real Acima da Inflação (% a.a.)
- **Outputs:**
  - Patrimônio Alvo Necessário (Meta FIRE).
  - Tempo Estimado (em anos e meses) para atingir a liberdade.
  - Gráfico da Curva de Acúmulo com cruzamento na linha da independência.

---

## 📝 Como Adicionar Novas Ideias a Este Backlog

Quando você ou o usuário tiverem uma nova ideia de ferramenta:
1. Adicione um tópico neste documento (`roadmap-backlog.md`).
2. Descreva a **Proposta de Valor**, **Inputs**, **Regras Matemáticas** e **Outputs/Gráficos**.
3. Quando for hora de implementar, abra o [`03-guia-criacao-novas-features.md`](./03-guia-criacao-novas-features.md) e siga o checklist de 10 passos.
