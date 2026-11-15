import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  PieController,
} from 'chart.js';
import type { MargemLucroResult } from '../types/margemLucro';
import { formatCurrency } from '../utils/formatters';

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  PieController
);

export class MargemLucroChartManager {
  private pieChart: Chart | null = null;

  public updateChart(result: MargemLucroResult): void {
    this.renderProportionChart(result);
  }

  private isDarkMode(): boolean {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  /**
   * Gráfico de Rosca / Donut: Custo de Compra vs Lucro Bruto
   */
  public renderProportionChart(result?: MargemLucroResult): void {
    const canvas = document.getElementById('chart-pie') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = null;
    }

    const isDark = this.isDarkMode();
    const custo = result?.gastoTotalCompra ?? 0;
    const isPrejuizo = (result?.lucroBrutoTotal ?? 0) < 0;
    const isZero = result !== undefined && result !== null && result.lucroBrutoTotal === 0 && custo > 0;
    const lucro = Math.max(0, result?.lucroBrutoTotal ?? 0);
    const prejuizo = isPrejuizo ? Math.abs(result!.lucroBrutoTotal) : 0;
    const vendaRecuperada = isPrejuizo ? Math.max(0, result!.valorTotalVenda) : 0;
    const total = isPrejuizo ? custo : custo + lucro;

    const custoColor = isDark ? '#6b7280' : '#8b9f94';       // Neutro / Custo
    const lucroColor = isDark ? '#4ade80' : '#183f35';       // Verde floresta / Ganho
    const lossColor = isDark ? '#f87171' : '#ad493a';        // Vermelho / Prejuízo
    const warningColor = isDark ? '#fbbf24' : '#d97706';     // Âmbar / Empate
    const emptyColor = isDark ? '#22372f' : '#e4e8df';
    const borderColor = isDark ? '#14221d' : '#ffffff';
    const textColor = isDark ? '#f0f7f3' : '#203c33';
    const tooltipBg = isDark ? '#14221d' : '#ffffff';
    const tooltipBorder = isDark ? '#22372f' : '#e4e8df';

    const hasData = result && (total > 0 || custo > 0);

    let chartData;
    if (!hasData) {
      chartData = {
        labels: ['Aguardando dados da simulação'],
        datasets: [
          {
            data: [1],
            backgroundColor: [emptyColor],
            borderColor: [borderColor],
            borderWidth: 2,
            hoverOffset: 0,
          },
        ],
      };
    } else if (isPrejuizo) {
      chartData = {
        labels: ['Recuperado na Venda', 'Prejuízo (Perda Líquida)'],
        datasets: [
          {
            data: [vendaRecuperada, prejuizo],
            backgroundColor: [custoColor, lossColor],
            borderColor: [borderColor, borderColor],
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      };
    } else if (isZero) {
      chartData = {
        labels: ['Custo de Aquisição (Zero Lucro)'],
        datasets: [
          {
            data: [custo],
            backgroundColor: [warningColor],
            borderColor: [borderColor],
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      };
    } else {
      chartData = {
        labels: ['Custo de Aquisição', 'Lucro Bruto'],
        datasets: [
          {
            data: [custo, lucro],
            backgroundColor: [custoColor, lucroColor],
            borderColor: [borderColor, borderColor],
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      };
    }

    this.pieChart = new Chart(canvas, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              borderRadius: 4,
              useBorderRadius: true,
              color: textColor,
              font: {
                family: "'DM Sans', sans-serif",
                size: 12,
                weight: 500,
              },
              padding: 16,
            },
          },
          tooltip: {
            enabled: hasData,
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            borderWidth: 1,
            titleColor: textColor,
            bodyColor: textColor,
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: (ctx) => {
                const val = Number(ctx.raw) || 0;
                const baseTotal = isPrejuizo ? custo : total;
                const pct = baseTotal > 0 ? ((val / baseTotal) * 100).toFixed(1) : '0';
                if (isPrejuizo && ctx.label.includes('Prejuízo')) {
                  return ` ${ctx.label}: -${formatCurrency(val)} (${pct}% do capital perdido)`;
                }
                return ` ${ctx.label}: ${formatCurrency(val)} (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }

  public destroy(): void {
    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = null;
    }
  }
}
