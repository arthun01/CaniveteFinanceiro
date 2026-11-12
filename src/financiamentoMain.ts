import { setupNavbar } from './utils/navbar';
import {
  attachCurrencyMask,
  parseCurrencyInput,
  parsePercentageInput,
  parseIntegerInput,
  formatCurrencyInputValue,
} from './utils/masks';
import { formatCurrency } from './utils/formatters';
import { resolverFinanciamento } from './services/financiamentoCalculator';
import { FinanciamentoChartManager } from './charts/financiamentoChartManager';
import { financiamentoAnimManager } from './animations/financiamentoAnimManager';
import type { ModoFinanciamento, FinanciamentoResult } from './types/financiamento';

// Instâncias
const chartManager = new FinanciamentoChartManager();

// Elementos do Formulário
const form = document.getElementById('fin-form') as HTMLFormElement;
const mesesInput = document.getElementById('fin-meses') as HTMLInputElement;
const jurosInput = document.getElementById('fin-juros') as HTMLInputElement;
const prestacaoInput = document.getElementById('fin-prestacao') as HTMLInputElement;
const financiadoInput = document.getElementById('fin-financiado') as HTMLInputElement;
const btnClear = document.getElementById('btn-clear') as HTMLButtonElement;
const errorAlert = document.getElementById('fin-error-alert') as HTMLElement;

// Indicadores visuais do campo alvo
const badgeTargetMeses = document.getElementById('badge-target-meses') as HTMLElement;
const badgeTargetJuros = document.getElementById('badge-target-juros') as HTMLElement;
const badgeTargetPrestacao = document.getElementById('badge-target-prestacao') as HTMLElement;
const badgeTargetFinanciado = document.getElementById('badge-target-financiado') as HTMLElement;

// Botoes do seletor de modalidade
const modeButtons = document.querySelectorAll<HTMLButtonElement>('.mode-btn');

// Elementos de KPI e Tabela
const kpiResultadoTitle = document.getElementById('kpi-resultado-title') as HTMLElement;
const kpiResultadoSub = document.getElementById('kpi-resultado-sub') as HTMLElement;
const kpiFinanciado = document.getElementById('kpi-financiado') as HTMLElement;
const kpiTotalPagoSub = document.getElementById('kpi-total-pago-sub') as HTMLElement;
const kpiCustoEfetivo = document.getElementById('kpi-custo-efetivo') as HTMLElement;
const badgeParcelas = document.getElementById('badge-parcelas') as HTMLElement;
const tableBody = document.getElementById('price-table-body') as HTMLTableSectionElement;

let currentMode: ModoFinanciamento = 'prestacao';
let currentResult: FinanciamentoResult | null = null;

/**
 * Atualiza o estado da interface ao trocar a variável a ser calculada
 */
function setMode(newMode: ModoFinanciamento): void {
  currentMode = newMode;
  hideError();

  // Atualiza botões
  modeButtons.forEach((btn) => {
    if (btn.dataset.mode === newMode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Reseta atributos e badges
  [badgeTargetMeses, badgeTargetJuros, badgeTargetPrestacao, badgeTargetFinanciado].forEach((b) => {
    if (b) b.style.display = 'none';
  });

  // Habilita todos os inputs primeiro
  [mesesInput, jurosInput, prestacaoInput, financiadoInput].forEach((inp) => {
    inp.readOnly = false;
    inp.style.background = '';
    inp.style.opacity = '1';
  });

  mesesInput.placeholder = 'Ex: 24';
  jurosInput.placeholder = 'Ex: 1,99';
  prestacaoInput.placeholder = 'R$ 0,00';
  financiadoInput.placeholder = 'R$ 0,00';

  // Configura o campo alvo específico
  switch (newMode) {
    case 'prestacao':
      if (badgeTargetPrestacao) badgeTargetPrestacao.style.display = 'inline-block';
      prestacaoInput.readOnly = true;
      prestacaoInput.value = '';
      prestacaoInput.placeholder = 'Será calculado automaticamente';
      if (kpiResultadoTitle) kpiResultadoTitle.textContent = 'Valor da Prestação (p)';
      if (kpiResultadoSub) kpiResultadoSub.textContent = 'Parcela periódica fixa postecipada';
      break;

    case 'financiado':
      if (badgeTargetFinanciado) badgeTargetFinanciado.style.display = 'inline-block';
      financiadoInput.readOnly = true;
      financiadoInput.value = '';
      financiadoInput.placeholder = 'Será calculado automaticamente';
      if (kpiResultadoTitle) kpiResultadoTitle.textContent = 'Valor Financiado (q₀)';
      if (kpiResultadoSub) kpiResultadoSub.textContent = 'Capital presente sem a entrada';
      break;

    case 'juros':
      if (badgeTargetJuros) badgeTargetJuros.style.display = 'inline-block';
      jurosInput.readOnly = true;
      jurosInput.value = '';
      jurosInput.placeholder = 'Será calculado';
      if (kpiResultadoTitle) kpiResultadoTitle.textContent = 'Taxa de Juros Mensal (j)';
      if (kpiResultadoSub) kpiResultadoSub.textContent = 'Taxa de juros embutida na operação';
      break;

    case 'meses':
      if (badgeTargetMeses) badgeTargetMeses.style.display = 'inline-block';
      mesesInput.readOnly = true;
      mesesInput.value = '';
      mesesInput.placeholder = 'Será calculado';
      if (kpiResultadoTitle) kpiResultadoTitle.textContent = 'Número de Meses (n)';
      if (kpiResultadoSub) kpiResultadoSub.textContent = 'Prazo total para quitação';
      break;
  }
}

function showError(msg: string): void {
  if (!errorAlert) return;
  errorAlert.textContent = msg;
  errorAlert.style.display = 'block';
}

function hideError(): void {
  if (!errorAlert) return;
  errorAlert.style.display = 'none';
  errorAlert.textContent = '';
}

function renderTable(result: FinanciamentoResult): void {
  if (!tableBody) return;
  tableBody.innerHTML = '';

  if (result.cronograma.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--muted); padding: 3rem 1rem; font-size: 14px;">
          Preencha os campos e clique em Calcular para visualizar a tabela de amortização.
        </td>
      </tr>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  result.cronograma.forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>Mês ${item.mes}</strong></td>
      <td class="col-highlight-total">${formatCurrency(item.prestacao)}</td>
      <td style="color: #e11d48; font-weight: 500;">${formatCurrency(item.juros)}</td>
      <td style="color: var(--positive); font-weight: 600;">${formatCurrency(item.amortizacao)}</td>
      <td>${formatCurrency(item.saldoDevedor)}</td>
    `;
    fragment.appendChild(tr);
  });

  tableBody.appendChild(fragment);
}

function updateUI(result: FinanciamentoResult): void {
  currentResult = result;
  hideError();

  // 1. Atualiza campo calculado no formulário
  if (currentMode === 'prestacao') {
    prestacaoInput.value = formatCurrencyInputValue(result.valorPrestacao);
  } else if (currentMode === 'financiado') {
    financiadoInput.value = formatCurrencyInputValue(result.valorFinanciado);
  } else if (currentMode === 'juros') {
    jurosInput.value = result.taxaJurosMensal.toFixed(4).replace('.', ',');
  } else if (currentMode === 'meses') {
    mesesInput.value = Math.round(result.meses).toString();
  }

  // 2. Animação de contadores nos cards de KPI
  let valDestaque = 0;
  if (currentMode === 'prestacao') valDestaque = result.valorPrestacao;
  else if (currentMode === 'financiado') valDestaque = result.valorFinanciado;
  else if (currentMode === 'juros') valDestaque = result.taxaJurosMensal;
  else if (currentMode === 'meses') valDestaque = result.meses;

  financiamentoAnimManager.animateCounters(
    currentMode,
    valDestaque,
    result.totalPago,
    result.totalJuros,
    result.porcentagemJuros
  );

  // 3. Textos de apoio dos KPIs
  if (kpiFinanciado) {
    kpiFinanciado.textContent = formatCurrency(result.valorFinanciado);
  }

  if (kpiResultadoSub) {
    if (currentMode === 'juros') {
      kpiResultadoSub.textContent = `Equivalente anual: ${result.taxaJurosAnual.toFixed(2).replace('.', ',')}% a.a.`;
    } else if (currentMode === 'meses') {
      kpiResultadoSub.textContent = `Prazo total de ${Math.round(result.meses)} parcelas mensais`;
    } else if (currentMode === 'prestacao') {
      kpiResultadoSub.textContent = `Parcela fixa mensal em ${result.cronograma.length}x`;
    } else {
      kpiResultadoSub.textContent = `Capital financiado inicial sem a entrada`;
    }
  }

  if (kpiTotalPagoSub) {
    kpiTotalPagoSub.textContent = `${result.cronograma.length} parcelas de ${formatCurrency(result.valorPrestacao)}`;
  }

  if (kpiCustoEfetivo) {
    kpiCustoEfetivo.textContent = `${result.porcentagemJuros.toFixed(1).replace('.', ',')}% do total pago é juros`;
  }

  if (badgeParcelas) {
    badgeParcelas.textContent = `${result.cronograma.length} Parcelas Fixas`;
  }

  // 4. Gráfico Donut de Proporção
  chartManager.updateChart(result);

  // 5. Tabela de Amortização Price
  renderTable(result);
}

function runCalculation(): void {
  hideError();

  const meses = parseIntegerInput(mesesInput.value);
  const taxaJurosMensal = parsePercentageInput(jurosInput.value);
  const valorPrestacao = parseCurrencyInput(prestacaoInput.value);
  const valorFinanciado = parseCurrencyInput(financiadoInput.value);

  try {
    const result = resolverFinanciamento({
      meses: currentMode === 'meses' ? undefined : meses,
      taxaJurosMensal: currentMode === 'juros' ? undefined : taxaJurosMensal,
      valorPrestacao: currentMode === 'prestacao' ? undefined : valorPrestacao,
      valorFinanciado: currentMode === 'financiado' ? undefined : valorFinanciado,
      modoDesejado: currentMode,
    });

    updateUI(result);
  } catch (err: any) {
    showError(err.message || 'Erro ao efetuar o cálculo. Verifique os valores informados.');
  }
}

function resetForm(): void {
  hideError();
  mesesInput.value = '';
  jurosInput.value = '';
  prestacaoInput.value = '';
  financiadoInput.value = '';

  if (kpiFinanciado) kpiFinanciado.textContent = 'R$ 0,00';
  if (badgeParcelas) badgeParcelas.textContent = '0 Parcelas';

  financiamentoAnimManager.resetCounters();
  chartManager.renderProportionChart(undefined);

  if (tableBody) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--muted); padding: 3rem 1rem; font-size: 14px;">
          Preencha os dados e clique em Calcular para visualizar o cronograma completo da Tabela Price.
        </td>
      </tr>
    `;
  }

  setMode('prestacao');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  financiamentoAnimManager.initEntranceAnimations();

  // Aplica máscaras de moeda
  attachCurrencyMask(prestacaoInput, null);
  attachCurrencyMask(financiadoInput, null);

  // Seletor de modalidade
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode as ModoFinanciamento;
      if (mode) setMode(mode);
    });
  });

  // Configuração inicial padrão
  setMode('prestacao');
  chartManager.renderProportionChart(undefined);

  // Eventos de envio e limpeza
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    runCalculation();
  });

  btnClear.addEventListener('click', resetForm);

  // Escuta alteração de tema para redesenhar o gráfico com as cores adequadas
  window.addEventListener('theme-changed', () => {
    if (currentResult) {
      chartManager.updateChart(currentResult);
    } else {
      chartManager.renderProportionChart(undefined);
    }
  });
});
