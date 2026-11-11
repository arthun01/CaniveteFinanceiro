import type {
  ReservaInput,
  ReservaResult,
  ReservaMonthRecord,
  ReservaYearRecord,
  WorkModel,
} from '../types/reserva';

/**
 * Retorna os meses recomendados de proteção conforme a estabilidade de renda:
 * - Servidor público: 3 meses
 * - CLT: 6 meses
 * - Autônomo / MEI / PJ: 12 meses
 */
export function getRecommendedMonths(workModel: WorkModel): number {
  switch (workModel) {
    case 'servidor_publico':
      return 3;
    case 'clt':
      return 6;
    case 'autonomo':
      return 12;
    default:
      return 6;
  }
}

/**
 * Realiza o cálculo da reserva ideal e a projeção temporal para alcançá-la
 */
export function calculateEmergencyReserve(input: ReservaInput): ReservaResult {
  const salary = Math.max(0, input.monthlySalary);
  const expenses = Math.max(0, input.monthlyExpenses);
  const savings = Math.max(0, input.monthlySavings);
  const currentSavings = Math.max(0, input.currentSavings || 0);

  const recommendedMonths = getRecommendedMonths(input.workModel);
  const targetReserve = expenses * recommendedMonths;
  const neededAmount = Math.max(0, targetReserve - currentSavings);

  const savingsRate = salary > 0 ? (savings / salary) * 100 : 0;
  const monthlySurplus = salary - expenses;

  let monthsToTarget = 0;
  if (neededAmount > 0) {
    if (savings > 0) {
      monthsToTarget = Math.ceil(neededAmount / savings);
    } else {
      monthsToTarget = 999; // Representa prazo indeterminado sem poupança
    }
  }

  const yearsToTarget = +(monthsToTarget / 12).toFixed(1);

  // Geração dos registros mensais
  const monthlyRecords: ReservaMonthRecord[] = [];
  let currentBalance = currentSavings;

  // Projeta até atingir a meta (ou até no máximo 120 meses / 10 anos)
  const maxProjectionMonths = Math.min(Math.max(monthsToTarget, 12), 120);

  for (let m = 1; m <= maxProjectionMonths; m++) {
    const deposit = savings;
    currentBalance += deposit;

    const percentReached = targetReserve > 0 
      ? Math.min(100, +((currentBalance / targetReserve) * 100).toFixed(1))
      : 100;

    const remainingToTarget = Math.max(0, targetReserve - currentBalance);
    const isTargetReached = currentBalance >= targetReserve;

    const currentYear = Math.ceil(m / 12);

    monthlyRecords.push({
      month: m,
      year: currentYear,
      deposit,
      accumulated: currentBalance,
      percentReached,
      remainingToTarget,
      isTargetReached,
    });
  }

  // Agregação Ano a Ano
  const yearlyRecords: ReservaYearRecord[] = [];
  const totalYears = Math.ceil(monthlyRecords.length / 12);

  for (let y = 1; y <= totalYears; y++) {
    const monthsInThisYear = monthlyRecords.filter((r) => r.year === y);
    if (monthsInThisYear.length === 0) continue;

    const lastMonth = monthsInThisYear[monthsInThisYear.length - 1];
    const totalDepositedYear = monthsInThisYear.reduce((acc, curr) => acc + curr.deposit, 0);

    yearlyRecords.push({
      year: y,
      totalDepositedYear,
      accumulated: lastMonth.accumulated,
      percentReached: lastMonth.percentReached,
      remainingToTarget: lastMonth.remainingToTarget,
      isTargetReached: lastMonth.isTargetReached,
    });
  }

  return {
    input,
    recommendedMonths,
    targetReserve,
    currentSavings,
    neededAmount,
    monthsToTarget,
    yearsToTarget,
    savingsRate,
    monthlySurplus,
    monthlyRecords,
    yearlyRecords,
  };
}
