import { gsap } from 'gsap';
import { formatCurrency, formatPercent } from '../utils/formatters';

export class ImpostoRendaAnimManager {
  private ctx: gsap.Context | null = null;
  private currentTweens: { [key: string]: gsap.core.Tween } = {};
  private previousValues = {
    taxDue: 0,
    grossSalary: 0,
    totalDeductions: 0,
    taxableBase: 0,
    effectiveRate: 0,
    netSalary: 0,
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

  public animateCounters(
    taxDue: number,
    grossSalary: number,
    totalDeductions: number,
    taxableBase: number,
    effectiveRate: number,
    netSalary: number
  ): void {
    const elTaxDue = document.getElementById('kpi-tax-due');
    const elGross = document.getElementById('kpi-gross');
    const elDeductions = document.getElementById('kpi-deductions');
    const elBase = document.getElementById('kpi-base');
    const elEffective = document.getElementById('kpi-effective');
    const elNet = document.getElementById('kpi-net');

    Object.values(this.currentTweens).forEach((t) => t?.kill());

    // 1. Imposto Retido (KPI Principal)
    if (elTaxDue) {
      const taxObj = { val: this.previousValues.taxDue };
      this.currentTweens['taxDue'] = gsap.to(taxObj, {
        val: taxDue,
        duration: 1.1,
        ease: 'power2.out',
        onUpdate: () => {
          elTaxDue.textContent = formatCurrency(taxObj.val);
        },
        onComplete: () => {
          this.previousValues.taxDue = taxDue;
          elTaxDue.textContent = formatCurrency(taxDue);
        },
      });
    }

    // 2. Renda Bruta
    if (elGross) {
      const grossObj = { val: this.previousValues.grossSalary };
      this.currentTweens['grossSalary'] = gsap.to(grossObj, {
        val: grossSalary,
        duration: 1.0,
        ease: 'power2.out',
        onUpdate: () => {
          elGross.textContent = formatCurrency(grossObj.val);
        },
        onComplete: () => {
          this.previousValues.grossSalary = grossSalary;
          elGross.textContent = formatCurrency(grossSalary);
        },
      });
    }

    // 3. Total de Deduções
    if (elDeductions) {
      const dedObj = { val: this.previousValues.totalDeductions };
      this.currentTweens['totalDeductions'] = gsap.to(dedObj, {
        val: totalDeductions,
        duration: 1.0,
        ease: 'power2.out',
        onUpdate: () => {
          elDeductions.textContent = formatCurrency(dedObj.val);
        },
        onComplete: () => {
          this.previousValues.totalDeductions = totalDeductions;
          elDeductions.textContent = formatCurrency(totalDeductions);
        },
      });
    }

    // 4. Base de Cálculo
    if (elBase) {
      const baseObj = { val: this.previousValues.taxableBase };
      this.currentTweens['taxableBase'] = gsap.to(baseObj, {
        val: taxableBase,
        duration: 1.0,
        ease: 'power2.out',
        onUpdate: () => {
          elBase.textContent = formatCurrency(baseObj.val);
        },
        onComplete: () => {
          this.previousValues.taxableBase = taxableBase;
          elBase.textContent = formatCurrency(taxableBase);
        },
      });
    }

    // 5. Alíquota Efetiva
    if (elEffective) {
      const effObj = { val: this.previousValues.effectiveRate };
      this.currentTweens['effectiveRate'] = gsap.to(effObj, {
        val: effectiveRate,
        duration: 1.0,
        ease: 'power2.out',
        onUpdate: () => {
          elEffective.textContent = formatPercent(effObj.val, 2);
        },
        onComplete: () => {
          this.previousValues.effectiveRate = effectiveRate;
          elEffective.textContent = formatPercent(effectiveRate, 2);
        },
      });
    }

    // 6. Salário Líquido
    if (elNet) {
      const netObj = { val: this.previousValues.netSalary };
      this.currentTweens['netSalary'] = gsap.to(netObj, {
        val: netSalary,
        duration: 1.0,
        ease: 'power2.out',
        onUpdate: () => {
          elNet.textContent = formatCurrency(netObj.val);
        },
        onComplete: () => {
          this.previousValues.netSalary = netSalary;
          elNet.textContent = formatCurrency(netSalary);
        },
      });
    }
  }

  public animateResultsReveal(): void {
    const resultsSection = document.getElementById('results-section');
    if (!resultsSection) return;

    gsap.fromTo(
      resultsSection,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
    );
  }

  public destroy(): void {
    this.ctx?.revert();
  }
}

export const impostoRendaAnimManager = new ImpostoRendaAnimManager();
