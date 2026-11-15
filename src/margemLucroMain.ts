import { setupNavbar } from './utils/navbar';
import {
  attachCurrencyMask,
  parseCurrencyInput,
  parsePercentageInput,
  parseIntegerInput,
  formatCurrencyInputValue,
} from './utils/masks';
import { formatCurrency, formatPercent } from './utils/formatters';
import { calcularMargemLucro } from './services/margemLucroCalculator';
import { MargemLucroChartManager } from './charts/margemLucroChartManager';
import { margemLucroAnimManager } from './animations/margemLucroAnimManager';
import type { ModoCalculoMargem, MargemLucroResult } from './types/margemLucro';

// Instâncias
const chartManager = new MargemLucroChartManager();

// Elementos do Formulário
const form = document.getElementById('margem-form') as HTMLFormElement;
const qtdInput = document.getElementById('margem-qtd') as HTMLInputElement;
const custoInput = document.getElementById('margem-custo') as HTMLInputElement;
const vendaInput = document.getElementById('margem-venda') as HTMLInputElement;
const pctInput = document.getElementById('margem-pct') as HTMLInputElement;
const btnClear = document.getElementById('btn-clear') as HTMLButtonElement;
const errorAlert = document.getElementById('margem-error-alert') as HTMLElement;

// Indicadores de Alvo
const badgeTargetVenda = document.getElementById('badge-target-venda') as HTMLElement;
const badgeTargetPct = document.getElementById('badge-target-pct') as HTMLElement;

// Botões do Seletor de Modo
const modeButtons = document.querySelectorAll<HTMLButtonElement>('.mode-btn');

// Elementos de Viabilidade e Alerta Visual
const viabilityBanner = document.getElementById('viability-banner') as HTMLElement;
const viabilityIcon = document.getElementById('viability-icon') as HTMLElement;
const viabilityText = document.getElementById('viability-text') as HTMLElement;

const cardKpiLucro = document.getElementById('card-kpi-lucro') as HTMLElement;
const cardKpiMargem = document.getElementById('card-kpi-margem') as HTMLElement;
const cardKpiMarkup = document.getElementById('card-kpi-markup') as HTMLElement;
const kpiLucroTitle = document.getElementById('kpi-lucro-title') as HTMLElement;
const kpiMargemTitle = document.getElementById('kpi-margem-title') as HTMLElement;
const kpiMarkupTitle = document.getElementById('kpi-markup-title') as HTMLElement;

// Elementos de KPI e Tabela
const kpiLucroSub = document.getElementById('kpi-lucro-sub') as HTMLElement;
const kpiMargemSub = document.getElementById('kpi-margem-sub') as HTMLElement;
const kpiMarkupSub = document.getElementById('kpi-markup-sub') as HTMLElement;
const kpiVendaSub = document.getElementById('kpi-venda-sub') as HTMLElement;
const badgeCustoReferencia = document.getElementById('badge-custo-referencia') as HTMLElement;
const tableBody = document.getElementById('margem-table-body') as HTMLTableSectionElement;

let currentMode: ModoCalculoMargem = 'venda';
let currentResult: MargemLucroResult | null = null;

/**
 * Atualiza o estado da interface ao alternar entre os modos
 */
function setMode(newMode: ModoCalculoMargem): void {
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

  if (newMode === 'venda') {
    // Usuário tem o preço de venda e quer calcular margem/markup
    vendaInput.readOnly = false;
    vendaInput.placeholder = 'R$ 0,00';
    if (badgeTargetVenda) badgeTargetVenda.style.display = 'none';

    pctInput.readOnly = true;
    pctInput.placeholder = 'Será calculada automaticamente';
    pctInput.value = '';
    if (badgeTargetPct) badgeTargetPct.style.display = 'inline-block';
  } else {
    // Usuário quer formar o preço a partir da margem desejada
    pctInput.readOnly = false;
    pctInput.placeholder = 'Ex: 66,67';
    if (badgeTargetPct) badgeTargetPct.style.display = 'none';

    vendaInput.readOnly = true;
    vendaInput.placeholder = 'Será calculado automaticamente';
    vendaInput.value = '';
    if (badgeTargetVenda) badgeTargetVenda.style.display = 'inline-block';
  }
}

function showError(message: string): void {
  if (!errorAlert) return;
  errorAlert.textContent = message;
  errorAlert.style.display = 'block';
}

function hideError(): void {
  if (!errorAlert) return;
  errorAlert.textContent = '';
  errorAlert.style.display = 'none';
}

/**
 * Atualiza o estado visual de viabilidade da operação
 * Se houver prejuízo, colore números e cartões em vermelho e emite alerta enfático
 */
function updateViabilityStatus(result: MargemLucroResult): void {
  const isLoss = result.lucroBrutoTotal < 0;
  const isZero = result.lucroBrutoTotal === 0;
  const isLowMargin = result.lucroBrutoTotal > 0 && result.margemLucroPct < 10;

  if (isLoss) {
    // ESTADO: PREJUÍZO / INVIABILIZADA (VERMELHO)
    cardKpiLucro?.classList.remove('kpi-warning', 'kpi-profit');
    cardKpiLucro?.classList.add('kpi-loss');

    cardKpiMargem?.classList.remove('kpi-warning', 'kpi-profit');
    cardKpiMargem?.classList.add('kpi-loss');

    cardKpiMarkup?.classList.remove('kpi-warning', 'kpi-profit');
    cardKpiMarkup?.classList.add('kpi-loss');

    if (kpiLucroTitle) kpiLucroTitle.textContent = 'Prejuízo Total';
    if (kpiMargemTitle) kpiMargemTitle.textContent = 'Margem Negativa';
    if (kpiMarkupTitle) kpiMarkupTitle.textContent = 'Markup Negativo';

    if (kpiLucroSub) {
      kpiLucroSub.textContent = `Prejuízo de ${formatCurrency(Math.abs(result.lucroBrutoUnitario))} por unidade`;
    }
    if (kpiMargemSub) {
      kpiMargemSub.textContent = `Preço abaixo do custo (${formatPercent(result.margemLucroPct, 2)})`;
    }
    if (kpiMarkupSub) {
      kpiMarkupSub.textContent = `Multiplicador defasado: ${result.markupMultiplicador.toFixed(2)}x`;
    }

    if (viabilityBanner && viabilityIcon && viabilityText) {
      viabilityBanner.className = 'viability-banner loss';
      viabilityBanner.style.display = 'flex';
      viabilityIcon.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
      viabilityText.innerHTML = `
        <strong>Venda Inviabilizada (Prejuízo Real):</strong> O preço de venda (${formatCurrency(result.valorVendaUnitario)}) é inferior ao custo de compra (${formatCurrency(result.valorCompraUnitario)}), gerando um prejuízo de <strong>${formatCurrency(Math.abs(result.lucroBrutoTotal))}</strong> na operação.
      `;
    }

    if (vendaInput) {
      vendaInput.style.borderColor = 'var(--red)';
    }
  } else if (isZero) {
    // ESTADO: PONTO DE EQUILÍBRIO (ZERO LUCRO - ÂMBAR)
    cardKpiLucro?.classList.remove('kpi-loss', 'kpi-profit');
    cardKpiLucro?.classList.add('kpi-warning');

    cardKpiMargem?.classList.remove('kpi-loss', 'kpi-profit');
    cardKpiMargem?.classList.add('kpi-warning');

    cardKpiMarkup?.classList.remove('kpi-loss', 'kpi-profit');
    cardKpiMarkup?.classList.add('kpi-warning');

    if (kpiLucroTitle) kpiLucroTitle.textContent = 'Lucro Bruto (Zero)';
    if (kpiMargemTitle) kpiMargemTitle.textContent = 'Margem de Lucro';
    if (kpiMarkupTitle) kpiMarkupTitle.textContent = 'Markup Percentual';

    if (kpiLucroSub) kpiLucroSub.textContent = 'Ponto de equilíbrio (R$ 0,00)';
    if (kpiMargemSub) kpiMargemSub.textContent = 'Margem 0,00% sobre a venda';
    if (kpiMarkupSub) kpiMarkupSub.textContent = 'Multiplicador: 1,0x o custo';

    if (viabilityBanner && viabilityIcon && viabilityText) {
      viabilityBanner.className = 'viability-banner warning';
      viabilityBanner.style.display = 'flex';
      viabilityIcon.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      `;
      viabilityText.innerHTML = `
        <strong>Ponto de Equilíbrio (0% de Margem):</strong> O valor cobrado apenas empata com o custo de compra. Qualquer despesa com imposto, taxa de maquininha ou frete deixará a venda no vermelho.
      `;
    }

    if (vendaInput) {
      vendaInput.style.borderColor = '#d97706';
    }
  } else if (isLowMargin) {
    // ESTADO: MARGEM BAIXA (< 10% - ÂMBAR)
    cardKpiLucro?.classList.remove('kpi-loss', 'kpi-warning');
    cardKpiLucro?.classList.add('kpi-profit');

    cardKpiMargem?.classList.remove('kpi-loss', 'kpi-profit');
    cardKpiMargem?.classList.add('kpi-warning');

    cardKpiMarkup?.classList.remove('kpi-loss', 'kpi-warning');

    if (kpiLucroTitle) kpiLucroTitle.textContent = 'Lucro Bruto Total';
    if (kpiMargemTitle) kpiMargemTitle.textContent = 'Margem de Lucro';
    if (kpiMarkupTitle) kpiMarkupTitle.textContent = 'Markup Percentual';

    if (kpiLucroSub) kpiLucroSub.textContent = `Lucro unitário: ${formatCurrency(result.lucroBrutoUnitario)}`;
    if (kpiMargemSub) kpiMargemSub.textContent = `Margem apertada (${formatPercent(result.margemLucroPct, 2)})`;
    if (kpiMarkupSub) kpiMarkupSub.textContent = `Multiplicador: ${result.markupMultiplicador.toFixed(2)}x o custo`;

    if (viabilityBanner && viabilityIcon && viabilityText) {
      viabilityBanner.className = 'viability-banner warning';
      viabilityBanner.style.display = 'flex';
      viabilityIcon.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
      viabilityText.innerHTML = `
        <strong>Margem de Lucro Baixa (${formatPercent(result.margemLucroPct, 2)}):</strong> Uma margem inferior a 10% deixa pouca folga financeira para cobrir impostos (Simples Nacional) e taxas de cartão (3% a 5%).
      `;
    }

    if (vendaInput) {
      vendaInput.style.borderColor = '';
    }
  } else {
    // ESTADO: VIÁVEL E LUCRATIVA (VERDE)
    cardKpiLucro?.classList.remove('kpi-loss', 'kpi-warning');
    cardKpiLucro?.classList.add('kpi-profit');

    cardKpiMargem?.classList.remove('kpi-loss', 'kpi-warning');
    cardKpiMargem?.classList.add('kpi-profit');

    cardKpiMarkup?.classList.remove('kpi-loss', 'kpi-warning');

    if (kpiLucroTitle) kpiLucroTitle.textContent = 'Lucro Bruto Total';
    if (kpiMargemTitle) kpiMargemTitle.textContent = 'Margem de Lucro';
    if (kpiMarkupTitle) kpiMarkupTitle.textContent = 'Markup Percentual';

    if (kpiLucroSub) kpiLucroSub.textContent = `Lucro unitário: ${formatCurrency(result.lucroBrutoUnitario)}`;
    if (kpiMargemSub) kpiMargemSub.textContent = `Sob o faturamento (${formatPercent(result.margemLucroPct, 2)})`;
    if (kpiMarkupSub) kpiMarkupSub.textContent = `Multiplicador: ${result.markupMultiplicador.toFixed(2)}x o custo`;
    if (kpiVendaSub) kpiVendaSub.textContent = `Custo total: ${formatCurrency(result.gastoTotalCompra)}`;

    if (viabilityBanner && viabilityIcon && viabilityText) {
      viabilityBanner.className = 'viability-banner profit';
      viabilityBanner.style.display = 'flex';
      viabilityIcon.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      `;
      viabilityText.innerHTML = `
        <strong>Precificação Viável e Saudável:</strong> Margem de <strong>${formatPercent(result.margemLucroPct, 2)}</strong> com lucro bruto de <strong>${formatCurrency(result.lucroBrutoTotal)}</strong> (${formatCurrency(result.lucroBrutoUnitario)} por unidade).
      `;
    }

    if (vendaInput) {
      vendaInput.style.borderColor = '';
    }
  }
}

/**
 * Renderiza as faixas de sensibilidade (10% a 80%) para simulação comercial
 */
function renderSensitivityTable(result: MargemLucroResult): void {
  if (!tableBody) return;

  if (badgeCustoReferencia) {
    badgeCustoReferencia.textContent = `Custo Unitário: ${formatCurrency(result.valorCompraUnitario)}`;
  }

  let currentUnviableRow = '';
  if (result.margemLucroPct < 0) {
    currentUnviableRow = `
      <tr style="background: var(--red-bg); color: var(--red); font-weight: 600;" class="sensitivity-row" title="Preço atual gerando prejuízo">
        <td><strong style="color: var(--red);">${formatPercent(result.margemLucroPct, 2)}</strong> <span style="font-size: 10px; background: var(--red); color: #fff; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">Atual (Inviável)</span></td>
        <td style="color: var(--red); font-weight: 700;">${formatCurrency(result.valorVendaUnitario)}</td>
        <td style="color: var(--red);">${formatCurrency(result.lucroBrutoUnitario)}</td>
        <td style="color: var(--red);">${result.markupMultiplicador.toFixed(2)}x</td>
        <td style="color: var(--red);">${formatPercent(result.markupPct, 1)}</td>
      </tr>
    `;
  }

  const rowsHtml = result.tabelaSimulacao
    .map((faixa) => {
      const isCurrentMargem = result.margemLucroPct >= 0 && Math.abs(faixa.margemPct - result.margemLucroPct) < 0.5;
      const highlightClass = isCurrentMargem ? 'style="background: rgba(24, 63, 53, 0.08); font-weight: 600;"' : '';
      const currentIndicator = isCurrentMargem
        ? ' <span style="font-size: 10px; background: var(--green); color: #fff; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">Atual</span>'
        : '';

      return `
        <tr ${highlightClass} class="sensitivity-row" data-margem="${faixa.margemPct}" style="cursor: pointer;" title="Clique para aplicar esta margem de ${faixa.margemPct}%">
          <td><strong>${faixa.margemPct}%</strong>${currentIndicator}</td>
          <td style="color: var(--green); font-weight: 600;">${formatCurrency(faixa.precoVendaUnitario)}</td>
          <td>${formatCurrency(faixa.lucroUnitario)}</td>
          <td>${faixa.markupMultiplicador.toFixed(2)}x</td>
          <td>${formatPercent(faixa.markupPct, 1)}</td>
        </tr>
      `;
    })
    .join('');

  tableBody.innerHTML = currentUnviableRow + rowsHtml;

  // Permite clicar em uma faixa da tabela para aplicá-la ao cálculo imediatamente
  const rows = tableBody.querySelectorAll<HTMLTableRowElement>('.sensitivity-row');
  rows.forEach((row) => {
    row.addEventListener('click', () => {
      const margemVal = row.dataset.margem;
      if (margemVal) {
        setMode('margem');
        pctInput.value = margemVal;
        runCalculation();
      }
    });
  });
}

function resetSensitivityTable(): void {
  if (badgeCustoReferencia) {
    badgeCustoReferencia.textContent = 'Custo: R$ 0,00';
  }
  if (tableBody) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--muted); padding: 3rem 1rem; font-size: 14px;">
          Preencha o custo de compra para visualizar a tabela de simulação de preços de 10% a 80% de margem.
        </td>
      </tr>
    `;
  }
}

/**
 * Executa o cálculo com os dados atuais do formulário
 */
function runCalculation(): void {
  hideError();

  const quantidade = parseIntegerInput(qtdInput.value) || 1;
  const valorCompra = parseCurrencyInput(custoInput.value);
  const valorVenda = parseCurrencyInput(vendaInput.value);
  const margemLucro = parsePercentageInput(pctInput.value);

  if (valorCompra <= 0) {
    showError('Por favor, informe um valor de compra (custo unitário) válido maior que zero.');
    custoInput.focus();
    return;
  }

  if (currentMode === 'venda') {
    if (valorVenda <= 0) {
      showError('Informe o preço de venda unitário para calcular a margem e o markup.');
      vendaInput.focus();
      return;
    }
  } else {
    if (!pctInput.value.trim()) {
      showError('Informe a margem de lucro desejada em porcentagem (ex: 30 para 30%).');
      pctInput.focus();
      return;
    }
    if (margemLucro >= 100) {
      showError('A margem de lucro sobre a venda deve ser estritamente inferior a 100% quando há custo de aquisição.');
      pctInput.focus();
      return;
    }
  }

  try {
    const result = calcularMargemLucro({
      quantidade,
      valorCompra,
      valorVenda: currentMode === 'venda' ? valorVenda : undefined,
      margemLucro: currentMode === 'margem' ? margemLucro : undefined,
      modo: currentMode,
    });

    currentResult = result;

    // Atualiza campo calculado correspondente
    if (currentMode === 'venda') {
      pctInput.value = formatPercent(result.margemLucroPct, 2);
    } else {
      vendaInput.value = formatCurrencyInputValue(result.valorVendaUnitario);
    }

    // Dispara animações de números nos KPIs
    margemLucroAnimManager.animateCounters(
      result.lucroBrutoTotal,
      result.margemLucroPct,
      result.markupPct,
      result.valorTotalVenda
    );

    // Atualiza subtítulo do faturamento total
    if (kpiVendaSub) {
      kpiVendaSub.textContent = `Custo total: ${formatCurrency(result.gastoTotalCompra)}`;
    }

    // Aplica o status de viabilidade (cores vermelhas, alertas e classes)
    updateViabilityStatus(result);

    // Atualiza gráfico de rosca
    chartManager.updateChart(result);

    // Atualiza tabela de sensibilidade
    renderSensitivityTable(result);
  } catch (err: any) {
    showError(err.message || 'Ocorreu um erro ao calcular a margem de lucro.');
  }
}

/**
 * Reseta o formulário e a interface para o estado inicial
 */
function resetForm(): void {
  qtdInput.value = '';
  custoInput.value = '';
  vendaInput.value = '';
  pctInput.value = '';
  currentResult = null;
  hideError();

  margemLucroAnimManager.resetCounters();

  if (cardKpiLucro) cardKpiLucro.className = 'kpi-card balance-card';
  if (cardKpiMargem) cardKpiMargem.className = 'kpi-card kpi-profit';
  if (cardKpiMarkup) cardKpiMarkup.className = 'kpi-card';
  if (kpiLucroTitle) kpiLucroTitle.textContent = 'Lucro Bruto Total';
  if (kpiMargemTitle) kpiMargemTitle.textContent = 'Margem de Lucro';
  if (kpiMarkupTitle) kpiMarkupTitle.textContent = 'Markup Percentual';

  if (kpiLucroSub) kpiLucroSub.textContent = 'Lucro unitário: R$ 0,00';
  if (kpiMargemSub) kpiMargemSub.textContent = 'Sob o faturamento de venda';
  if (kpiMarkupSub) kpiMarkupSub.textContent = 'Multiplicador: 0,0x o custo';
  if (kpiVendaSub) kpiVendaSub.textContent = 'Custo total: R$ 0,00';

  if (viabilityBanner) {
    viabilityBanner.style.display = 'none';
  }
  if (vendaInput) {
    vendaInput.style.borderColor = '';
  }

  chartManager.renderProportionChart(undefined);
  resetSensitivityTable();

  setMode(currentMode);
  custoInput.focus();
}

// Inicialização ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  margemLucroAnimManager.initEntranceAnimations();

  // Aplica máscaras nos campos monetários
  attachCurrencyMask(custoInput);
  attachCurrencyMask(vendaInput);

  // Modo padrão inicial
  setMode('venda');
  chartManager.renderProportionChart(undefined);
  resetSensitivityTable();

  // Eventos de clique nos botões de modo
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode as ModoCalculoMargem;
      if (mode) setMode(mode);
    });
  });

  // Eventos de envio e limpeza
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    runCalculation();
  });

  btnClear.addEventListener('click', resetForm);

  // Escuta alteração de tema para atualizar o gráfico
  window.addEventListener('theme-changed', () => {
    if (currentResult) {
      chartManager.updateChart(currentResult);
    } else {
      chartManager.renderProportionChart(undefined);
    }
  });
});
