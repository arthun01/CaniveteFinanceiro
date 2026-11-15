import {
  MargemLucroInput,
  MargemLucroResult,
  FaixaSensibilidadeMargem,
} from '../types/margemLucro';

/**
 * Motor Matemático Puro para Calculadora de Margem de Lucro e Markup
 *
 * Relações fundamentais:
 * - Lucro Bruto = Preço de Venda - Custo de Compra
 * - Margem de Lucro (%) = (Lucro Bruto / Preço de Venda) * 100
 * - Markup Multiplicador = Preço de Venda / Custo de Compra
 * - Markup Percentual (%) = (Lucro Bruto / Custo de Compra) * 100
 * - Preço de Venda a partir da Margem = Custo de Compra / (1 - Margem / 100)
 */

export function calcularMargemLucro(input: MargemLucroInput): MargemLucroResult {
  const { valorCompra, valorVenda, margemLucro, modo } = input;
  const quantidade = input.quantidade && input.quantidade > 0 ? Math.floor(input.quantidade) : 1;

  if (!valorCompra || valorCompra <= 0) {
    throw new Error('Informe um valor de compra (custo) válido e maior que zero.');
  }

  let valorVendaUnitario: number;
  let margemLucroPct: number;

  const calcularPorMargem =
    modo === 'margem' ||
    ((valorVenda === undefined || valorVenda === null || valorVenda <= 0) &&
      margemLucro !== undefined &&
      margemLucro !== null);

  if (calcularPorMargem) {
    if (margemLucro === undefined || isNaN(margemLucro)) {
      throw new Error('Informe a margem de lucro desejada em porcentagem.');
    }
    if (margemLucro >= 100) {
      throw new Error('A margem de lucro sobre a venda deve ser inferior a 100% quando há custo de aquisição.');
    }
    if (margemLucro <= -100) {
      throw new Error('A margem de lucro não pode ser menor ou igual a -100%.');
    }

    margemLucroPct = margemLucro;
    valorVendaUnitario = valorCompra / (1 - margemLucro / 100);
  } else {
    if (valorVenda === undefined || valorVenda === null || valorVenda <= 0) {
      throw new Error('Informe o valor de venda ou a margem de lucro desejada.');
    }

    valorVendaUnitario = valorVenda;
    margemLucroPct = ((valorVendaUnitario - valorCompra) / valorVendaUnitario) * 100;
  }

  const lucroBrutoUnitario = valorVendaUnitario - valorCompra;
  const gastoTotalCompra = valorCompra * quantidade;
  const valorTotalVenda = valorVendaUnitario * quantidade;
  const lucroBrutoTotal = lucroBrutoUnitario * quantidade;

  const markupMultiplicador = valorCompra > 0 ? valorVendaUnitario / valorCompra : 0;
  const markupPct = valorCompra > 0 ? (lucroBrutoUnitario / valorCompra) * 100 : 0;

  // Gera simulação com faixas de margem padrão para precificação comercial
  const faixasPadrao = [10, 20, 30, 40, 50, 60, 70, 80];
  const tabelaSimulacao: FaixaSensibilidadeMargem[] = faixasPadrao.map((m) => {
    const pVenda = valorCompra / (1 - m / 100);
    const lUnit = pVenda - valorCompra;
    return {
      margemPct: m,
      precoVendaUnitario: pVenda,
      lucroUnitario: lUnit,
      markupMultiplicador: pVenda / valorCompra,
      markupPct: (lUnit / valorCompra) * 100,
    };
  });

  return {
    quantidade,
    valorCompraUnitario: valorCompra,
    valorVendaUnitario,
    gastoTotalCompra,
    valorTotalVenda,
    lucroBrutoUnitario,
    lucroBrutoTotal,
    margemLucroPct,
    markupMultiplicador,
    markupPct,
    tabelaSimulacao,
  };
}
