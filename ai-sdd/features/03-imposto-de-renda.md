# 🧾 Feature Spec — Calculadora de Imposto de Renda (IRRF)

> **Origem:** Baseado em [`sources/ideia-3.md`](../sources/ideia-3.md).  
> **Rota no Portal:** `/imposto-de-renda/`  
> **Arquivos:** `imposto-de-renda/index.html`, `src/impostoRendaMain.ts`, `src/services/impostoRendaCalculator.ts`.

---

## 1. 🎯 Objetivo da Funcionalidade
Simular com exatidão a retenção do Imposto de Renda Retido na Fonte (IRRF) sobre salários e rendimentos mensais, detalhando a dedução progressiva do INSS oficial e todas as deduções legais permitidas por lei.

> ⚠️ **Decisão de Design Explícita (de `ideia-3.md`):** Esta ferramenta **não utiliza gráficos**. Ela adota um formato 100% contábil e auditável, estruturado em **3 tabelas sequenciais**.

---

## 2. 📥 Campos de Entrada (Inputs)

| Campo | Tipo | Descrição | Padrão | Validação |
| :--- | :--- | :--- | :--- | :--- |
| **Renda Mensal Bruta** | Moeda (R$) | Salário bruto em carteira ou rendimentos tributáveis | R$ 7.500,00 | > 0 |
| **Dependentes** | Inteiro | Número de filhos/dependentes legais cadastrados | 1 | >= 0 |
| **Pensão Alimentícia** | Moeda (R$) | Pensão judicial paga mensalmente | R$ 0,00 | >= 0 |
| **Despesas Médicas** | Moeda (R$) | Plano de saúde e consultas dedutíveis no mês | R$ 0,00 | >= 0 |
| **Gasto com Ensino** | Moeda (R$) | Instrução/educação dedutível mensal | R$ 0,00 | >= 0 |

---

## 3. 🧮 Lógica de Cálculo e Tabelas Progressivas

O cálculo do IRRF é estritamente sequencial:

```
Renda Bruta
    │
    ▼
[-] Contribuição Previdenciária Oficial (INSS Progressivo)
    │
    ▼
[-] Deduções Legais (Dependentes + Pensão + Saúde + Ensino)
    │
    ▼
[=] Base de Cálculo do IRRF
    │
    ▼
[x] Alíquota da Faixa IRPF
    │
    ▼
[-] Parcela a Deduzir do IRPF
    │
    ▼
[=] Imposto de Renda Retido na Fonte (IRRF)
```

### 3.1 Tabela Progressiva do INSS (Calculada Automaticamente)
Aplica-se alíquota por fatias progressivas até o teto:

| Faixa Salarial | Alíquota | Fatias Máximas |
| :--- | :--- | :--- |
| Até R$ 1.412,00 | 7,5% | R$ 105,90 |
| De R$ 1.412,01 até R$ 2.666,68 | 9,0% | R$ 112,92 |
| De R$ 2.666,69 até R$ 4.000,03 | 12,0% | R$ 160,00 |
| De R$ 4.000,04 até R$ 7.786,02 | 14,0% | R$ 530,04 |
| **Teto Máximo do INSS** | - | **R$ 908,86** |

### 3.2 Deduções Legais Oficiais
- **Dedução por dependente legal:** **R$ 189,59** por dependente/mês.
- **Pensão alimentícia homologada:** 100% do valor pago.
- **Saúde e Educação:** valores informados pelo contribuinte.

### 3.3 Tabela Progressiva Mensal do IRPF (IRRF)
Sobre a Base de Cálculo (`Salário Bruto - INSS - Deduções`):

| Faixa da Base de Cálculo (R$) | Alíquota (%) | Parcela a Deduzir (R$) |
| :--- | :--- | :--- |
| Até R$ 2.259,20 (com desconto simplificado até R$ 2.826,65) | Isento | R$ 0,00 |
| De R$ 2.428,81 até R$ 2.826,65 | 7,5% | R$ 182,16 |
| De R$ 2.826,66 até R$ 3.751,05 | 15,0% | R$ 394,16 |
| De R$ 3.751,06 até R$ 4.664,68 | 22,5% | R$ 675,49 |
| Acima de R$ 4.664,68 | 27,5% | R$ 908,73 |

$$\text{IR Devido} = (\text{Base} \times \text{Alíquota}) - \text{Parcela a Deduzir}$$
Se o resultado for $\le 0$, o imposto é zero (Isento).

### 3.4 Alíquota Efetiva Real
$$\text{Alíquota Efetiva} = \left( \frac{\text{IR Devido}}{\text{Salário Bruto}} \right) \times 100$$
Demonstra ao usuário a porcentagem real descontada do seu salário bruto (diferente da alíquota nominal de topo).

---

## 4. 📋 Estrutura das 3 Tabelas de Auditoria

Exibidas sequencialmente no container de resultados:

### Tabela 1: Entrada e Valores
- Rendimento Mensal Bruto
- Total de Entradas Tributáveis

### Tabela 2: Deduções e Valores
- INSS Descontado (discriminado automaticamente)
- Dedução por Dependentes ($N \times \text{R\$} 189,59$)
- Pensão Alimentícia
- Despesas Médicas e Ensino
- **Total de Deduções Aplicadas**

### Tabela 3: Base de Cálculo, Alíquotas e Imposto Final
- Base de Cálculo Efetiva
- Faixa e Alíquota Nominal Aplicada
- Parcela Legal a Deduzir
- **Imposto Retido na Fonte (IRRF Final)**
- **Alíquota Efetiva Real (%)**
- **Salário Líquido Estimado**
