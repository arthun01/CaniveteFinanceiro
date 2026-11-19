/**
 * Tipos para a Calculadora Regra 50/30/20 de Orçamento Pessoal
 */

export interface ItemGasto503020 {
  id: string;
  descricao: string;
  valor: number;
}

export type Categoria503020 = 'fixos' | 'variaveis' | 'investimentos';

export interface CategoriaResumo {
  categoria: Categoria503020;
  nome: string;
  percentualMeta: number; // 50, 30 ou 20
  valorMeta: number;      // R$ limite ideal
  valorRealizado: number; // R$ somatório dos gastos cadastrados
  percentualRealizado: number; // % sobre a renda
  saldoRestante: number;  // valorMeta - valorRealizado
  estourado: boolean;     // true se valorRealizado > valorMeta
  percentualUsoLimite: number; // (valorRealizado / valorMeta) * 100
  itens: ItemGasto503020[];
}

export interface ProjecaoMes503020 {
  mes: number;
  fixosAcumulado: number;
  variaveisAcumulado: number;
  investimentosAcumulado: number;
  totalAcumulado: number;
}

export interface Regra503020Input {
  rendaLiquida: number;
  gastosFixos?: ItemGasto503020[];
  gastosVariaveis?: ItemGasto503020[];
  gastosInvestimentos?: ItemGasto503020[];
}

export interface Regra503020Result {
  rendaLiquida: number;
  resumoFixos: CategoriaResumo;
  resumoVariaveis: CategoriaResumo;
  resumoInvestimentos: CategoriaResumo;
  totalRealizadoGeral: number;
  saldoRendaLivre: number;
  percentualTotalRealizado: number;
  temGastosCadastrados: boolean;
  projecaoAnual: ProjecaoMes503020[];
}
