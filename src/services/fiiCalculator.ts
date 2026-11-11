import { FiiInput, FiiMesRecord, FiiResult } from '../types/fii';
import { round2 } from '../utils/formatters';

/**
 * Motor de Cálculo para Simulação de Fundos Imobiliários (FIIs)
 * e Efeito Bola de Neve (Snowball Effect / Reinvestimento de Dividendos).
 */
export function calcularFii(input: FiiInput): FiiResult {
  const ticker = (input.ticker && input.ticker.trim()) ? input.ticker.trim().toUpperCase() : 'FII';
  const valorCota = Math.max(0.01, input.valorCota || 10);
  const dividendYieldAnual = Math.max(0, input.dividendYieldAnual || 0);
  const cotasIniciais = Math.max(0, Math.floor(input.cotasIniciais || 0));
  const cotasAporte = Math.max(0, Math.floor(input.cotasAporteMensal || 0));
  const prazoMeses = Math.max(1, Math.floor(input.prazoMeses || 24)); // Padrão: 2 anos (24 meses)

  // Taxa mensal equivalente de dividendos (capitalização composta)
  const taxaMensal = Math.pow(1 + dividendYieldAnual / 100, 1 / 12) - 1;
  const dividendoPorCotaMensal = round2(valorCota * taxaMensal);

  // Número Mágico (Magic Number): cotas necessárias para que o dividendo pague 1 cota todo mês
  const magicNumber = dividendoPorCotaMensal > 0 ? Math.ceil(valorCota / dividendoPorCotaMensal) : 0;

  const cronograma: FiiMesRecord[] = [];
  let cotasAcumuladas = cotasIniciais;
  let sobraCaixa = 0;
  let mesAtingiuMagicNumber: number | undefined;

  let totalRendimentos = 0;
  let totalCotasReinvestidas = 0;

  for (let mes = 1; mes <= prazoMeses; mes++) {
    // No início do mês, somamos o novo aporte do próprio bolso
    const cotasComAporte = cotasAcumuladas + cotasAporte;

    // Rendimento gerado pelas cotas ativas no mês
    const rendimentoMes = round2(cotasComAporte * dividendoPorCotaMensal);
    totalRendimentos = round2(totalRendimentos + rendimentoMes);

    // Valor disponível para reinvestir = rendimento deste mês + sobra de centavos do mês anterior
    const valorDisponivel = round2(rendimentoMes + sobraCaixa);

    // Quantas cotas inteiras é possível comprar apenas com os rendimentos
    const cotasCompradasRendimento = Math.floor(valorDisponivel / valorCota);
    totalCotasReinvestidas += cotasCompradasRendimento;

    // Sobra em dinheiro que fica na conta para acumular com o dividendo do mês seguinte
    const sobraAtual = round2(valorDisponivel - (cotasCompradasRendimento * valorCota));

    // Total de cotas ao final do mês
    const cotasTotalFim = cotasComAporte + cotasCompradasRendimento;
    const patrimonioTotal = round2(cotasTotalFim * valorCota);

    // Verifica se bateu o número mágico neste mês
    if (magicNumber > 0 && cotasTotalFim >= magicNumber && mesAtingiuMagicNumber === undefined) {
      mesAtingiuMagicNumber = mes;
    }

    cronograma.push({
      mes,
      cotasInicio: cotasComAporte,
      rendimentoMes,
      sobraAnterior: sobraCaixa,
      valorDisponivelReinvestir: valorDisponivel,
      cotasCompradasRendimento,
      sobraFim: sobraAtual,
      cotasAporte,
      cotasTotalFim,
      patrimonioTotal,
    });

    // Atualiza estado para o próximo mês
    cotasAcumuladas = cotasTotalFim;
    sobraCaixa = sobraAtual;
  }

  const cotasDoBolso = cotasIniciais + (cotasAporte * prazoMeses);
  const totalCotasFinal = cotasAcumuladas;
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
