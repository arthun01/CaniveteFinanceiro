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
import type { Regra503020Result } from '../types/regra503020';
import { formatCurrency } from '../utils/formatters';

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

export class Regra503020ChartManager {
  private pieChart: Chart | null = null;
  private barChart: Chart | null = null;

  public updateCharts(result: Regra503020Result): void {
    this.renderProportionChart(result);
    this.renderComparisonBarChart(result);
  }

  public renderChartsForPrint(result?: Regra503020Result): void {
    this.renderProportionChart(result, true);
    this.renderComparisonBarChart(result, true);
  }

  private isDarkMode(): boolean {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  /**
   * 1. Gráfico de Rosca (Donut) Pequeno: Distribuição 50 / 30 / 20
   */
  public renderProportionChart(result?: Regra503020Result, forceLight = false): void {
    const canvas = document.getElementById('chart-pie') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = null;
    }

    const isDark = forceLight ? false : this.isDarkMode();
    const hasData = Boolean(result && result.rendaLiquida > 0);

    const fixosVal = result ? result.resumoFixos.valorMeta : 50;
    const varVal = result ? result.resumoVariaveis.valorMeta : 30;
    const invVal = result ? result.resumoInvestimentos.valorMeta : 20;

    // Paleta harmônica
    const fixosColor = isDark ? '#38bdf8' : '#0284c7';        // Azul suave / Necessidades
    const variaveisColor = isDark ? '#fbbf24' : '#d97706';    // Âmbar / Desejos
    const investColor = isDark ? '#4ade80' : '#183f35';       // Verde floresta / Futuro & Dívidas
    const emptyColor = isDark ? '#22372f' : '#e4e8df';
    const borderColor = isDark ? '#14221d' : '#ffffff';
    const textColor = isDark ? '#f0f7f3' : '#203c33';
    const tooltipBg = isDark ? '#14221d' : '#ffffff';
    const tooltipBorder = isDark ? '#22372f' : '#e4e8df';

    const chartData = hasData
      ? {
          labels: [
            '50% — Custos Fixos',
            '30% — Custos Variáveis',
            '20% — Investir / Dívidas',
          ],
          datasets: [
            {
              data: [fixosVal, varVal, invVal],
              backgroundColor: [fixosColor, variaveisColor, investColor],
              borderColor: [borderColor, borderColor, borderColor],
              borderWidth: 2,
              hoverOffset: 6,
            },
          ],
        }
      : {
          labels: ['Aguardando dados da renda'],
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
        animation: forceLight ? false : { duration: 600 },
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
                const total = result ? result.rendaLiquida : 100;
                const pct = total > 0 ? ((val / total) * 100).toFixed(0) : '0';
                return ` ${ctx.label}: ${formatCurrency(val)} (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }

  /**
   * 2. Gráfico de Barras Agrupadas: Meta (50/30/20) vs Realizado pelo Usuário
   */
  public renderComparisonBarChart(result?: Regra503020Result, forceLight = false): void {
    const canvas = document.getElementById('chart-bars') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }

    const isDark = forceLight ? false : this.isDarkMode();
    const hasData = Boolean(result && result.rendaLiquida > 0);

    const textColor = isDark ? '#f0f7f3' : '#203c33';
    const gridColor = isDark ? '#1e332b' : '#f0f1eb';
    const tooltipBg = isDark ? '#14221d' : '#ffffff';
    const tooltipBorder = isDark ? '#22372f' : '#e4e8df';

    const redColor = isDark ? '#f87171' : '#ad493a';
    const fixosColor = isDark ? '#38bdf8' : '#0284c7';
    const varColor = isDark ? '#fbbf24' : '#d97706';
    const invColor = isDark ? '#4ade80' : '#183f35';
    const metaBg = isDark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(100, 116, 139, 0.25)';
    const metaBorder = isDark ? '#94a3b8' : '#64748b';

    const pctRealFixos = result ? result.resumoFixos.percentualRealizado : 0;
    const pctRealVar = result ? result.resumoVariaveis.percentualRealizado : 0;
    const pctRealInv = result ? result.resumoInvestimentos.percentualRealizado : 0;

    const corRealFixos = result?.resumoFixos.estourado ? redColor : fixosColor;
    const corRealVar = result?.resumoVariaveis.estourado ? redColor : varColor;
    const corRealInv = invColor;

    const maxPct = Math.max(
      60,
      Math.ceil((Math.max(pctRealFixos, pctRealVar, pctRealInv, 50) + 10) / 10) * 10
    );

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Custos Fixos', 'Custos Variáveis', 'Investir / Dívidas'],
        datasets: [
          {
            label: 'Meta da Regra (%)',
            data: [50, 30, 20],
            backgroundColor: metaBg,
            borderColor: metaBorder,
            borderWidth: 1.5,
            borderRadius: 6,
            maxBarThickness: 45,
          },
          {
            label: 'Seu Planejamento (%)',
            data: hasData ? [pctRealFixos, pctRealVar, pctRealInv] : [0, 0, 0],
            backgroundColor: [corRealFixos, corRealVar, corRealInv],
            borderColor: [corRealFixos, corRealVar, corRealInv],
            borderWidth: 1.5,
            borderRadius: 6,
            maxBarThickness: 45,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: forceLight ? false : { duration: 600 },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              borderRadius: 3,
              useBorderRadius: true,
              color: textColor,
              font: {
                family: "'DM Sans', sans-serif",
                size: 12,
                weight: 500,
              },
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
                const pct = Number(ctx.raw) || 0;
                if (!result) return ` ${ctx.dataset.label}: ${pct.toFixed(1)}%`;

                const isMeta = ctx.datasetIndex === 0;
                let valor = 0;
                if (ctx.dataIndex === 0) valor = isMeta ? result.resumoFixos.valorMeta : result.resumoFixos.valorRealizado;
                if (ctx.dataIndex === 1) valor = isMeta ? result.resumoVariaveis.valorMeta : result.resumoVariaveis.valorRealizado;
                if (ctx.dataIndex === 2) valor = isMeta ? result.resumoInvestimentos.valorMeta : result.resumoInvestimentos.valorRealizado;

                return ` ${ctx.dataset.label}: ${pct.toFixed(1)}% (${formatCurrency(valor)})`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: textColor,
              font: {
                family: "'DM Sans', sans-serif",
                size: 12,
              },
            },
          },
          y: {
            min: 0,
            max: maxPct,
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
              callback: (val) => `${val}%`,
              font: {
                family: "'DM Sans', sans-serif",
                size: 11,
              },
            },
          },
        },
      },
    });
  }

  public getPieChartImage(): string | null {
    if (!this.pieChart) return null;
    try {
      return this.pieChart.toBase64Image('image/png', 1);
    } catch {
      const canvas = document.getElementById('chart-pie') as HTMLCanvasElement;
      return canvas ? canvas.toDataURL('image/png') : null;
    }
  }

  public getBarChartImage(): string | null {
    if (!this.barChart) return null;
    try {
      return this.barChart.toBase64Image('image/png', 1);
    } catch {
      const canvas = document.getElementById('chart-bars') as HTMLCanvasElement;
      return canvas ? canvas.toDataURL('image/png') : null;
    }
  }

  public destroy(): void {
    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = null;
    }
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }
  }
}
