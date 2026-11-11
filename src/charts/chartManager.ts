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
import type { SimulationResult } from '../types/finance';
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

export class ChartManager {
  private pieChart: Chart | null = null;
  private barChart: Chart | null = null;

  public updateCharts(result: SimulationResult, preferYearly = false): void {
    this.renderProportionChart(result);
    this.renderEvolutionChart(result, preferYearly);
  }

  /**
   * 1. Gráfico de Rosca: Total Investido vs Total em Juros (Cores da Aplicação Externa)
   */
  private renderProportionChart(result: SimulationResult): void {
    const canvas = document.getElementById('chart-pie') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const total = result.totalFinal || 1;
    const pctInvested = ((result.totalInvested / total) * 100).toFixed(1);
    const pctInterest = ((result.totalInterest / total) * 100).toFixed(1);

    this.pieChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: [
          `Total Investido (${pctInvested}%)`,
          `Total em Juros (${pctInterest}%)`,
        ],
        datasets: [
          {
            data: [result.totalInvested, result.totalInterest],
            backgroundColor: [
              '#dfe8d5', // Sage suave / Investido
              '#183f35', // Verde escuro da marca / Juros
            ],
            borderColor: ['#ffffff', '#ffffff'],
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
                size: 12,
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
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: (context) => {
                const val = context.raw as number;
                return ` ${context.label.split(' ')[0]}: ${formatCurrency(val)}`;
              },
            },
          },
        },
      },
    });
  }

  /**
   * 2. Gráfico de Barras Empilhadas: Evolução Temporal
   */
  private renderEvolutionChart(result: SimulationResult, preferYearly: boolean): void {
    const canvas = document.getElementById('chart-evolution') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.barChart) {
      this.barChart.destroy();
    }

    const useYearly = preferYearly || result.totalMonths > 36;
    let labels: string[] = [];
    let investedData: number[] = [];
    let interestData: number[] = [];

    if (useYearly) {
      labels = result.yearlyRecords.map((r) => `Ano ${r.year}`);
      investedData = result.yearlyRecords.map((r) => r.totalInvested);
      interestData = result.yearlyRecords.map((r) => r.totalInterest);
    } else {
      labels = result.monthlyRecords.map((r) => `Mês ${r.period}`);
      investedData = result.monthlyRecords.map((r) => r.totalInvested);
      interestData = result.monthlyRecords.map((r) => r.totalInterest);
    }

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Investido',
            data: investedData,
            backgroundColor: '#dfe8d5',
            borderColor: '#cbd7c1',
            borderWidth: 1,
            borderRadius: 4,
            stack: 'evolution',
          },
          {
            label: 'Juros Acumulados',
            data: interestData,
            backgroundColor: '#183f35',
            borderColor: '#123028',
            borderWidth: 1,
            borderRadius: 4,
            stack: 'evolution',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
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
            stacked: true,
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
            position: 'top',
            align: 'end',
            labels: {
              color: '#69756c',
              font: {
                family: 'DM Sans, sans-serif',
                size: 12,
                weight: 'bold',
              },
              boxWidth: 12,
              usePointStyle: true,
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
                return ` ${context.dataset.label}: ${formatCurrency(val)}`;
              },
              footer: (items) => {
                const total = items.reduce((acc, curr) => acc + (curr.raw as number), 0);
                return `Acumulado: ${formatCurrency(total)}`;
              },
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

export const chartManager = new ChartManager();
