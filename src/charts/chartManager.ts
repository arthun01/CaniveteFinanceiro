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

  private isDarkMode(): boolean {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  /**
   * 1. Gráfico de Rosca: Total Investido vs Total em Juros
   */
  private renderProportionChart(result: SimulationResult): void {
    const canvas = document.getElementById('chart-pie') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const isDark = this.isDarkMode();
    const total = result.totalFinal || 1;
    const pctInvested = ((result.totalInvested / total) * 100).toFixed(1);
    const pctInterest = ((result.totalInterest / total) * 100).toFixed(1);

    const investedColor = isDark ? '#255c4d' : '#dfe8d5';
    const interestColor = isDark ? '#d7f58b' : '#183f35';
    const borderColor = isDark ? '#14221d' : '#ffffff';

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
            backgroundColor: [investedColor, interestColor],
            borderColor: [borderColor, borderColor],
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
              color: isDark ? '#8b9f94' : '#69756c',
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
            backgroundColor: isDark ? '#14221d' : '#ffffff',
            titleColor: isDark ? '#f0f7f3' : '#203c33',
            bodyColor: isDark ? '#8b9f94' : '#69756c',
            borderColor: isDark ? '#22372f' : '#e4e8df',
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

    const isDark = this.isDarkMode();
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

    const investedBg = isDark ? '#255c4d' : '#dfe8d5';
    const investedBorder = isDark ? '#2d6d5c' : '#cbd7c1';
    const interestBg = isDark ? '#d7f58b' : '#183f35';
    const interestBorder = isDark ? '#e2fab0' : '#123028';

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Investido',
            data: investedData,
            backgroundColor: investedBg,
            borderColor: investedBorder,
            borderWidth: 1,
            borderRadius: 4,
            stack: 'evolution',
          },
          {
            label: 'Juros Acumulados',
            data: interestData,
            backgroundColor: interestBg,
            borderColor: interestBorder,
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
              color: isDark ? '#22372f' : '#f0f1eb',
            },
            ticks: {
              color: isDark ? '#8b9f94' : '#69756c',
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
              color: isDark ? '#22372f' : '#f0f1eb',
            },
            ticks: {
              color: isDark ? '#8b9f94' : '#69756c',
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
              color: isDark ? '#8b9f94' : '#69756c',
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
            backgroundColor: isDark ? '#14221d' : '#ffffff',
            titleColor: isDark ? '#f0f7f3' : '#203c33',
            bodyColor: isDark ? '#8b9f94' : '#69756c',
            borderColor: isDark ? '#22372f' : '#e4e8df',
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
