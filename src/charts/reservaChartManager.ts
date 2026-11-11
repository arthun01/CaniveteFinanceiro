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
   * 1. Gráfico de Rosca: Alocação do Salário Mensal (Cores da Aplicação Externa)
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
              '#ad493a', // Vermelho suave da marca / Custo Fixo
              '#183f35', // Verde escuro da marca / Aporte
              '#dfe8d5', // Sage suave / Livre
            ],
            borderColor: ['#ffffff', '#ffffff', '#ffffff'],
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#69756c',
              font: {
                family: 'DM Sans, sans-serif',
                size: 11,
                weight: 'bold',
              },
              padding: 14,
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#203c33',
            bodyColor: '#69756c',
            borderColor: '#e4e8df',
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
   * 2. Gráfico de Barras: Acúmulo do Saldo até a Meta
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
        r.isTargetReached ? '#183f35' : '#dfe8d5'
      );
    } else {
      labels = result.monthlyRecords.map((r) => `Mês ${r.month}`);
      dataValues = result.monthlyRecords.map((r) => r.accumulated);
      backgroundColors = result.monthlyRecords.map((r) =>
        r.isTargetReached ? '#183f35' : '#dfe8d5'
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
            borderColor: backgroundColors.map((c) => (c === '#183f35' ? '#123028' : '#cbd7c1')),
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
              color: '#f0f1eb',
            },
            ticks: {
              color: '#69756c',
              font: {
                family: 'DM Sans, sans-serif',
                size: 11,
              },
              autoSkip: true,
              maxTicksLimit: 8,
              maxRotation: 45,
            },
          },
          y: {
            grid: {
              color: '#f0f1eb',
            },
            ticks: {
              color: '#69756c',
              font: {
                family: 'DM Sans, sans-serif',
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
            backgroundColor: '#ffffff',
            titleColor: '#203c33',
            bodyColor: '#69756c',
            borderColor: '#e4e8df',
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
