import { FiiInput, FiiMesRecord, FiiResult } from '../types/fii';
import { round2 } from '../utils/formatters';

/**
 * Motor de Cálculo para Simulação de Fundos Imobiliários (FIIs)
 * e Efeito Bola de Neve (Snowball Effect / Reinvestimento de Dividendos).
 */
export function calcularFii(input: FiiInput): FiiResult {
  const ticker = (input.ticker && input.ticker.trim()) ? input.ticker.trim().toUpperCase() : 'FII';
  const valorCota = Math.max(0, input.valorCota || 0);
  const dividendYieldAnual = Math.max(0, input.dividendYieldAnual || 0);
  const cotasIniciais = Math.max(0, Math.floor(input.cotasIniciais || 0));
  const cotasAporte = Math.max(0, Math.floor(input.cotasAporteMensal || 0));
  const prazoMeses = Math.max(1, Math.floor(input.prazoMeses || 24));

  // Se o valor da cota for zero ou se não houver cota inicial nem aporte mensal,
  // retornamos resultado zerado e cronograma vazio.
  if (valorCota <= 0 || (cotasIniciais === 0 && cotasAporte === 0)) {
    return {
      ticker,
      valorCota,
      dividendoPorCotaMensal: 0,
      cotasDoBolso: 0,
      cotasReinvestidas: 0,
      totalCotasFinal: 0,
      patrimonioFinal: 0,
      totalInvestidoBolso: 0,
      totalRendimentosRecebidos: 0,
      rendimentoMensalFinal: 0,
      magicNumber: 0,
      atingiuMagicNumber: false,
      mesMagicNumber: undefined,
      cronograma: [],
    };
  }

  // Taxa mensal equivalente de dividendos (capitalização composta)
  const taxaMensal = dividendYieldAnual > 0 ? (Math.pow(1 + dividendYieldAnual / 100, 1 / 12) - 1) : 0;
  const dividendoPorCotaMensal = round2(valorCota * taxaMensal);

  // Número Mágico (Magic Number): cotas necessárias para que o dividendo pague pelo menos 1 cota todo mês
  const magicNumber = dividendoPorCotaMensal > 0 ? Math.ceil(valorCota / dividendoPorCotaMensal) : 0;

  const cronograma: FiiMesRecord[] = [];
  let cotasAcumuladas = cotasIniciais;
  let sobraCaixa = 0;
  let mesAtingiuMagicNumber: number | undefined;

  for (let mes = 1; mes <= prazoMeses; mes++) {
    // Regra: Se o input de cotas iniciais for 0, o primeiro mês é totalmente zerado.
    if (mes === 1 && cotasIniciais === 0) {
      cronograma.push({
        mes: 1,
        cotasInicio: 0,
        rendimentoMes: 0,
        sobraAnterior: 0,
        valorDisponivelReinvestir: 0,
        cotasCompradasRendimento: 0,
        sobraFim: 0,
        cotasAporte: 0,
        cotasTotalFim: 0,
        patrimonioTotal: 0,
      });
      continue;
    }

    let cotasNoMes: number;
    let aporteDesteMes = cotasAporte;

    if (mes === 1) {
      cotasNoMes = cotasIniciais;
    } else if (mes === 2 && cotasIniciais === 0) {
      cotasNoMes = cotasAporte;
    } else {
      cotasNoMes = cotasAcumuladas;
    }

    // Rendimento gerado pelas cotas ativas no início do mês
    const rendimentoMes = round2(cotasNoMes * dividendoPorCotaMensal);

    // Valor disponível para reinvestir = rendimento deste mês + sobra de caixa anterior
    const valorDisponivel = round2(rendimentoMes + sobraCaixa);

    // Quantas cotas inteiras é possível comprar apenas com os rendimentos
    const cotasCompradasRendimento = Math.floor(valorDisponivel / valorCota);

    // Sobra em dinheiro que fica na conta
    const sobraAtual = round2(valorDisponivel - (cotasCompradasRendimento * valorCota));

    // Cotas totais acumuladas ao final do mês
    let cotasTotalFim: number;
    if (mes === 2 && cotasIniciais === 0) {
      cotasTotalFim = cotasNoMes + cotasCompradasRendimento;
    } else {
      cotasTotalFim = cotasNoMes + aporteDesteMes + cotasCompradasRendimento;
    }

    const patrimonioTotal = round2(cotasTotalFim * valorCota);

    // Verifica se bateu o número mágico
    if (magicNumber > 0 && cotasTotalFim >= magicNumber && mesAtingiuMagicNumber === undefined) {
      mesAtingiuMagicNumber = mes;
    }

    cronograma.push({
      mes,
      cotasInicio: cotasNoMes,
      rendimentoMes,
      sobraAnterior: sobraCaixa,
      valorDisponivelReinvestir: valorDisponivel,
      cotasCompradasRendimento,
      sobraFim: sobraAtual,
      cotasAporte: aporteDesteMes,
      cotasTotalFim,
      patrimonioTotal,
    });

    cotasAcumuladas = cotasTotalFim;
    sobraCaixa = sobraAtual;
  }

  const cotasDoBolso = cronograma.reduce((acc, cur) => acc + cur.cotasAporte, (cotasIniciais > 0 ? cotasIniciais : 0));
  const totalCotasReinvestidas = cronograma.reduce((acc, cur) => acc + cur.cotasCompradasRendimento, 0);
  const totalRendimentos = cronograma.reduce((acc, cur) => round2(acc + cur.rendimentoMes), 0);
  const totalCotasFinal = cronograma.length > 0 ? cronograma[cronograma.length - 1].cotasTotalFim : 0;
  const patrimonioFinal = round2(totalCotasFinal * valorCota);
  const totalInvestidoBolso = round2(cotasDoBolso * valorCota);
  const rendimentoMensalFinal = round2(totalCotasFinal * dividendoPorCotaMensal);

  return {
    ticker,
    valorCota,
    dividendoPorCotaMensal,
    cotasDoBolso,
    cotasReinvestidas: totalCotasReinvestidas,
    totalCotasFinal,
    patrimonioFinal,
    totalInvestidoBolso,
    totalRendimentosRecebidos: totalRendimentos,
    rendimentoMensalFinal,
    magicNumber,
    atingiuMagicNumber: totalCotasFinal >= magicNumber,
    mesMagicNumber: mesAtingiuMagicNumber,
    cronograma,
  };
}
