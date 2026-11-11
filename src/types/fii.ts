export interface FiiInput {
  ticker?: string;             // Nome/código do FII (ex: MXRF11, HGLG11)
  dividendYieldAnual: number;  // Taxa de Dividend Yield Anual em % (ex: 11.5)
  valorCota: number;           // Preço da cota em R$ (ex: 10.50 ou 102.00)
  cotasIniciais: number;       // Quantidade inicial de cotas no mês 1 (opcional, default 0)
  cotasAporteMensal: number;   // Quantas cotas compra todo mês do bolso
  prazoMeses: number;          // Período da simulação em meses (padrão: 24 meses = 2 anos)
}

export interface FiiMesRecord {
  mes: number;
  cotasInicio: number;                // Cotas que renderam no mês
  rendimentoMes: number;              // R$ total de dividendos recebidos no mês
  sobraAnterior: number;              // Saldo residual em R$ do mês anterior
  valorDisponivelReinvestir: number;  // Rendimento + sobra anterior
  cotasCompradasRendimento: number;  // Novas cotas inteiras compradas só com os dividendos
  sobraFim: number;                   // Saldo residual em R$ que sobra após comprar cotas inteiras
  cotasAporte: number;                // Cotas compradas com dinheiro do bolso
  cotasTotalFim: number;              // Total de cotas acumuladas ao final do mês
  patrimonioTotal: number;            // Valor de mercado das cotas (cotasTotalFim * valorCota)
}

export interface FiiResult {
  ticker: string;
  valorCota: number;
  dividendoPorCotaMensal: number;
  cotasDoBolso: number;              // Total de cotas compradas do bolso (iniciais + aportes)
  cotasReinvestidas: number;         // Total de cotas obtidas reinvestindo dividendos
  totalCotasFinal: number;           // Total acumulado final
  patrimonioFinal: number;           // Patrimônio total acumulado em cotas
  totalInvestidoBolso: number;       // Valor total em R$ tirado do próprio bolso
  totalRendimentosRecebidos: number; // Valor total em R$ recebido de dividendos
  rendimentoMensalFinal: number;     // Quanto renderá no próximo mês com o total de cotas
  magicNumber: number;               // Número de cotas para comprar 1 cota todo mês sem aporte
  atingiuMagicNumber: boolean;       // Se já ultrapassou o número mágico na simulação
  mesMagicNumber?: number;           // Mês em que atingiu o número mágico (se aplicável)
  cronograma: FiiMesRecord[];
}
