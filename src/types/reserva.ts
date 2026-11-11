export type WorkModel = 'servidor_publico' | 'clt' | 'autonomo';

export interface ReservaInput {
  workModel: WorkModel;
  monthlySalary: number;
  monthlyExpenses: number;
  monthlySavings: number;
  currentSavings?: number;
}

export interface ReservaMonthRecord {
  month: number;
  year: number;
  deposit: number;
  accumulated: number;
  percentReached: number;
  remainingToTarget: number;
  isTargetReached: boolean;
}

export interface ReservaYearRecord {
  year: number;
  totalDepositedYear: number;
  accumulated: number;
  percentReached: number;
  remainingToTarget: number;
  isTargetReached: boolean;
}

export interface ReservaResult {
  input: ReservaInput;
  recommendedMonths: number;   // 3, 6 ou 12 meses
  targetReserve: number;        // Meta da reserva (R$)
  currentSavings: number;      // Saldo já acumulado inicial
  neededAmount: number;         // Valor que ainda falta para a meta
  monthsToTarget: number;       // Número de meses necessários para atingir
  yearsToTarget: number;        // Número de anos equivalentes
  savingsRate: number;          // % do salário que é poupado
  monthlySurplus: number;       // Salário - Custo fixo
  monthlyRecords: ReservaMonthRecord[];
  yearlyRecords: ReservaYearRecord[];
}
