import type {
  SimulationInput,
  SimulationResult,
  MonthRecord,
  YearRecord,
} from '../types/finance';

/**
 * Converte a taxa de juros informada para taxa mensal decimal equivalente.
 * Se anual: im = (1 + ia)^(1/12) - 1
 * Se mensal: im = taxa / 100
 */
export function getMonthlyRate(ratePercent: number, frequency: 'yearly' | 'monthly'): number {
  if (ratePercent <= 0) return 0;
  const rateDecimal = ratePercent / 100;

  if (frequency === 'monthly') {
    return rateDecimal;
  }

  // Taxa anual convertida para taxa mensal equivalente
  return Math.pow(1 + rateDecimal, 1 / 12) - 1;
}

/**
 * Executa a simulação completa de juros compostos mês a mês
 */
export function calculateCompoundInterest(input: SimulationInput): SimulationResult {
  const initialValue = Math.max(0, input.initialValue);
  const monthlyDeposit = Math.max(0, input.monthlyDeposit);
  const totalMonths = input.periodType === 'years' 
    ? Math.max(1, Math.round(input.period * 12)) 
    : Math.max(1, Math.round(input.period));

  const monthlyRate = getMonthlyRate(input.interestRate, input.rateFrequency);

  const monthlyRecords: MonthRecord[] = [];
  let currentBalance = initialValue;
  let totalInvested = initialValue;
  let accumulatedInterest = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const startingBalance = currentBalance;
    const interestMonth = startingBalance * monthlyRate;
    const contribution = monthlyDeposit;

    currentBalance = startingBalance + interestMonth + contribution;
    totalInvested += contribution;
    accumulatedInterest += interestMonth;

    const currentYear = Math.ceil(m / 12);
    const monthInYear = ((m - 1) % 12) + 1;

    monthlyRecords.push({
      period: m,
      year: currentYear,
      monthInYear,
      startingBalance,
      interestMonth,
      contribution,
      totalInvested,
      totalInterest: accumulatedInterest,
      accumulated: currentBalance,
    });
  }

  // Agregação Ano a Ano
  const yearlyRecords: YearRecord[] = [];
  const totalYears = Math.ceil(totalMonths / 12);

  for (let y = 1; y <= totalYears; y++) {
    const monthsInThisYear = monthlyRecords.filter((r) => r.year === y);
    if (monthsInThisYear.length === 0) continue;

    const firstMonthOfYear = monthsInThisYear[0];
    const lastMonthOfYear = monthsInThisYear[monthsInThisYear.length - 1];

    const interestYear = monthsInThisYear.reduce((acc, curr) => acc + curr.interestMonth, 0);
    const contributionYear = monthsInThisYear.reduce((acc, curr) => acc + curr.contribution, 0);

    yearlyRecords.push({
      year: y,
      startingBalance: firstMonthOfYear.startingBalance,
      interestYear,
      contributionYear,
      totalInvested: lastMonthOfYear.totalInvested,
      totalInterest: lastMonthOfYear.totalInterest,
      accumulated: lastMonthOfYear.accumulated,
    });
  }

  return {
    input,
    monthlyRate,
    totalMonths,
    totalInvested,
    totalInterest: accumulatedInterest,
    totalFinal: currentBalance,
    monthlyRecords,
    yearlyRecords,
  };
}
