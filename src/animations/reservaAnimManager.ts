import { gsap } from 'gsap';
import { formatCurrency, formatPercent } from '../utils/formatters';

export class ReservaAnimManager {
  private ctx: gsap.Context | null = null;
  private currentTweens: { [key: string]: gsap.core.Tween } = {};
  private previousValues = {
    target: 0,
    months: 0,
    rate: 0,
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
        delay: 0.25,
        ease: 'power3.out',
      });
    });
  }

  public animateCounters(targetReserve: number, monthsToTarget: number, savingsRate: number): void {
    const elTarget = document.getElementById('kpi-target');
    const elTime = document.getElementById('kpi-time');
    const elRate = document.getElementById('kpi-rate');

    if (!elTarget || !elTime || !elRate) return;

    Object.values(this.currentTweens).forEach((t) => t?.kill());

    // 1. Meta da Reserva (R$)
    const targetObj = { val: this.previousValues.target };
    this.currentTweens['target'] = gsap.to(targetObj, {
      val: targetReserve,
      duration: 1.1,
      ease: 'power2.out',
      onUpdate: () => {
        elTarget.textContent = formatCurrency(targetObj.val);
      },
      onComplete: () => {
        this.previousValues.target = targetReserve;
        elTarget.textContent = formatCurrency(targetReserve);
      },
    });

    // 2. Tempo para Meta (meses ou anos)
    const timeObj = { val: this.previousValues.months };
    this.currentTweens['time'] = gsap.to(timeObj, {
      val: monthsToTarget,
      duration: 1.1,
      ease: 'power2.out',
      onUpdate: () => {
        const m = Math.round(timeObj.val);
        if (m >= 999) {
          elTime.textContent = 'Indeterminado';
        } else if (m >= 24) {
          elTime.textContent = `${(m / 12).toFixed(1)} anos (${m} meses)`;
        } else {
          elTime.textContent = `${m} ${m === 1 ? 'mês' : 'meses'}`;
        }
      },
      onComplete: () => {
        this.previousValues.months = monthsToTarget;
      },
    });

    // 3. Taxa de Poupança (%)
    const rateObj = { val: this.previousValues.rate };
    this.currentTweens['rate'] = gsap.to(rateObj, {
      val: savingsRate,
      duration: 1.1,
      ease: 'power2.out',
      onUpdate: () => {
        elRate.textContent = formatPercent(rateObj.val, 1);
      },
      onComplete: () => {
        this.previousValues.rate = savingsRate;
        elRate.textContent = formatPercent(savingsRate, 1);
      },
    });

    gsap.fromTo(
      '.kpi-final',
      { scale: 0.98 },
      { scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  }

  public animateReset(): void {
    this.previousValues = { target: 0, months: 0, rate: 0 };
    const elTarget = document.getElementById('kpi-target');
    const elTime = document.getElementById('kpi-time');
    const elRate = document.getElementById('kpi-rate');

    if (elTarget) elTarget.textContent = formatCurrency(0);
    if (elTime) elTime.textContent = '0 meses';
    if (elRate) elRate.textContent = '0,0%';

    gsap.fromTo(
      '.kpi-card',
      { opacity: 0.6 },
      { opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power1.out' }
    );
  }

  public destroy(): void {
    this.ctx?.revert();
  }
}

export const reservaAnimManager = new ReservaAnimManager();
