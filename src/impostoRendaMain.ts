import { setupNavbar } from './utils/navbar';
import {
  attachCurrencyMask,
  parseCurrencyInput,
  parseIntegerInput,
} from './utils/masks';
import { formatCurrency, formatPercent } from './utils/formatters';
import {
  calculateImpostoRenda,
  DEDUCAO_POR_DEPENDENTE_MENSAL,
} from './services/impostoRendaCalculator';
import type {
  ImpostoRendaInput,
  ImpostoRendaResult,
} from './types/impostoRenda';
import { impostoRendaAnimManager } from './animations/impostoRendaAnimManager';

// Elementos do Formulário
const form = document.getElementById('ir-form') as HTMLFormElement | null;
const grossSalaryInput = document.getElementById('gross-salary') as HTMLInputElement;
const dependentsInput = document.getElementById('dependents-count') as HTMLInputElement;
const educationInput = document.getElementById('education-expenses') as HTMLInputElement;
const alimonyInput = document.getElementById('alimony-expenses') as HTMLInputElement;
const medicalInput = document.getElementById('medical-expenses') as HTMLInputElement;
const btnClear = document.getElementById('btn-clear');

// Elementos das Tabelas de Resultados
const tableEntradasBody = document.getElementById('table-entradas-body');
const tableDeducoesBody = document.getElementById('table-deducoes-body');
const tableCalculoBody = document.getElementById('table-calculo-body');

// Elementos de Feedback do Hero Balance Card
const kpiFaixaBadge = document.getElementById('kpi-faixa-badge');
const kpiSummaryText = document.getElementById('kpi-summary-text');

let currentResult: ImpostoRendaResult | null = null;

function readFormInputs(): ImpostoRendaInput {
  return {
    grossSalary: parseCurrencyInput(grossSalaryInput.value),
    dependentsCount: parseIntegerInput(dependentsInput.value),
    educationExpenses: parseCurrencyInput(educationInput.value),
    alimonyExpenses: parseCurrencyInput(alimonyInput.value),
    medicalExpenses: parseCurrencyInput(medicalInput.value),
  };
}

/**
 * Renderiza as 3 tabelas requeridas por ideia-3.md:
 * 1. Entrada e valores
 * 2. Deduções e valores
 * 3. Base de cálculo, alíquota e valor do imposto
 */
function renderBreakdownTables(res: ImpostoRendaResult): void {
  // 1. Tabela de Entradas
  if (tableEntradasBody) {
    tableEntradasBody.innerHTML = `
      <tr>
        <td><strong>Renda Mensal Bruta (Salário)</strong></td>
        <td>Rendimento formalizado antes dos descontos</td>
        <td class="col-highlight-total">${formatCurrency(res.grossSalary)}</td>
      </tr>
      <tr class="table-row-total">
        <td><strong>Total de Entradas Brutas</strong></td>
        <td>Base inicial para apuração tributária</td>
        <td class="col-highlight-total"><strong>${formatCurrency(res.grossSalary)}</strong></td>
      </tr>
    `;
  }

  // 2. Tabela de Deduções
  if (tableDeducoesBody) {
    const dependentesText =
      res.dependentsCount > 0
        ? `${res.dependentsCount} dependente(s) × ${formatCurrency(DEDUCAO_POR_DEPENDENTE_MENSAL)}/mês`
        : 'Nenhum dependente informado';

    tableDeducoesBody.innerHTML = `
      <tr class="table-row-highlight">
        <td><strong>Previdência Oficial (INSS)</strong></td>
        <td>Desconto progressivo automático (${formatPercent(res.inssEffectiveRate, 2)} efetivo)</td>
        <td class="col-highlight-profit"><strong>${formatCurrency(res.inssDiscount)}</strong></td>
      </tr>
      <tr>
        <td><strong>Dedução por Dependentes</strong></td>
        <td>${dependentesText}</td>
        <td>${formatCurrency(res.dependentsDeduction)}</td>
      </tr>
      <tr>
        <td><strong>Pensão Alimentícia</strong></td>
        <td>Valor mensal fixado judicialmente</td>
        <td>${formatCurrency(res.alimonyExpenses)}</td>
      </tr>
      <tr>
        <td><strong>Despesas Médicas</strong></td>
        <td>Gastos com saúde, planos e consultas</td>
        <td>${formatCurrency(res.medicalExpenses)}</td>
      </tr>
      <tr>
        <td><strong>Despesas com Ensino</strong></td>
        <td>Instrução, escolas, faculdades e cursos</td>
        <td>${formatCurrency(res.educationExpenses)}</td>
      </tr>
      <tr class="table-row-total">
        <td><strong>Total Geral de Deduções</strong></td>
        <td>Soma do INSS e demais deduções legais</td>
        <td class="col-highlight-profit"><strong>${formatCurrency(res.totalDeductions)}</strong></td>
      </tr>
    `;
  }

  // 3. Tabela de Base de Cálculo, Alíquota e Imposto
  if (tableCalculoBody) {
    const statusIsencao = res.isExempt
      ? '<span style="color: var(--positive); font-weight: 700;">Isento de IRRF</span>'
      : `<span style="color: var(--ink); font-weight: 700;">${res.faixa.label}</span>`;

    const parcelaTexto =
      res.deductionParcel > 0
        ? formatCurrency(res.deductionParcel)
        : 'R$ 0,00 (Faixa Isenta)';

    tableCalculoBody.innerHTML = `
      <tr>
        <td><strong>Base de Cálculo do Imposto</strong></td>
        <td>Salário Bruto (${formatCurrency(res.grossSalary)}) – Deduções Totais (${formatCurrency(res.totalDeductions)})</td>
        <td class="col-highlight-total"><strong>${formatCurrency(res.taxableBase)}</strong></td>
      </tr>
      <tr>
        <td><strong>Faixa da Tabela Progressiva</strong></td>
        <td>Enquadramento pela base de cálculo</td>
        <td>${statusIsencao}</td>
      </tr>
      <tr>
        <td><strong>Alíquota Nominal da Faixa</strong></td>
        <td>Percentual aplicado sobre a base de cálculo</td>
        <td><strong>${formatPercent(res.aliquotaNominal, 1)}</strong></td>
      </tr>
      <tr>
        <td><strong>Parcela a Deduzir</strong></td>
        <td>Abatimento legal correspondente à faixa</td>
        <td>${parcelaTexto}</td>
      </tr>
      <tr class="table-row-highlight">
        <td><strong>Imposto Retido na Fonte (IRRF)</strong></td>
        <td>(Base de Cálculo × Alíquota) – Parcela a Deduzir</td>
        <td class="col-highlight-profit" style="font-size: 16px;"><strong>${formatCurrency(res.taxDue)}</strong></td>
      </tr>
      <tr>
        <td><strong>Alíquota Efetiva do IRRF</strong></td>
        <td>Percentual do imposto retido sobre o salário bruto total</td>
        <td><strong>${formatPercent(res.effectiveRate, 2)}</strong></td>
      </tr>
      <tr>
        <td><strong>Total Descontado em Folha</strong></td>
        <td>Desconto do INSS (${formatCurrency(res.inssDiscount)}) + IRRF (${formatCurrency(res.taxDue)})</td>
        <td class="col-highlight-profit"><strong>${formatCurrency(res.totalMandatoryDiscounts)}</strong></td>
      </tr>
      <tr class="table-row-total">
        <td><strong>Salário Líquido Estimado</strong></td>
        <td>Renda bruta mensal menos os descontos obrigatórios (INSS + IRRF)</td>
        <td class="col-highlight-total" style="font-size: 16px;"><strong>${formatCurrency(res.netSalary)}</strong></td>
      </tr>
    `;
  }
}

/**
 * Executa a simulação e atualiza contadores e tabelas
 */
function executeSimulation(animateReveal = false): void {
  const input = readFormInputs();
  currentResult = calculateImpostoRenda(input);

  // Atualiza o badge do card Hero
  if (kpiFaixaBadge) {
    if (currentResult.isExempt) {
      kpiFaixaBadge.textContent = 'Isento de IRRF';
      kpiFaixaBadge.className = 'lime-chip';
    } else {
      kpiFaixaBadge.textContent = `Faixa ${currentResult.faixa.faixaIndex} (${formatPercent(currentResult.aliquotaNominal, 1)})`;
      kpiFaixaBadge.className = 'lime-chip';
    }
  }

  // Atualiza o texto resumo do card Hero
  if (kpiSummaryText) {
    if (currentResult.grossSalary === 0) {
      kpiSummaryText.textContent = 'Informe sua renda mensal para calcular a retenção.';
    } else if (currentResult.isExempt) {
      kpiSummaryText.textContent = `Base de ${formatCurrency(
        currentResult.taxableBase
      )} isenta de IRRF (INSS de ${formatCurrency(currentResult.inssDiscount)} deduzido).`;
    } else {
      kpiSummaryText.textContent = `Alíquota efetiva de ${formatPercent(
        currentResult.effectiveRate,
        2
      )} sobre a renda bruta de ${formatCurrency(currentResult.grossSalary)} (INSS: ${formatCurrency(currentResult.inssDiscount)}).`;
    }
  }

  // Anima os números dos KPIs
  impostoRendaAnimManager.animateCounters(
    currentResult.taxDue,
    currentResult.grossSalary,
    currentResult.inssDiscount,
    currentResult.totalDeductions,
    currentResult.taxableBase,
    currentResult.effectiveRate,
    currentResult.netSalary
  );

  // Renderiza as 3 tabelas
  renderBreakdownTables(currentResult);

  if (animateReveal) {
    impostoRendaAnimManager.animateResultsReveal();
  }
}

/**
 * Limpa todos os campos para 0 e recalcula
 */
function clearAll(): void {
  attachCurrencyMask(grossSalaryInput, 0);
  dependentsInput.value = '0';
  attachCurrencyMask(educationInput, 0);
  attachCurrencyMask(alimonyInput, 0);
  attachCurrencyMask(medicalInput, 0);

  executeSimulation(false);
}

function init(): void {
  // Configura navegação e tema
  setupNavbar();

  // Inicializa todos os campos monetários com 0
  attachCurrencyMask(grossSalaryInput, 0);
  dependentsInput.value = '0';
  attachCurrencyMask(educationInput, 0);
  attachCurrencyMask(alimonyInput, 0);
  attachCurrencyMask(medicalInput, 0);

  // Previne valores negativos no input de dependentes
  dependentsInput.addEventListener('input', () => {
    const val = parseIntegerInput(dependentsInput.value);
    dependentsInput.value = String(Math.max(0, val));
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    executeSimulation(true);
  });

  btnClear?.addEventListener('click', clearAll);

  // Inicializa animações de entrada
  impostoRendaAnimManager.initEntranceAnimations();

  // Simulação inicial com campos zerados
  executeSimulation(false);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
