import {
  Regra503020Input,
  Regra503020Result,
  CategoriaResumo,
  ProjecaoMes503020,
  ItemGasto503020,
} from '../types/regra503020';

/**
 * Motor Matemático Puro para a Regra 50/30/20
 *
 * Divisões de Orçamento:
 * - 50%: Necessidades / Custos Fixos (Moradia, Contas, Alimentação essencial, Transporte)
 * - 30%: Desejos / Custos Variáveis (Lazer, Restaurantes, Compras, Hobbies)
 * - 20%: Futuro / Investir ou Quitar Dívidas (Reserva, Ações/FIIs, Amortização de Dívidas)
 */
export function calcularRegra503020(input: Regra503020Input): Regra503020Result {
  const rendaLiquida = input.rendaLiquida > 0 ? input.rendaLiquida : 0;

  const itensFixos = input.gastosFixos || [];
  const itensVariaveis = input.gastosVariaveis || [];
  const itensInvestimentos = input.gastosInvestimentos || [];

  const totalFixos = somarItens(itensFixos);
  const totalVariaveis = somarItens(itensVariaveis);
  const totalInvestimentos = somarItens(itensInvestimentos);

  const metaFixos = rendaLiquida * 0.5;
  const metaVariaveis = rendaLiquida * 0.3;
  const metaInvestimentos = rendaLiquida * 0.2;

  const resumoFixos = criarResumoCategoria(
    'fixos',
    'Custos Fixos (Necessidades)',
    50,
    metaFixos,
    totalFixos,
    rendaLiquida,
    itensFixos
  );

  const resumoVariaveis = criarResumoCategoria(
    'variaveis',
    'Custos Variáveis (Desejos & Lazer)',
    30,
    metaVariaveis,
    totalVariaveis,
    rendaLiquida,
    itensVariaveis
  );

  const resumoInvestimentos = criarResumoCategoria(
    'investimentos',
    'Investir ou Reduzir Dívidas',
    20,
    metaInvestimentos,
    totalInvestimentos,
    rendaLiquida,
    itensInvestimentos
  );

  const totalRealizadoGeral = totalFixos + totalVariaveis + totalInvestimentos;
  const saldoRendaLivre = rendaLiquida - totalRealizadoGeral;
  const percentualTotalRealizado = rendaLiquida > 0 ? (totalRealizadoGeral / rendaLiquida) * 100 : 0;
  const temGastosCadastrados = itensFixos.length > 0 || itensVariaveis.length > 0 || itensInvestimentos.length > 0;

  // Projeção de 12 meses
  const baseFixosMensal = temGastosCadastrados ? totalFixos : metaFixos;
  const baseVariaveisMensal = temGastosCadastrados ? totalVariaveis : metaVariaveis;
  const baseInvestimentosMensal = temGastosCadastrados ? totalInvestimentos : metaInvestimentos;

  const projecaoAnual: ProjecaoMes503020[] = [];
  for (let mes = 1; mes <= 12; mes++) {
    const fixosAcumulado = baseFixosMensal * mes;
    const variaveisAcumulado = baseVariaveisMensal * mes;
    const investimentosAcumulado = baseInvestimentosMensal * mes;
    const totalAcumulado = fixosAcumulado + variaveisAcumulado + investimentosAcumulado;

    projecaoAnual.push({
      mes,
      fixosAcumulado,
      variaveisAcumulado,
      investimentosAcumulado,
      totalAcumulado,
    });
  }

  return {
    rendaLiquida,
    resumoFixos,
    resumoVariaveis,
    resumoInvestimentos,
    totalRealizadoGeral,
    saldoRendaLivre,
    percentualTotalRealizado,
    temGastosCadastrados,
    projecaoAnual,
  };
}

function somarItens(itens: ItemGasto503020[]): number {
  return itens.reduce((acc, item) => acc + (item.valor > 0 ? item.valor : 0), 0);
}

function criarResumoCategoria(
  categoria: 'fixos' | 'variaveis' | 'investimentos',
  nome: string,
  percentualMeta: number,
  valorMeta: number,
  valorRealizado: number,
  rendaLiquida: number,
  itens: ItemGasto503020[]
): CategoriaResumo {
  const percentualRealizado = rendaLiquida > 0 ? (valorRealizado / rendaLiquida) * 100 : 0;
  const saldoRestante = valorMeta - valorRealizado;
  const estourado = valorRealizado > valorMeta && valorMeta > 0;
  const percentualUsoLimite = valorMeta > 0 ? (valorRealizado / valorMeta) * 100 : 0;

  return {
    categoria,
    nome,
    percentualMeta,
    valorMeta,
    valorRealizado,
    percentualRealizado,
    saldoRestante,
    estourado,
    percentualUsoLimite,
    itens,
  };
}
