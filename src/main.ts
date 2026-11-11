import { attachCurrencyMask, parseCurrencyInput } from './utils/masks';
import { formatCurrency } from './utils/formatters';
import { calculateCompoundInterest } from './services/calculator';
import { chartManager } from './charts/chartManager';
import { animManager } from './animations/animManager';
import { setupNavbar } from './utils/navbar';
import {
  RateFrequency,
  PeriodType,
  SimulationInput,
  SimulationResult,
  TableGrouping,
} from './types/finance';

// Elementos do DOM
const form = document.getElementById('calc-form') as HTMLFormElement;
const initialValueInput = document.getElementById('initial-value') as HTMLInputElement;
const monthlyDepositInput = document.getElementById('monthly-deposit') as HTMLInputElement;
const interestRateInput = document.getElementById('interest-rate') as HTMLInputElement;
const rateFrequencySelect = document.getElementById('rate-frequency') as HTMLSelectElement;
const periodInput = document.getElementById('period') as HTMLInputElement;
const periodTypeSelect = document.getElementById('period-type') as HTMLSelectElement;
const btnClear = document.getElementById('btn-clear') as HTMLButtonElement;

// Tabela e Toggles
const toggleMonthlyBtn = document.getElementById('toggle-monthly') as HTMLButtonElement;
const toggleYearlyBtn = document.getElementById('toggle-yearly') as HTMLButtonElement;
const tableHeaderPeriod = document.getElementById('th-period') as HTMLTableCellElement;
const tableBody = document.getElementById('table-body') as HTMLTableSectionElement;

// Estado da Aplicação
let currentResult: SimulationResult | null = null;
let currentTableGrouping: TableGrouping = 'months';

/**
 * Renderiza as linhas da tabela de amortização com base no agrupamento (mês ou ano)
 */
function renderTable(result: SimulationResult, grouping: TableGrouping): void {
  if (!tableBody) return;
  tableBody.innerHTML = '';

  if (grouping === 'years') {
    tableHeaderPeriod.textContent = 'Ano';
    const fragment = document.createDocumentFragment();

    result.yearlyRecords.forEach((record) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>Ano ${record.year}</strong></td>
        <td class="col-highlight-profit">${formatCurrency(record.interestYear)}</td>
        <td>${formatCurrency(record.totalInvested)}</td>
        <td class="col-highlight-profit">${formatCurrency(record.totalInterest)}</td>
        <td class="col-highlight-total">${formatCurrency(record.accumulated)}</td>
      `;
      fragment.appendChild(tr);
    });

    tableBody.appendChild(fragment);
  } else {
    tableHeaderPeriod.textContent = 'Mês';
    const fragment = document.createDocumentFragment();

    result.monthlyRecords.forEach((record) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>Mês ${record.period} <span style="color: var(--text-subtle); font-size: 0.75rem;">(Ano ${record.year})</span></td>
        <td class="col-highlight-profit">${formatCurrency(record.interestMonth)}</td>
        <td>${formatCurrency(record.totalInvested)}</td>
        <td class="col-highlight-profit">${formatCurrency(record.totalInterest)}</td>
        <td class="col-highlight-total">${formatCurrency(record.accumulated)}</td>
      `;
      fragment.appendChild(tr);
    });

    tableBody.appendChild(fragment);
  }
}

/**
 * Lê os dados dos inputs e retorna o objeto formatado
 */
function getFormData(): SimulationInput {
  const initialValue = parseCurrencyInput(initialValueInput.value);
  const monthlyDeposit = parseCurrencyInput(monthlyDepositInput.value);
  const interestRate = parseFloat(interestRateInput.value) || 0;
  const rateFrequency = rateFrequencySelect.value as RateFrequency;
  const period = parseInt(periodInput.value, 10) || 1;
  const periodType = periodTypeSelect.value as PeriodType;

  return {
    initialValue,
    monthlyDeposit,
    interestRate,
    rateFrequency,
    period,
    periodType,
  };
}

/**
 * Executa a simulação e atualiza a interface
 */
function executeSimulation(): void {
  const input = getFormData();
  currentResult = calculateCompoundInterest(input);

  // Anima números nos KPI Cards via GSAP
  animManager.animateKpiCounters(
    currentResult.totalInvested,
    currentResult.totalInterest,
    currentResult.totalFinal
  );

  // Atualiza gráficos Chart.js
  const preferYearly = currentTableGrouping === 'years' || currentResult.totalMonths > 36;
  chartManager.updateCharts(currentResult, preferYearly);

  // Renderiza tabela
  renderTable(currentResult, currentTableGrouping);
}

/**
 * Limpa todos os campos e reseta os resultados
 */
function clearAll(): void {
  initialValueInput.value = '';
  monthlyDepositInput.value = '';
  attachCurrencyMask(initialValueInput, 0);
  attachCurrencyMask(monthlyDepositInput, 0);

  interestRateInput.value = '10';
  rateFrequencySelect.value = 'yearly';
  periodInput.value = '5';
  periodTypeSelect.value = 'years';

  currentResult = null;
  animManager.animateReset();
  if (tableBody) tableBody.innerHTML = '';
  chartManager.destroy();
}

/**
 * Configuração dos botões de alternância da tabela
 */
function setupTableToggles(): void {
  toggleMonthlyBtn.addEventListener('click', () => {
    if (currentTableGrouping === 'months') return;
    currentTableGrouping = 'months';
    toggleMonthlyBtn.classList.add('active');
    toggleYearlyBtn.classList.remove('active');

    if (currentResult) {
      renderTable(currentResult, 'months');
      chartManager.updateCharts(currentResult, false);
    }
  });

  toggleYearlyBtn.addEventListener('click', () => {
    if (currentTableGrouping === 'years') return;
    currentTableGrouping = 'years';
    toggleYearlyBtn.classList.add('active');
    toggleMonthlyBtn.classList.remove('active');

    if (currentResult) {
      renderTable(currentResult, 'years');
      chartManager.updateCharts(currentResult, true);
    }
  });
}

/**
 * Inicialização da Aplicação
 */
function init(): void {
  // 0. Configura a navegação (Dark Mode & Menu Hambúrguer)
  setupNavbar();

  // 1. Aplica máscaras monetárias aos inputs com valores zerados
  attachCurrencyMask(initialValueInput, 0);
  attachCurrencyMask(monthlyDepositInput, 0);
  interestRateInput.value = '0';
  periodInput.value = '0';

  // 2. Inicializa eventos de formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    executeSimulation();
  });

  btnClear.addEventListener('click', () => {
    clearAll();
  });

  // 3. Configura alternador de visualização da tabela
  setupTableToggles();

  // 4. Inicia animações de entrada GSAP
  animManager.initEntranceAnimations();

  // 5. Redesenha gráficos ao alternar o tema
  window.addEventListener('theme-changed', () => {
    if (currentResult) {
      const preferYearly = currentTableGrouping === 'years' || currentResult.totalMonths > 36;
      chartManager.updateCharts(currentResult, preferYearly);
    }
  });

  // 6. Executa a primeira simulação inicial
  executeSimulation();
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
