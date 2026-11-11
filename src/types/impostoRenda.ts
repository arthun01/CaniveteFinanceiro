/**
 * Tipagens para a Calculadora de Imposto de Renda (IRRF)
 */

export interface ImpostoRendaInput {
  grossSalary: number;        // Renda mensal bruta
  dependentsCount: number;    // Quantos dependentes tem
  educationExpenses: number;  // Gasto mensal com ensino
  alimonyExpenses: number;    // Gasto mensal com pensão alimentícia
  medicalExpenses: number;    // Gasto mensal com despesas médicas
}

export interface TabelaIRFaixa {
  faixaIndex: number;
  label: string;
  min: number;
  max: number;
  aliquota: number;           // 0, 7.5, 15, 22.5, 27.5
  deducao: number;            // Parcela a deduzir em R$
}

export interface ImpostoRendaResult {
  input: ImpostoRendaInput;
  grossSalary: number;
  inssDiscount: number;          // Desconto do INSS pela tabela progressiva oficial
  inssEffectiveRate: number;     // Alíquota efetiva do INSS (%)
  dependentsCount: number;
  dependentsDeduction: number;   // dependentesCount * 189.59
  alimonyExpenses: number;
  medicalExpenses: number;
  educationExpenses: number;
  totalDeductions: number;       // Soma de todas as deduções (INSS + dependentes + pensão + saúde + educação)
  taxableBase: number;           // Base de cálculo = Salário Bruto - Total de Deduções
  faixa: TabelaIRFaixa;
  aliquotaNominal: number;       // Alíquota percentual da faixa
  deductionParcel: number;       // Parcela a deduzir da faixa
  taxDue: number;                // Valor do imposto retido na fonte (IRRF)
  effectiveRate: number;         // Alíquota efetiva do IR = (taxDue / grossSalary) * 100
  totalMandatoryDiscounts: number; // Total descontado em folha (INSS + IRRF)
  netSalary: number;             // Salário líquido após descontos em folha = grossSalary - INSS - taxDue
  isExempt: boolean;             // Se é isento de imposto
}
