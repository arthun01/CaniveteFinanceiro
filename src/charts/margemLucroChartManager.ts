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
    const lucro = Math.max(0, result?.lucroBrutoTotal ?? 0);
    const total = custo + lucro;

    const custoColor = isDark ? '#6b7280' : '#8b9f94';       // Neutro / Custo
    const lucroColor = isDark ? '#4ade80' : '#183f35';       // Verde floresta / Ganho
    const emptyColor = isDark ? '#22372f' : '#e4e8df';
    const borderColor = isDark ? '#14221d' : '#ffffff';
    const textColor = isDark ? '#f0f7f3' : '#203c33';
    const tooltipBg = isDark ? '#14221d' : '#ffffff';
    const tooltipBorder = isDark ? '#22372f' : '#e4e8df';

    const hasData = result && total > 0;

    const chartData = hasData
      ? {
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
