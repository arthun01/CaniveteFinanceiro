export type RateFrequency = 'yearly' | 'monthly';
export type PeriodType = 'years' | 'months';
export type TableGrouping = 'months' | 'years';

export interface SimulationInput {
  initialValue: number;
  monthlyDeposit: number;
  interestRate: number;
  rateFrequency: RateFrequency;
  period: number;
  periodType: PeriodType;
}

export interface MonthRecord {
  period: number;          // Mês número 1, 2, 3...
  year: number;            // Ano 1, 2, 3...
  monthInYear: number;     // 1 a 12
  startingBalance: number; // Saldo no início do mês
  interestMonth: number;   // Juros gerados no mês
  contribution: number;    // Aporte do mês
  totalInvested: number;   // Total investido até este mês
  totalInterest: number;   // Total acumulado em juros até este mês
  accumulated: number;     // Saldo acumulado total ao final do mês
}

export interface YearRecord {
  year: number;
  startingBalance: number;
  interestYear: number;
  contributionYear: number;
  totalInvested: number;
  totalInterest: number;
  accumulated: number;
}

export interface SimulationResult {
  input: SimulationInput;
  monthlyRate: number;     // Taxa mensal decimal equivalente (ex: 0.008 para 0.8%)
  totalMonths: number;
  totalInvested: number;
  totalInterest: number;
  totalFinal: number;
  monthlyRecords: MonthRecord[];
  yearlyRecords: YearRecord[];
}
