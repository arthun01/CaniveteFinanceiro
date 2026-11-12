import { gsap } from 'gsap';
import { formatCurrency, formatPercent } from '../utils/formatters';
import type { ModoFinanciamento } from '../types/financiamento';

export class FinanciamentoAnimManager {
  private ctx: gsap.Context | null = null;
  private currentTweens: { [key: string]: gsap.core.Tween } = {};
  private previousValues = {
    resultado: 0,
    totalPago: 0,
    totalJuros: 0,
    custoEfetivo: 0,
  };

  public initEntranceAnimations(): void {
    this.ctx = gsap.context(() => {
      gsap.from('.hero-badge, .hero-title, .hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });

      gsap.from('.calculator-form-card', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        delay: 0.2,
        ease: 'power3.out',
      });
    });
  }

  public animateCounters(
    modo: ModoFinanciamento,
    resultadoValor: number,
    totalPago: number,
    totalJuros: number,
    custoEfetivo: number
  ): void {
    const elResultado = document.getElementById('kpi-resultado');
    const elTotalPago = document.getElementById('kpi-total-pago');
    const elTotalJuros = document.getElementById('kpi-total-juros');
    const elCustoEfetivo = document.getElementById('kpi-custo-efetivo');

    if (!elResultado || !elTotalPago || !elTotalJuros || !elCustoEfetivo) return;

    Object.values(this.currentTweens).forEach((t) => t?.kill());

    // 1. Resultado Principal (Prestação, Financiado, Juros % ou Meses)
    const resObj = { val: this.previousValues.resultado };
    this.currentTweens['resultado'] = gsap.to(resObj, {
      val: resultadoValor,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        if (modo === 'prestacao' || modo === 'financiado') {
          elResultado.textContent = formatCurrency(resObj.val);
        } else if (modo === 'juros') {
          elResultado.textContent = `${resObj.val.toFixed(4).replace('.', ',')}% a.m.`;
        } else {
          elResultado.textContent = `${Math.round(resObj.val)} meses`;
        }
      },
      onComplete: () => {
        this.previousValues.resultado = resultadoValor;
      },
    });

    // 2. Total Pago (R$)
    const pagoObj = { val: this.previousValues.totalPago };
    this.currentTweens['totalPago'] = gsap.to(pagoObj, {
      val: totalPago,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        elTotalPago.textContent = formatCurrency(pagoObj.val);
      },
      onComplete: () => {
        this.previousValues.totalPago = totalPago;
      },
    });

    // 3. Total de Juros (R$)
    const jurosObj = { val: this.previousValues.totalJuros };
    this.currentTweens['totalJuros'] = gsap.to(jurosObj, {
      val: totalJuros,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        elTotalJuros.textContent = formatCurrency(jurosObj.val);
      },
      onComplete: () => {
        this.previousValues.totalJuros = totalJuros;
      },
    });

    // 4. Custo Efetivo / Proporção de Juros (%)
    const custoObj = { val: this.previousValues.custoEfetivo };
    this.currentTweens['custoEfetivo'] = gsap.to(custoObj, {
      val: custoEfetivo,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        elCustoEfetivo.textContent = formatPercent(custoObj.val, 1);
      },
      onComplete: () => {
        this.previousValues.custoEfetivo = custoEfetivo;
      },
    });
  }

  public resetCounters(): void {
    const elResultado = document.getElementById('kpi-resultado');
    const elTotalPago = document.getElementById('kpi-total-pago');
    const elTotalJuros = document.getElementById('kpi-total-juros');
    const elCustoEfetivo = document.getElementById('kpi-custo-efetivo');

    if (elResultado) elResultado.textContent = 'R$ 0,00';
    if (elTotalPago) elTotalPago.textContent = 'R$ 0,00';
    if (elTotalJuros) elTotalJuros.textContent = 'R$ 0,00';
    if (elCustoEfetivo) elCustoEfetivo.textContent = '0,0%';

    this.previousValues = {
      resultado: 0,
      totalPago: 0,
      totalJuros: 0,
      custoEfetivo: 0,
    };
  }

  public destroy(): void {
    this.ctx?.revert();
  }
}

export const financiamentoAnimManager = new FinanciamentoAnimManager();
