export type ModoFinanciamento = 'prestacao' | 'financiado' | 'juros' | 'meses';

export interface FinanciamentoInput {
  meses?: number;
  taxaJurosMensal?: number; // Em percentual (ex: 1.99 para 1,99% a.m.)
  valorPrestacao?: number;  // Valor da parcela periódica fixa
  valorFinanciado?: number; // Valor financiado (sem entrada)
  modoDesejado?: ModoFinanciamento;
}

export interface ParcelaPrice {
  mes: number;
  prestacao: number;
  juros: number;
  amortizacao: number;
  saldoDevedor: number;
}

export interface FinanciamentoResult {
  modoCalculado: ModoFinanciamento;
  meses: number;
  taxaJurosMensal: number;  // em % (ex: 1.99)
  taxaJurosAnual: number;   // em % equivalente anual
  valorPrestacao: number;
  valorFinanciado: number;
  totalPago: number;
  totalJuros: number;
  porcentagemJuros: number; // % do montante pago que é juros
  cronograma: ParcelaPrice[];
}
