import type {
  ImpostoRendaInput,
  ImpostoRendaResult,
  TabelaIRFaixa,
} from '../types/impostoRenda';

/**
 * Valor legal de dedução mensal por dependente (Receita Federal)
 */
export const DEDUCAO_POR_DEPENDENTE_MENSAL = 189.59;

/**
 * Tabela Progressiva Mensal do Imposto de Renda
 * Baseada na especificação do projeto (Faixas e Deduções vigentes)
 */
export const TABELA_PROGRESSIVA_IR: TabelaIRFaixa[] = [
  {
    faixaIndex: 1,
    label: 'Até R$ 2.428,80',
    min: 0,
    max: 2428.8,
    aliquota: 0,
    deducao: 0,
  },
  {
    faixaIndex: 2,
    label: 'De R$ 2.428,81 até R$ 2.826,65',
    min: 2428.8,
    max: 2826.65,
    aliquota: 7.5,
    deducao: 182.16,
  },
  {
    faixaIndex: 3,
    label: 'De R$ 2.826,66 até R$ 3.751,05',
    min: 2826.65,
    max: 3751.05,
    aliquota: 15.0,
    deducao: 394.16,
  },
  {
    faixaIndex: 4,
    label: 'De R$ 3.751,06 até R$ 4.664,68',
    min: 3751.05,
    max: 4664.68,
    aliquota: 22.5,
    deducao: 675.49,
  },
  {
    faixaIndex: 5,
    label: 'Acima de R$ 4.664,68',
    min: 4664.68,
    max: Infinity,
    aliquota: 27.5,
    deducao: 908.73,
  },
];

/**
 * Encontra a faixa correspondente para uma determinada base de cálculo
 */
export function getFaixaIR(taxableBase: number): TabelaIRFaixa {
  if (taxableBase <= 2428.8) {
    return TABELA_PROGRESSIVA_IR[0];
  }
  if (taxableBase <= 2826.65) {
    return TABELA_PROGRESSIVA_IR[1];
  }
  if (taxableBase <= 3751.05) {
    return TABELA_PROGRESSIVA_IR[2];
  }
  if (taxableBase <= 4664.68) {
    return TABELA_PROGRESSIVA_IR[3];
  }
  return TABELA_PROGRESSIVA_IR[4];
}

/**
 * Executa o cálculo completo do Imposto de Renda Retido na Fonte
 */
export function calculateImpostoRenda(input: ImpostoRendaInput): ImpostoRendaResult {
  const grossSalary = Math.max(0, input.grossSalary);
  const dependentsCount = Math.max(0, Math.floor(input.dependentsCount || 0));
  const educationExpenses = Math.max(0, input.educationExpenses || 0);
  const alimonyExpenses = Math.max(0, input.alimonyExpenses || 0);
  const medicalExpenses = Math.max(0, input.medicalExpenses || 0);

  // 1. Cálculo das deduções
  const dependentsDeduction = dependentsCount * DEDUCAO_POR_DEPENDENTE_MENSAL;
  const totalDeductions =
    dependentsDeduction + alimonyExpenses + medicalExpenses + educationExpenses;

  // 2. Base de cálculo do IR (Salário bruto – deduções)
  const taxableBase = Math.max(0, grossSalary - totalDeductions);

  // 3. Identificação da faixa da tabela progressiva
  const faixa = getFaixaIR(taxableBase);
  const aliquotaNominal = faixa.aliquota;
  const deductionParcel = faixa.deducao;

  // 4. Cálculo do imposto devido
  // Fórmula: IR = (Base de Cálculo × Alíquota %) - Parcela a Deduzir
  let taxDue = 0;
  if (aliquotaNominal > 0 && taxableBase > 0) {
    taxDue = (taxableBase * (aliquotaNominal / 100)) - deductionParcel;
    taxDue = Math.max(0, +taxDue.toFixed(2));
  }

  // 5. Alíquota efetiva real e salário líquido
  const effectiveRate =
    grossSalary > 0 && taxDue > 0
      ? +((taxDue / grossSalary) * 100).toFixed(2)
      : 0;

  const netSalary = Math.max(0, +(grossSalary - taxDue).toFixed(2));
  const isExempt = taxDue === 0;

  return {
    input,
    grossSalary,
    dependentsCount,
    dependentsDeduction: +dependentsDeduction.toFixed(2),
    alimonyExpenses,
    medicalExpenses,
    educationExpenses,
    totalDeductions: +totalDeductions.toFixed(2),
    taxableBase: +taxableBase.toFixed(2),
    faixa,
    aliquotaNominal,
    deductionParcel,
    taxDue,
    effectiveRate,
    netSalary,
    isExempt,
  };
}
