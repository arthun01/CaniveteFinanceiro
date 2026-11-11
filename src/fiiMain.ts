import { setupNavbar } from './utils/navbar';
import { attachCurrencyMask, parseCurrencyInput, parsePercentageInput, parseIntegerInput } from './utils/masks';
import { formatCurrency } from './utils/formatters';
import { calcularFii } from './services/fiiCalculator';
import { FiiChartManager } from './charts/fiiChartManager';
import { fiiAnimManager } from './animations/fiiAnimManager';
import type { FiiInput, FiiResult } from './types/fii';

// Instâncias
const chartManager = new FiiChartManager();

// Elementos do Formulário
const form = document.getElementById('fii-form') as HTMLFormElement;
const tickerInput = document.getElementById('fii-ticker') as HTMLInputElement;
const dyInput = document.getElementById('fii-dy') as HTMLInputElement;
const valorCotaInput = document.getElementById('fii-valor-cota') as HTMLInputElement;
const cotasIniciaisInput = document.getElementById('fii-cotas-iniciais') as HTMLInputElement;
const cotasMensaisInput = document.getElementById('fii-cotas-mensais') as HTMLInputElement;
const prazoSelect = document.getElementById('fii-prazo') as HTMLSelectElement;
const btnClear = document.getElementById('btn-clear') as HTMLButtonElement;
const badgePrazo = document.getElementById('badge-prazo') as HTMLElement;

// Elementos de Tabela e Resumo
const tableBody = document.getElementById('fii-table-body') as HTMLTableSectionElement;
const subtextMagicNumber = document.getElementById('kpi-magic-status') as HTMLElement;
const subtextPatrimonio = document.getElementById('kpi-patrimonio-sub') as HTMLElement;
const subtextRendimento = document.getElementById('kpi-rendimento-sub') as HTMLElement;
const subtextCotasRendimento = document.getElementById('kpi-cotas-sub') as HTMLElement;

let currentResult: FiiResult | null = null;

function getInputs(): FiiInput {
  const ticker = tickerInput.value.trim() || 'FII';
  const dividendYieldAnual = parsePercentageInput(dyInput.value);
  const valorCota = parseCurrencyInput(valorCotaInput.value);
  const cotasIniciais = parseIntegerInput(cotasIniciaisInput.value);
  const cotasAporteMensal = parseIntegerInput(cotasMensaisInput.value);
  const prazoMeses = parseInt(prazoSelect?.value || '24', 10);

  return {
    ticker,
    dividendYieldAnual,
    valorCota,
    cotasIniciais,
    cotasAporteMensal,
    prazoMeses,
  };
}

function renderTable(result: FiiResult): void {
  if (!tableBody) return;
  tableBody.innerHTML = '';

  if (result.cronograma.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--muted); padding: 3rem 1rem; font-size: 14px;">
          Preencha os campos acima para ver a simulação mês a mês.
        </td>
      </tr>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  result.cronograma.forEach((item) => {
    const tr = document.createElement('tr');

    // Badge visual quando o número mágico é atingido (sem emoji)
    const magicBadge = (item.mes === result.mesMagicNumber)
      ? '<span style="display: inline-block; font-size: 10px; background: var(--green-soft); color: var(--green); padding: 2px 6px; border-radius: 6px; font-weight: 700; margin-left: 6px;">Magic Number</span>'
      : '';

    tr.innerHTML = `
      <td><strong>Mês ${item.mes}</strong></td>
      <td class="col-highlight-total">${item.cotasTotalFim} cotas ${magicBadge}</td>
      <td>${formatCurrency(item.patrimonioTotal)}</td>
      <td class="col-highlight-profit">+ ${formatCurrency(item.rendimentoMes)}</td>
      <td><strong>${item.cotasCompradasRendimento} ${item.cotasCompradasRendimento === 1 ? 'cota' : 'cotas'}</strong></td>
      <td style="color: var(--muted); font-size: 12px;">${item.cotasAporte > 0 ? '+ ' + item.cotasAporte : '0'}</td>
    `;
    fragment.appendChild(tr);
  });

  tableBody.appendChild(fragment);
}

function updateUI(result: FiiResult): void {
  currentResult = result;

  // 1. Animação GSAP nos KPIs
  fiiAnimManager.animateCounters(
    result.patrimonioFinal,
    result.rendimentoMensalFinal,
    result.cotasReinvestidas,
    result.magicNumber
  );

  // 2. Textos de apoio nos cards
  if (subtextPatrimonio) {
    subtextPatrimonio.textContent = result.totalCotasFinal > 0
      ? `${result.totalCotasFinal} cotas totais de ${result.ticker}`
      : '0 cotas totais';
  }

  if (subtextRendimento) {
    if (result.patrimonioFinal > 0) {
      const dyEfetivo = ((result.rendimentoMensalFinal / result.patrimonioFinal) * 100);
      subtextRendimento.textContent = isNaN(dyEfetivo)
        ? 'Dividendos isentos de IR'
        : `~${dyEfetivo.toFixed(2)}% ao mês em dividendos isentos`;
    } else {
      subtextRendimento.textContent = 'Dividendos isentos de IR';
    }
  }

  if (subtextCotasRendimento) {
    const pctRendimento = result.totalCotasFinal > 0
      ? ((result.cotasReinvestidas / result.totalCotasFinal) * 100).toFixed(1)
      : '0';
    subtextCotasRendimento.textContent = `${pctRendimento}% do seu total veio só dos rendimentos`;
  }

  if (subtextMagicNumber) {
    if (result.magicNumber === 0) {
      subtextMagicNumber.textContent = 'Para comprar 1 cota todo mês sozinho';
    } else if (result.atingiuMagicNumber) {
      const mesTxt = result.mesMagicNumber ? `no mês ${result.mesMagicNumber}` : 'na simulação';
      subtextMagicNumber.innerHTML = `<span style="color: var(--positive); font-weight: 600;">Meta batida ${mesTxt}! O fundo compra cotas sozinho!</span>`;
    } else {
      const faltam = Math.max(0, result.magicNumber - result.totalCotasFinal);
      subtextMagicNumber.textContent = `Faltam ${faltam} cotas para o efeito autossustentável`;
    }
  }

  // 3. Atualiza Gráfico Donut de Proporção
  chartManager.updateChart(result);

  // 4. Renderiza Tabela de evolução
  renderTable(result);
}

function runCalculation(): void {
  const inputs = getInputs();
  const result = calcularFii(inputs);
  updateUI(result);
}

function resetForm(): void {
  tickerInput.value = '';
  dyInput.value = '';
  valorCotaInput.value = '';
  cotasIniciaisInput.value = '';
  cotasMensaisInput.value = '';
  if (prazoSelect) prazoSelect.value = '24';
  if (badgePrazo) badgePrazo.textContent = '24 Meses';

  runCalculation();
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  fiiAnimManager.initEntranceAnimations();

  // Aplica máscara de moeda iniciando vazia (sem valor pré-preenchido)
  attachCurrencyMask(valorCotaInput, null);

  // Todos os campos iniciam vazios
  tickerInput.value = '';
  dyInput.value = '';
  cotasIniciaisInput.value = '';
  cotasMensaisInput.value = '';
  if (prazoSelect) prazoSelect.value = '24';
  if (badgePrazo) badgePrazo.textContent = '24 Meses';

  // Eventos de recálculo em tempo real
  const inputsToListen = [tickerInput, dyInput, valorCotaInput, cotasIniciaisInput, cotasMensaisInput, prazoSelect];
  inputsToListen.forEach((el) => {
    if (!el) return;
    el.addEventListener('input', () => {
      if (el === prazoSelect && badgePrazo) {
        badgePrazo.textContent = `${prazoSelect.value} Meses`;
      }
      runCalculation();
    });
    el.addEventListener('change', () => {
      if (el === prazoSelect && badgePrazo) {
        badgePrazo.textContent = `${prazoSelect.value} Meses`;
      }
      runCalculation();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    runCalculation();
  });

  btnClear?.addEventListener('click', resetForm);

  // Re-renderizar gráfico se alternar Dark/Light mode
  const observer = new MutationObserver(() => {
    if (currentResult) {
      chartManager.updateChart(currentResult);
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Executa o cálculo inicial com campos zerados
  runCalculation();
});
