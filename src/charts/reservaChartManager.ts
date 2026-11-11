import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import type { ReservaResult } from '../types/reserva';
import { formatCurrency, formatCompactCurrency } from '../utils/formatters';

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale
);

export class ReservaChartManager {
  private pieChart: Chart | null = null;
  private barChart: Chart | null = null;

  public updateCharts(result: ReservaResult, preferYearly = false): void {
    this.renderProportionChart(result);
    this.renderEvolutionChart(result, preferYearly);
  }

  /**
   * 1. Gráfico de Rosca: Alocação do Salário Mensal (Custo Fixo vs Aporte de Reserva vs Livre)
   */
  private renderProportionChart(result: ReservaResult): void {
    const canvas = document.getElementById('chart-pie') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const expenses = result.input.monthlyExpenses;
    const savings = result.input.monthlySavings;
    const freeMargin = Math.max(0, result.input.monthlySalary - expenses - savings);

    this.pieChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Custo Fixo', 'Aporte de Reserva', 'Margem Livre'],
        datasets: [
          {
            data: [expenses, savings, freeMargin],
            backgroundColor: [
              'rgba(244, 63, 94, 0.85)',   // Rose / Custo Fixo
              'rgba(16, 185, 129, 0.85)',  // Esmeralda / Aporte
              'rgba(56, 189, 248, 0.85)',  // Azul / Livre
            ],
            borderColor: [
              'rgba(244, 63, 94, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(56, 189, 248, 1)',
            ],
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              font: {
                family: 'Inter, sans-serif',
                size: 11,
                weight: 'bold',
              },
              padding: 14,
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f8fafc',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => {
                const val = context.raw as number;
                const total = expenses + savings + freeMargin || 1;
                const pct = ((val / total) * 100).toFixed(1);
                return ` ${context.label}: ${formatCurrency(val)} (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }

  /**
   * 2. Gráfico de Barras: Acúmulo do Patrimônio até a Meta
   */
  private renderEvolutionChart(result: ReservaResult, preferYearly: boolean): void {
    const canvas = document.getElementById('chart-evolution') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.barChart) {
      this.barChart.destroy();
    }

    const useYearly = preferYearly || result.monthlyRecords.length > 36;
    let labels: string[] = [];
    let dataValues: number[] = [];
    let backgroundColors: string[] = [];

    if (useYearly) {
      labels = result.yearlyRecords.map((r) => `Ano ${r.year}`);
      dataValues = result.yearlyRecords.map((r) => r.accumulated);
      backgroundColors = result.yearlyRecords.map((r) =>
        r.isTargetReached ? 'rgba(16, 185, 129, 0.85)' : 'rgba(56, 189, 248, 0.8)'
      );
    } else {
      labels = result.monthlyRecords.map((r) => `Mês ${r.month}`);
      dataValues = result.monthlyRecords.map((r) => r.accumulated);
      backgroundColors = result.monthlyRecords.map((r) =>
        r.isTargetReached ? 'rgba(16, 185, 129, 0.85)' : 'rgba(56, 189, 248, 0.8)'
      );
    }

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Saldo Acumulado',
            data: dataValues,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((c) => c.replace('0.85', '1').replace('0.8', '1')),
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.04)',
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Inter, sans-serif',
                size: 11,
              },
              autoSkip: true,
              maxTicksLimit: 8,
              maxRotation: 45,
            },
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Inter, sans-serif',
                size: 11,
              },
              callback: (value) => formatCompactCurrency(value as number),
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f8fafc',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => {
                const val = context.raw as number;
                const pct = result.targetReserve > 0 ? ((val / result.targetReserve) * 100).toFixed(1) : '100';
                return ` Saldo: ${formatCurrency(val)} (${pct}% da Meta)`;
              },
              footer: () => `Meta Ideal: ${formatCurrency(result.targetReserve)}`,
            },
          },
        },
      },
    });
  }

  public destroy(): void {
    this.pieChart?.destroy();
    this.barChart?.destroy();
  }
}

export const reservaChartManager = new ReservaChartManager();
