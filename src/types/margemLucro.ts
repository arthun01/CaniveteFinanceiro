export type ModoCalculoMargem = 'venda' | 'margem';

export interface MargemLucroInput {
  quantidade?: number;      // Padrão: 1
  valorCompra: number;      // Custo unitário de compra (R$)
  valorVenda?: number;      // Preço de venda unitário (R$)
  margemLucro?: number;     // Margem de lucro em % (ex: 66.67)
  modo?: ModoCalculoMargem; // 'venda' (calcula margem) ou 'margem' (calcula preço de venda)
}

export interface FaixaSensibilidadeMargem {
  margemPct: number;
  precoVendaUnitario: number;
  lucroUnitario: number;
  markupPct: number;
  markupMultiplicador: number;
}

export interface MargemLucroResult {
  quantidade: number;
  valorCompraUnitario: number;
  valorVendaUnitario: number;
  gastoTotalCompra: number;
  valorTotalVenda: number;
  lucroBrutoUnitario: number;
  lucroBrutoTotal: number;
  margemLucroPct: number;
  markupMultiplicador: number;
  markupPct: number;
  tabelaSimulacao: FaixaSensibilidadeMargem[];
}
