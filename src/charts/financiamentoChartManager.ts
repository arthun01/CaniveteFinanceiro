import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  PieController,
} from 'chart.js';
import type { FinanciamentoResult } from '../types/financiamento';
import { formatCurrency } from '../utils/formatters';

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  PieController
);

export class FinanciamentoChartManager {
  private pieChart: Chart | null = null;

  public updateChart(result: FinanciamentoResult): void {
    this.renderProportionChart(result);
  }

  private isDarkMode(): boolean {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  /**
   * Gráfico de Rosca / Donut: Valor Financiado vs Juros Pagos
   */
  public renderProportionChart(result?: FinanciamentoResult): void {
    const canvas = document.getElementById('chart-pie') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = null;
    }

    const isDark = this.isDarkMode();
    const financiado = result?.valorFinanciado ?? 0;
    const juros = result?.totalJuros ?? 0;
    const total = financiado + juros;

    const amortizacaoColor = isDark ? '#4ade80' : '#183f35'; // Verde principal
    const jurosColor = isDark ? '#facc15' : '#8b9f94';       // Juros / Custo
    const emptyColor = isDark ? '#22372f' : '#e4e8df';
    const borderColor = isDark ? '#14221d' : '#ffffff';
    const textColor = isDark ? '#f0f7f3' : '#203c33';
    const tooltipBg = isDark ? '#14221d' : '#ffffff';
    const tooltipBorder = isDark ? '#22372f' : '#e4e8df';

    const hasData = result && total > 0;

    const chartData = hasData
      ? {
          labels: ['Valor Financiado (Amortização)', 'Total de Juros Pagos'],
          datasets: [
            {
              data: [financiado, juros],
              backgroundColor: [amortizacaoColor, jurosColor],
              borderColor: [borderColor, borderColor],
              borderWidth: 2,
              hoverOffset: 6,
            },
          ],
        }
      : {
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
                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0';
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
