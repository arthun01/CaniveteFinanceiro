import { setupNavbar } from './utils/navbar';
import {
  attachCurrencyMask,
  parseCurrencyInput,
  formatCurrencyInputValue,
} from './utils/masks';
import { formatCurrency } from './utils/formatters';
import { calcularRegra503020 } from './services/regra503020Calculator';
import { Regra503020ChartManager } from './charts/regra503020ChartManager';
import { regra503020AnimManager } from './animations/regra503020AnimManager';
import type {
  Regra503020Result,
  ItemGasto503020,
  Categoria503020,
} from './types/regra503020';

// Instâncias
const chartManager = new Regra503020ChartManager();

// Elementos do Formulário e Ações
const form = document.getElementById('regra-form') as HTMLFormElement;
const rendaInput = document.getElementById('input-renda') as HTMLInputElement;
const btnClear = document.getElementById('btn-clear') as HTMLButtonElement;
const btnDemo = document.getElementById('btn-demo') as HTMLButtonElement;
const btnClearItems = document.getElementById('btn-clear-items') as HTMLButtonElement;
const errorAlert = document.getElementById('regra-error-alert') as HTMLElement;

// Listas de Itens por Categoria
const listFixos = document.getElementById('list-fixos') as HTMLElement;
const listVariaveis = document.getElementById('list-variaveis') as HTMLElement;
const listInvestimentos = document.getElementById('list-investimentos') as HTMLElement;

// Elementos de Estatística das Categorias
const limitFixos = document.getElementById('limit-fixos') as HTMLElement;
const spentFixos = document.getElementById('spent-fixos') as HTMLElement;
const balanceLabelFixos = document.getElementById('balance-label-fixos') as HTMLElement;
const balanceFixos = document.getElementById('balance-fixos') as HTMLElement;
const progressFixos = document.getElementById('progress-fixos') as HTMLElement;

const limitVariaveis = document.getElementById('limit-variaveis') as HTMLElement;
const spentVariaveis = document.getElementById('spent-variaveis') as HTMLElement;
const balanceLabelVariaveis = document.getElementById('balance-label-variaveis') as HTMLElement;
const balanceVariaveis = document.getElementById('balance-variaveis') as HTMLElement;
const progressVariaveis = document.getElementById('progress-variaveis') as HTMLElement;

const limitInvestimentos = document.getElementById('limit-investimentos') as HTMLElement;
const spentInvestimentos = document.getElementById('spent-investimentos') as HTMLElement;
const balanceLabelInvestimentos = document.getElementById('balance-label-investimentos') as HTMLElement;
const balanceInvestimentos = document.getElementById('balance-investimentos') as HTMLElement;
const progressInvestimentos = document.getElementById('progress-investimentos') as HTMLElement;

// Elementos da Tabela de Projeção
const tableBody = document.getElementById('projecao-table-body') as HTMLTableSectionElement;
const badgeProjecaoStatus = document.getElementById('badge-projecao-status') as HTMLElement;

// Botões "+ Adicionar Item"
const addButtons = document.querySelectorAll<HTMLButtonElement>('.btn-add-item');

let currentResult: Regra503020Result | null = null;
let itemCounter = 0;

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
 * Coleta os itens cadastrados de um contêiner de lista
 */
function coletarItens(container: HTMLElement): ItemGasto503020[] {
  const rows = container.querySelectorAll<HTMLElement>('.item-row');
  const itens: ItemGasto503020[] = [];

  rows.forEach((row) => {
    const descInput = row.querySelector<HTMLInputElement>('.item-input-desc');
    const valInput = row.querySelector<HTMLInputElement>('.item-input-val');
    const valor = valInput ? parseCurrencyInput(valInput.value) : 0;
    const descricao = descInput ? descInput.value.trim() : '';

    if (valor > 0 || descricao.length > 0) {
      itens.push({
        id: row.dataset.id || String(++itemCounter),
        descricao: descricao || 'Item sem nome',
        valor,
      });
    }
  });

  return itens;
}

/**
 * Cria uma linha de gasto interativa dentro de uma categoria
 */
function criarLinhaItem(
  container: HTMLElement,
  descricao = '',
  valor = 0
): HTMLElement {
  const rowId = `item-${++itemCounter}`;
  const row = document.createElement('div');
  row.className = 'item-row';
  row.dataset.id = rowId;

  row.innerHTML = `
    <input type="text" class="item-input-desc" placeholder="Ex: Conta ou Gasto" value="${escapeHtml(descricao)}" />
    <input type="text" class="item-input-val" placeholder="R$ 0,00" value="${valor > 0 ? formatCurrencyInputValue(valor) : ''}" />
    <button type="button" class="btn-remove-item" aria-label="Remover item">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 6h18"></path>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
      </svg>
    </button>
  `;

  const descInput = row.querySelector<HTMLInputElement>('.item-input-desc')!;
  const valInput = row.querySelector<HTMLInputElement>('.item-input-val')!;
  const btnRemove = row.querySelector<HTMLButtonElement>('.btn-remove-item')!;

  attachCurrencyMask(valInput);

  // Recalcula dinamicamente ao digitar descrição ou valor
  valInput.addEventListener('input', () => {
    runCalculation(false);
  });
  descInput.addEventListener('input', () => {
    // Apenas mantém sincronizado
  });

  btnRemove.addEventListener('click', () => {
    row.remove();
    runCalculation(false);
  });

  container.appendChild(row);
  return row;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Renderiza o cronograma anual acumulado de 12 meses
 */
function renderAnnualProjectionTable(result: Regra503020Result): void {
  if (!tableBody) return;

  if (badgeProjecaoStatus) {
    const totalAno = result.projecaoAnual[result.projecaoAnual.length - 1]?.totalAcumulado || 0;
    const invAno = result.projecaoAnual[result.projecaoAnual.length - 1]?.investimentosAcumulado || 0;
    badgeProjecaoStatus.textContent = `Em 1 Ano: ${formatCurrency(invAno)} em Investimentos / Dívidas (Total: ${formatCurrency(totalAno)})`;
  }

  const rowsHtml = result.projecaoAnual
    .map((item) => {
      return `
        <tr>
          <td><strong>${item.mes}º mês</strong></td>
          <td>${formatCurrency(item.fixosAcumulado)}</td>
          <td>${formatCurrency(item.variaveisAcumulado)}</td>
          <td class="col-investimentos">${formatCurrency(item.investimentosAcumulado)}</td>
          <td style="font-weight: 600;">${formatCurrency(item.totalAcumulado)}</td>
        </tr>
      `;
    })
    .join('');

  tableBody.innerHTML = rowsHtml;
}

/**
 * Atualiza o bloco visual de uma categoria (limite, gasto, saldo e barra de progresso)
 */
function atualizarBlocoCategoria(
  categoria: Categoria503020,
  valorMeta: number,
  valorRealizado: number,
  saldoRestante: number,
  estourado: boolean,
  percentualUso: number,
  limitEl: HTMLElement,
  spentEl: HTMLElement,
  balanceLabelEl: HTMLElement,
  balanceEl: HTMLElement,
  progressEl: HTMLElement
): void {
  if (limitEl) limitEl.textContent = formatCurrency(valorMeta);
  if (spentEl) spentEl.textContent = formatCurrency(valorRealizado);

  if (balanceLabelEl && balanceEl) {
    if (estourado) {
      balanceLabelEl.textContent = 'Excesso (Estourou):';
      balanceEl.textContent = `+${formatCurrency(Math.abs(saldoRestante))}`;
      balanceEl.style.color = 'var(--red)';
    } else {
      balanceLabelEl.textContent = categoria === 'investimentos' ? 'Faltam para a Meta:' : 'Saldo Restante:';
      balanceEl.textContent = formatCurrency(saldoRestante);
      balanceEl.style.color = '';
    }
  }

  if (progressEl) {
    const visualWidth = Math.min(100, Math.max(0, percentualUso));
    progressEl.style.width = `${visualWidth}%`;
    if (estourado) {
      progressEl.classList.add('overbudget');
    } else {
      progressEl.classList.remove('overbudget');
    }
  }
}

/**
 * Executa o cálculo com os dados atuais
 */
function runCalculation(isDirectSubmit = true): void {
  hideError();

  const rendaLiquida = parseCurrencyInput(rendaInput.value);

  if (rendaLiquida <= 0) {
    if (isDirectSubmit) {
      showError('Por favor, informe sua renda líquida mensal (maior que zero) para calcular a regra 50/30/20.');
      rendaInput.focus();
    }
    return;
  }

  const gastosFixos = coletarItens(listFixos);
  const gastosVariaveis = coletarItens(listVariaveis);
  const gastosInvestimentos = coletarItens(listInvestimentos);

  const result = calcularRegra503020({
    rendaLiquida,
    gastosFixos,
    gastosVariaveis,
    gastosInvestimentos,
  });

  currentResult = result;

  // Anima os números dos KPIs principais
  regra503020AnimManager.animateCounters(
    result.resumoFixos.valorMeta,
    result.resumoVariaveis.valorMeta,
    result.resumoInvestimentos.valorMeta,
    result.rendaLiquida
  );

  // Atualiza blocos de categoria
  atualizarBlocoCategoria(
    'fixos',
    result.resumoFixos.valorMeta,
    result.resumoFixos.valorRealizado,
    result.resumoFixos.saldoRestante,
    result.resumoFixos.estourado,
    result.resumoFixos.percentualUsoLimite,
    limitFixos,
    spentFixos,
    balanceLabelFixos,
    balanceFixos,
    progressFixos
  );

  atualizarBlocoCategoria(
    'variaveis',
    result.resumoVariaveis.valorMeta,
    result.resumoVariaveis.valorRealizado,
    result.resumoVariaveis.saldoRestante,
    result.resumoVariaveis.estourado,
    result.resumoVariaveis.percentualUsoLimite,
    limitVariaveis,
    spentVariaveis,
    balanceLabelVariaveis,
    balanceVariaveis,
    progressVariaveis
  );

  atualizarBlocoCategoria(
    'investimentos',
    result.resumoInvestimentos.valorMeta,
    result.resumoInvestimentos.valorRealizado,
    result.resumoInvestimentos.saldoRestante,
    result.resumoInvestimentos.estourado,
    result.resumoInvestimentos.percentualUsoLimite,
    limitInvestimentos,
    spentInvestimentos,
    balanceLabelInvestimentos,
    balanceInvestimentos,
    progressInvestimentos
  );

  // Atualiza gráficos
  chartManager.updateCharts(result);

  // Atualiza tabela anual
  renderAnnualProjectionTable(result);
}

/**
 * Preenche com exemplo prático didático
 */
function carregarExemploPratico(): void {
  rendaInput.value = formatCurrencyInputValue(5000);

  // Limpa listas anteriores
  listFixos.innerHTML = '';
  listVariaveis.innerHTML = '';
  listInvestimentos.innerHTML = '';

  // Custos Fixos (50% = R$ 2.500,00)
  criarLinhaItem(listFixos, 'Aluguel & Condomínio', 1400);
  criarLinhaItem(listFixos, 'Supermercado & Feira', 700);
  criarLinhaItem(listFixos, 'Energia & Água', 250);
  criarLinhaItem(listFixos, 'Internet & Celular', 150);

  // Custos Variáveis (30% = R$ 1.500,00)
  criarLinhaItem(listVariaveis, 'Restaurantes & Delivery', 600);
  criarLinhaItem(listVariaveis, 'Lazer & Cinema', 400);
  criarLinhaItem(listVariaveis, 'Compras & Roupas', 350);
  criarLinhaItem(listVariaveis, 'Streaming & Assinaturas', 150);

  // Investimentos / Dívidas (20% = R$ 1.000,00)
  criarLinhaItem(listInvestimentos, 'Aporte Reserva de Emergência', 500);
  criarLinhaItem(listInvestimentos, 'Fundos Imobiliários / Ações', 500);

  runCalculation(true);
}

/**
 * Limpa todos os itens de gastos das 3 categorias mantendo a renda
 */
function limparItensGastos(): void {
  listFixos.innerHTML = '';
  listVariaveis.innerHTML = '';
  listInvestimentos.innerHTML = '';
  runCalculation(false);
}

/**
 * Reseta o formulário por completo
 */
function resetForm(): void {
  rendaInput.value = '';
  currentResult = null;
  hideError();

  limparItensGastos();
  regra503020AnimManager.resetCounters();

  [limitFixos, spentFixos, balanceFixos, limitVariaveis, spentVariaveis, balanceVariaveis, limitInvestimentos, spentInvestimentos, balanceInvestimentos].forEach((el) => {
    if (el) el.textContent = 'R$ 0,00';
  });

  [progressFixos, progressVariaveis, progressInvestimentos].forEach((el) => {
    if (el) {
      el.style.width = '0%';
      el.classList.remove('overbudget');
    }
  });

  if (tableBody) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--muted); padding: 3rem 1rem; font-size: 14px;">
          Informe sua renda líquida mensal para visualizar o cronograma acumulado de 12 meses.
        </td>
      </tr>
    `;
  }

  if (badgeProjecaoStatus) {
    badgeProjecaoStatus.textContent = '12 Meses';
  }

  chartManager.renderProportionChart(undefined);
  chartManager.renderComparisonBarChart(undefined);

  rendaInput.focus();
}

// Inicialização ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  regra503020AnimManager.initEntranceAnimations();

  attachCurrencyMask(rendaInput);

  // Inicializa gráficos vazios elegantes
  chartManager.renderProportionChart(undefined);
  chartManager.renderComparisonBarChart(undefined);

  // Ações dos botões "+ Adicionar Item"
  addButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category as Categoria503020;
      let targetList: HTMLElement | null = null;
      if (category === 'fixos') targetList = listFixos;
      if (category === 'variaveis') targetList = listVariaveis;
      if (category === 'investimentos') targetList = listInvestimentos;

      if (targetList) {
        const row = criarLinhaItem(targetList, '', 0);
        const descInput = row.querySelector<HTMLInputElement>('.item-input-desc');
        if (descInput) descInput.focus();
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    runCalculation(true);
  });

  btnClear.addEventListener('click', resetForm);
  btnDemo.addEventListener('click', carregarExemploPratico);
  btnClearItems.addEventListener('click', limparItensGastos);

  // Escuta alteração de tema para atualizar as cores dos gráficos
  window.addEventListener('theme-changed', () => {
    if (currentResult) {
      chartManager.updateCharts(currentResult);
    } else {
      chartManager.renderProportionChart(undefined);
      chartManager.renderComparisonBarChart(undefined);
    }
  });
});
