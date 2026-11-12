import { FinanciamentoInput, FinanciamentoResult, ModoFinanciamento, ParcelaPrice } from '../types/financiamento';

/**
 * Motor Matemático Puro para Financiamento com Prestações Fixas (Tabela Price)
 * Modelo oficial da Calculadora do Cidadão do Banco Central do Brasil.
 *
 * Fórmula fundamental:
 * q_0 = p * [ 1 - (1 + j)^(-n) ] / j
 */

/**
 * Calcula o valor da prestação periódica fixa (p)
 */
export function calcularPrestacao(valorFinanciado: number, taxaJurosDecimal: number, meses: number): number {
  if (meses <= 0) throw new Error('O número de meses deve ser maior que zero.');
  if (valorFinanciado <= 0) throw new Error('O valor financiado deve ser maior que zero.');

  if (taxaJurosDecimal === 0) {
    return valorFinanciado / meses;
  }

  const fator = Math.pow(1 + taxaJurosDecimal, -meses);
  return valorFinanciado * (taxaJurosDecimal / (1 - fator));
}

/**
 * Calcula o valor financiado presente (q0)
 */
export function calcularValorFinanciado(valorPrestacao: number, taxaJurosDecimal: number, meses: number): number {
  if (meses <= 0) throw new Error('O número de meses deve ser maior que zero.');
  if (valorPrestacao <= 0) throw new Error('O valor da prestação deve ser maior que zero.');

  if (taxaJurosDecimal === 0) {
    return valorPrestacao * meses;
  }

  const fator = Math.pow(1 + taxaJurosDecimal, -meses);
  return valorPrestacao * ((1 - fator) / taxaJurosDecimal);
}

/**
 * Calcula o número total de meses (n)
 */
export function calcularNumeroMeses(valorFinanciado: number, valorPrestacao: number, taxaJurosDecimal: number): number {
  if (valorFinanciado <= 0) throw new Error('O valor financiado deve ser maior que zero.');
  if (valorPrestacao <= 0) throw new Error('O valor da prestação deve ser maior que zero.');

  if (taxaJurosDecimal === 0) {
    return valorFinanciado / valorPrestacao;
  }

  const jurosPrimeiroMes = valorFinanciado * taxaJurosDecimal;
  if (valorPrestacao <= jurosPrimeiroMes) {
    throw new Error(
      `A prestação informada (R$ ${valorPrestacao.toFixed(2)}) é insuficiente para amortizar a dívida, pois é inferior ou igual aos juros mensais iniciais (R$ ${jurosPrimeiroMes.toFixed(2)}).`
    );
  }

  const numerador = Math.log(1 - (valorFinanciado * taxaJurosDecimal) / valorPrestacao);
  const denominador = Math.log(1 + taxaJurosDecimal);

  return -numerador / denominador;
}

/**
 * Calcula a taxa de juros mensal (j) por aproximação numérica
 * Margem de erro estritamente inferior a 0.000001 sobre o valor da prestação (p).
 */
export function calcularTaxaJuros(valorFinanciado: number, valorPrestacao: number, meses: number): number {
  if (meses <= 0) throw new Error('O número de meses deve ser maior que zero.');
  if (valorFinanciado <= 0) throw new Error('O valor financiado deve ser maior que zero.');
  if (valorPrestacao <= 0) throw new Error('O valor da prestação deve ser maior que zero.');

  const totalPago = meses * valorPrestacao;
  const diferenca = totalPago - valorFinanciado;

  // Se o total pago for idêntico ao financiado, taxa é zero
  if (Math.abs(diferenca) < 1e-6) {
    return 0;
  }

  // Se o total pago for menor que o financiado, configuraria taxa negativa
  if (diferenca < 0) {
    throw new Error('O montante total pago é menor que o valor financiado. O cálculo de juros negativos não é suportado.');
  }

  // Busca binária para convergência com precisão < 0.000001 sobre p
  let low = 0.0000001;
  let high = 5.0; // 500% ao mês

  // Expande o teto caso a prestação seja anormalmente elevada
  while (valorFinanciado * high / (1 - Math.pow(1 + high, -meses)) < valorPrestacao && high < 1000.0) {
    high *= 2;
  }

  for (let iter = 0; iter < 120; iter++) {
    const mid = (low + high) / 2;
    const pCalc = valorFinanciado * (mid / (1 - Math.pow(1 + mid, -meses)));
    const erro = Math.abs(pCalc - valorPrestacao);

    if (erro < 0.0000008) {
      return mid;
    }

    if (pCalc < valorPrestacao) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
}

/**
 * Gera a tabela de amortização completa pelo Sistema Francês (Tabela Price)
 */
export function gerarCronogramaPrice(
  valorFinanciado: number,
  valorPrestacao: number,
  taxaJurosDecimal: number,
  meses: number
): ParcelaPrice[] {
  const cronograma: ParcelaPrice[] = [];
  let saldo = valorFinanciado;
  const mesesInteiros = Math.max(1, Math.round(meses));

  for (let k = 1; k <= mesesInteiros; k++) {
    const juros = saldo * taxaJurosDecimal;
    let amortizacao = valorPrestacao - juros;
    let prestacao = valorPrestacao;

    if (k === mesesInteiros) {
      // Ajuste na última parcela para zerar resíduos decimais
      amortizacao = saldo;
      prestacao = amortizacao + juros;
      saldo = 0;
    } else {
      saldo = Math.max(0, saldo - amortizacao);
    }

    cronograma.push({
      mes: k,
      prestacao,
      juros,
      amortizacao,
      saldoDevedor: saldo,
    });
  }

  return cronograma;
}

/**
 * Resolve o financiamento a partir dos parâmetros fornecidos,
 * determinando automaticamente a variável faltante ou usando a selecionada.
 */
export function resolverFinanciamento(input: FinanciamentoInput): FinanciamentoResult {
  const { meses: nInput, taxaJurosMensal: jInput, valorPrestacao: pInput, valorFinanciado: q0Input, modoDesejado } = input;

  // Determina o modo de cálculo
  let modo: ModoFinanciamento;

  if (modoDesejado) {
    modo = modoDesejado;
  } else {
    // Detecção automática do campo ausente
    const missing: ModoFinanciamento[] = [];
    if (!pInput || pInput <= 0) missing.push('prestacao');
    if (!q0Input || q0Input <= 0) missing.push('financiado');
    if (jInput === undefined || jInput === null || isNaN(jInput)) missing.push('juros');
    if (!nInput || nInput <= 0) missing.push('meses');

    if (missing.length !== 1) {
      throw new Error('Preencha exatamente 3 dos 4 campos para calcular o parâmetro restante.');
    }
    modo = missing[0];
  }

  let nFinal: number;
  let jDecimal: number;
  let pFinal: number;
  let q0Final: number;

  switch (modo) {
    case 'prestacao': {
      if (!q0Input || q0Input <= 0) throw new Error('Informe o Valor Financiado válido.');
      if (jInput === undefined || isNaN(jInput) || jInput < 0) throw new Error('Informe uma Taxa de Juros Mensal válida.');
      if (!nInput || nInput <= 0) throw new Error('Informe o Número de Meses válido.');

      q0Final = q0Input;
      jDecimal = jInput / 100;
      nFinal = nInput;
      pFinal = calcularPrestacao(q0Final, jDecimal, nFinal);
      break;
    }
    case 'financiado': {
      if (!pInput || pInput <= 0) throw new Error('Informe o Valor da Prestação válido.');
      if (jInput === undefined || isNaN(jInput) || jInput < 0) throw new Error('Informe uma Taxa de Juros Mensal válida.');
      if (!nInput || nInput <= 0) throw new Error('Informe o Número de Meses válido.');

      pFinal = pInput;
      jDecimal = jInput / 100;
      nFinal = nInput;
      q0Final = calcularValorFinanciado(pFinal, jDecimal, nFinal);
      break;
    }
    case 'juros': {
      if (!q0Input || q0Input <= 0) throw new Error('Informe o Valor Financiado válido.');
      if (!pInput || pInput <= 0) throw new Error('Informe o Valor da Prestação válido.');
      if (!nInput || nInput <= 0) throw new Error('Informe o Número de Meses válido.');

      q0Final = q0Input;
      pFinal = pInput;
      nFinal = nInput;
      jDecimal = calcularTaxaJuros(q0Final, pFinal, nFinal);
      break;
    }
    case 'meses': {
      if (!q0Input || q0Input <= 0) throw new Error('Informe o Valor Financiado válido.');
      if (!pInput || pInput <= 0) throw new Error('Informe o Valor da Prestação válido.');
      if (jInput === undefined || isNaN(jInput) || jInput < 0) throw new Error('Informe uma Taxa de Juros Mensal válida.');

      q0Final = q0Input;
      pFinal = pInput;
      jDecimal = jInput / 100;
      nFinal = calcularNumeroMeses(q0Final, pFinal, jDecimal);
      break;
    }
  }

  const taxaJurosMensal = jDecimal * 100;
  const taxaJurosAnual = (Math.pow(1 + jDecimal, 12) - 1) * 100;

  const cronograma = gerarCronogramaPrice(q0Final, pFinal, jDecimal, nFinal);
  const totalPago = cronograma.reduce((acc, row) => acc + row.prestacao, 0);
  const totalJuros = cronograma.reduce((acc, row) => acc + row.juros, 0);
  const porcentagemJuros = totalPago > 0 ? (totalJuros / totalPago) * 100 : 0;

  return {
    modoCalculado: modo,
    meses: nFinal,
    taxaJurosMensal,
    taxaJurosAnual,
    valorPrestacao: pFinal,
    valorFinanciado: q0Final,
    totalPago,
    totalJuros,
    porcentagemJuros,
    cronograma,
  };
}
