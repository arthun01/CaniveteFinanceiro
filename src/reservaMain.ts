import { attachCurrencyMask, parseCurrencyInput } from './utils/masks';
import { formatCurrency, formatPercent } from './utils/formatters';
import { calculateEmergencyReserve } from './services/reservaCalculator';
import { reservaChartManager } from './charts/reservaChartManager';
import { reservaAnimManager } from './animations/reservaAnimManager';
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
        ? '<span style="color: var(--profit-light); font-weight: 600;">Meta Atingida!</span>'
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
        ? '<span style="color: var(--profit-light); font-weight: 600;">Meta Atingida!</span>'
        : formatCurrency(record.remainingToTarget);

      tr.innerHTML = `
        <td>Mês ${record.month} <span style="color: var(--text-subtle); font-size: 0.75rem;">(Ano ${record.year})</span></td>
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

  // Atualiza recomendação no texto auxiliar do select
  const helperEl = document.getElementById('work-model-helper');
  if (helperEl) {
    helperEl.textContent = `Recomendação: ${currentResult.recommendedMonths} meses de custo fixo`;
  }

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
  const helperEl = document.getElementById('work-model-helper');
  if (helperEl) {
    helperEl.textContent = 'Recomendação: 6 meses de custo fixo';
  }

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

function setupWorkModelChange(): void {
  workModelSelect?.addEventListener('change', () => {
    const helperEl = document.getElementById('work-model-helper');
    if (!helperEl) return;
    const model = workModelSelect.value;
    if (model === 'servidor_publico') {
      helperEl.textContent = 'Recomendação: 3 meses de custo fixo';
    } else if (model === 'clt') {
      helperEl.textContent = 'Recomendação: 6 meses de custo fixo';
    } else {
      helperEl.textContent = 'Recomendação: 12 meses de custo fixo';
    }
  });
}

function init(): void {
  // Inicializa máscaras
  attachCurrencyMask(salaryInput, 4000);       // R$ 4.000,00
  attachCurrencyMask(expensesInput, 2500);     // R$ 2.500,00
  attachCurrencyMask(savingsInput, 500);       // R$ 500,00
  attachCurrencyMask(currentSavingsInput, 1000); // R$ 1.000,00

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    executeSimulation();
  });

  btnClear?.addEventListener('click', clearAll);

  setupTableToggles();
  setupWorkModelChange();
  reservaAnimManager.initEntranceAnimations();

  // Executa primeira simulação
  executeSimulation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
