import { attachCurrencyMask, parseCurrencyInput } from './utils/masks';
import { formatCurrency, formatPercent } from './utils/formatters';
import { calculateEmergencyReserve } from './services/reservaCalculator';
import { reservaChartManager } from './charts/reservaChartManager';
import { reservaAnimManager } from './animations/reservaAnimManager';
import { setupNavbar } from './utils/navbar';
import type {
  WorkModel,
  ReservaInput,
  ReservaResult,
} from './types/reserva';

// Elementos do DOM
const form = document.getElementById('reserva-form') as HTMLFormElement;
const workModelSelect = document.getElementById('work-model') as HTMLSelectElement;
const salaryInput = document.getElementById('monthly-salary') as HTMLInputElement;
const expensesInput = document.getElementById('monthly-expenses') as HTMLInputElement;
const savingsInput = document.getElementById('monthly-savings') as HTMLInputElement;
const currentSavingsInput = document.getElementById('current-savings') as HTMLInputElement;
const btnClear = document.getElementById('btn-clear') as HTMLButtonElement;

// Tabela e Toggles
const toggleMonthlyBtn = document.getElementById('toggle-monthly') as HTMLButtonElement;
const toggleYearlyBtn = document.getElementById('toggle-yearly') as HTMLButtonElement;
const tableHeaderPeriod = document.getElementById('th-period') as HTMLTableCellElement;
const tableBody = document.getElementById('table-body') as HTMLTableSectionElement;

let currentResult: ReservaResult | null = null;
let currentGrouping: 'months' | 'years' = 'months';

/**
 * Renderiza as linhas da tabela de evolução da reserva
 */
function renderTable(result: ReservaResult, grouping: 'months' | 'years'): void {
  if (!tableBody) return;
  tableBody.innerHTML = '';

  if (grouping === 'years') {
    tableHeaderPeriod.textContent = 'Ano';
    const fragment = document.createDocumentFragment();

    result.yearlyRecords.forEach((record) => {
      const tr = document.createElement('tr');
      const badgeStatus = record.isTargetReached
        ? '<span style="color: var(--positive); font-weight: 700;">Meta Atingida!</span>'
        : formatCurrency(record.remainingToTarget);

      tr.innerHTML = `
        <td><strong>Ano ${record.year}</strong></td>
        <td>${formatCurrency(record.totalDepositedYear)}</td>
        <td class="col-highlight-total">${formatCurrency(record.accumulated)}</td>
        <td class="col-highlight-profit">${formatPercent(record.percentReached, 1)}</td>
        <td>${badgeStatus}</td>
      `;
      fragment.appendChild(tr);
    });

    tableBody.appendChild(fragment);
  } else {
    tableHeaderPeriod.textContent = 'Mês';
    const fragment = document.createDocumentFragment();

    result.monthlyRecords.forEach((record) => {
      const tr = document.createElement('tr');
      const badgeStatus = record.isTargetReached
        ? '<span style="color: var(--positive); font-weight: 700;">Meta Atingida!</span>'
        : formatCurrency(record.remainingToTarget);

      tr.innerHTML = `
        <td>Mês ${record.month} <span style="color: var(--muted); font-size: 11px;">(Ano ${record.year})</span></td>
        <td>${formatCurrency(record.deposit)}</td>
        <td class="col-highlight-total">${formatCurrency(record.accumulated)}</td>
        <td class="col-highlight-profit">${formatPercent(record.percentReached, 1)}</td>
        <td>${badgeStatus}</td>
      `;
      fragment.appendChild(tr);
    });

    tableBody.appendChild(fragment);
  }
}

function getFormData(): ReservaInput {
  return {
    workModel: workModelSelect.value as WorkModel,
    monthlySalary: parseCurrencyInput(salaryInput.value),
    monthlyExpenses: parseCurrencyInput(expensesInput.value),
    monthlySavings: parseCurrencyInput(savingsInput.value),
    currentSavings: parseCurrencyInput(currentSavingsInput.value),
  };
}

function executeSimulation(): void {
  const input = getFormData();
  currentResult = calculateEmergencyReserve(input);

  // Anima contadores dos KPIs via GSAP
  reservaAnimManager.animateCounters(
    currentResult.targetReserve,
    currentResult.monthsToTarget,
    currentResult.savingsRate
  );

  // Atualiza gráficos Chart.js
  const preferYearly = currentGrouping === 'years' || currentResult.monthlyRecords.length > 36;
  reservaChartManager.updateCharts(currentResult, preferYearly);

  // Renderiza tabela
  renderTable(currentResult, currentGrouping);
}

function clearAll(): void {
  salaryInput.value = '';
  expensesInput.value = '';
  savingsInput.value = '';
  currentSavingsInput.value = '';

  attachCurrencyMask(salaryInput, 0);
  attachCurrencyMask(expensesInput, 0);
  attachCurrencyMask(savingsInput, 0);
  attachCurrencyMask(currentSavingsInput, 0);

  workModelSelect.value = 'clt';

  currentResult = null;
  reservaAnimManager.animateReset();
  if (tableBody) tableBody.innerHTML = '';
  reservaChartManager.destroy();
}

function setupTableToggles(): void {
  toggleMonthlyBtn?.addEventListener('click', () => {
    if (currentGrouping === 'months') return;
    currentGrouping = 'months';
    toggleMonthlyBtn.classList.add('active');
    toggleYearlyBtn.classList.remove('active');

    if (currentResult) {
      renderTable(currentResult, 'months');
      reservaChartManager.updateCharts(currentResult, false);
    }
  });

  toggleYearlyBtn?.addEventListener('click', () => {
    if (currentGrouping === 'years') return;
    currentGrouping = 'years';
    toggleYearlyBtn.classList.add('active');
    toggleMonthlyBtn.classList.remove('active');

    if (currentResult) {
      renderTable(currentResult, 'years');
      reservaChartManager.updateCharts(currentResult, true);
    }
  });
}

function init(): void {
  // Configura a navegação (Dark Mode & Menu Hambúrguer)
  setupNavbar();

  // Inicializa todos os campos de entrada rigorosamente com 0
  attachCurrencyMask(salaryInput, 0);
  attachCurrencyMask(expensesInput, 0);
  attachCurrencyMask(savingsInput, 0);
  attachCurrencyMask(currentSavingsInput, 0);

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    executeSimulation();
  });

  btnClear?.addEventListener('click', clearAll);

  setupTableToggles();
  reservaAnimManager.initEntranceAnimations();

  // Redesenha gráficos se o tema for alternado
  window.addEventListener('theme-changed', () => {
    if (currentResult) {
      const preferYearly = currentGrouping === 'years' || currentResult.monthlyRecords.length > 36;
      reservaChartManager.updateCharts(currentResult, preferYearly);
    }
  });

  // Executa simulação inicial com valores zerados
  executeSimulation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
