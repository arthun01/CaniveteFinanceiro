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
import { SimulationResult } from '../types/finance';
import { formatCurrency, formatCompactCurrency } from '../utils/formatters';

// Registra os módulos necessários do Chart.js para manter o bundle enxuto
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

  /**
   * Atualiza ou inicializa ambos os gráficos com base no resultado da simulação
   */
  public updateCharts(result: SimulationResult, preferYearly = false): void {
    this.renderProportionChart(result);
    this.renderEvolutionChart(result, preferYearly);
  }

  /**
   * 1. Gráfico de Rosca/Pizza: Total Investido vs Total em Juros
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
              'rgba(129, 140, 248, 0.85)', // Índigo / Investido
              'rgba(16, 185, 129, 0.85)',  // Esmeralda / Juros
            ],
            borderColor: [
              'rgba(129, 140, 248, 1)',
              'rgba(16, 185, 129, 1)',
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
                size: 12,
                weight: 'bold',
              },
              padding: 16,
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
   * 2. Gráfico de Barras Verticais: Evolução ao Longo do Tempo (Barras Empilhadas)
   */
  private renderEvolutionChart(result: SimulationResult, preferYearly: boolean): void {
    const canvas = document.getElementById('chart-evolution') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.barChart) {
      this.barChart.destroy();
    }

    // Se o período for maior que 24 meses ou usuário preferir anual, usa anos
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
            backgroundColor: 'rgba(129, 140, 248, 0.8)',
            borderColor: '#818cf8',
            borderWidth: 1,
            borderRadius: 4,
            stack: 'evolution',
          },
          {
            label: 'Juros Acumulados',
            data: interestData,
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: '#10b981',
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
              color: 'rgba(255, 255, 255, 0.04)',
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Inter, sans-serif',
                size: 11,
              },
              maxRotation: 45,
            },
          },
          y: {
            stacked: true,
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
            position: 'top',
            align: 'end',
            labels: {
              color: '#94a3b8',
              font: {
                family: 'Inter, sans-serif',
                size: 12,
                weight: 500,
              },
              boxWidth: 12,
              usePointStyle: true,
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

  /**
   * Destrói instâncias ativas
   */
  public destroy(): void {
    this.pieChart?.destroy();
    this.barChart?.destroy();
  }
}

export const chartManager = new ChartManager();
