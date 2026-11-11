import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  PieController,
} from 'chart.js';
import type { FiiResult } from '../types/fii';
import { formatCurrency } from '../utils/formatters';

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  PieController
);

export class FiiChartManager {
  private pieChart: Chart | null = null;

  public updateChart(result: FiiResult): void {
    this.renderProportionChart(result);
  }

  private isDarkMode(): boolean {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  /**
   * Gráfico de Pizza/Rosca: Cotas do Próprio Bolso vs Cotas Compradas com Rendimentos
   */
  private renderProportionChart(result: FiiResult): void {
    const canvas = document.getElementById('chart-pie') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = null;
    }

    const isDark = this.isDarkMode();
    const cotasBolso = result.cotasDoBolso;
    const cotasReinvestidas = result.cotasReinvestidas;
    const total = cotasBolso + cotasReinvestidas;

    // Cores alinhadas com o Design System oficial
    const bolsoColor = isDark ? '#8b9f94' : '#69756c';       // Muted / Neutro
    const reinvestidasColor = isDark ? '#4ade80' : '#183f35'; // Verde / Ganho
    const borderColor = isDark ? '#14221d' : '#ffffff';
    const textColor = isDark ? '#f0f7f3' : '#203c33';
    const tooltipBg = isDark ? '#14221d' : '#ffffff';
    const tooltipBorder = isDark ? '#22372f' : '#e4e8df';

    this.pieChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Cotas do Próprio Bolso', 'Cotas por Rendimentos (Bola de Neve)'],
        datasets: [
          {
            data: [cotasBolso, cotasReinvestidas],
            backgroundColor: [bolsoColor, reinvestidasColor],
            borderColor: [borderColor, borderColor],
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      },
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
                const emDinheiro = formatCurrency(val * result.valorCota);
                return ` ${ctx.label}: ${val} cotas (${pct}%) • ${emDinheiro}`;
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
