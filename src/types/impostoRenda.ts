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
  dependentsCount: number;
  dependentsDeduction: number;   // dependentesCount * 189.59
  alimonyExpenses: number;
  medicalExpenses: number;
  educationExpenses: number;
  totalDeductions: number;       // Soma de todas as deduções
  taxableBase: number;           // Base de cálculo = Salário Bruto - Total de Deduções
  faixa: TabelaIRFaixa;
  aliquotaNominal: number;       // Alíquota percentual da faixa
  deductionParcel: number;       // Parcela a deduzir da faixa
  taxDue: number;                // Valor do imposto que será retido
  effectiveRate: number;         // Alíquota efetiva = (taxDue / grossSalary) * 100
  netSalary: number;             // Salário líquido após IR = grossSalary - taxDue
  isExempt: boolean;             // Se é isento de imposto
}
