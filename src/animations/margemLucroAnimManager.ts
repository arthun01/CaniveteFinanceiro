import { gsap } from 'gsap';
import { formatCurrency, formatPercent } from '../utils/formatters';

export class MargemLucroAnimManager {
  private ctx: gsap.Context | null = null;
  private currentTweens: { [key: string]: gsap.core.Tween } = {};
  private previousValues = {
    lucro: 0,
    margem: 0,
    markup: 0,
    vendaTotal: 0,
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
    lucroBrutoTotal: number,
    margemLucroPct: number,
    markupPct: number,
    valorTotalVenda: number
  ): void {
    const elLucro = document.getElementById('kpi-lucro');
    const elMargem = document.getElementById('kpi-margem');
    const elMarkup = document.getElementById('kpi-markup');
    const elVendaTotal = document.getElementById('kpi-venda-total');

    if (!elLucro || !elMargem || !elMarkup || !elVendaTotal) return;

    Object.values(this.currentTweens).forEach((t) => t?.kill());

    // 1. Lucro Bruto Total (R$)
    const lucroObj = { val: this.previousValues.lucro };
    this.currentTweens['lucro'] = gsap.to(lucroObj, {
      val: lucroBrutoTotal,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        elLucro.textContent = formatCurrency(lucroObj.val);
      },
      onComplete: () => {
        this.previousValues.lucro = lucroBrutoTotal;
      },
    });

    // 2. Margem de Lucro (%)
    const margemObj = { val: this.previousValues.margem };
    this.currentTweens['margem'] = gsap.to(margemObj, {
      val: margemLucroPct,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        elMargem.textContent = formatPercent(margemObj.val, 2);
      },
      onComplete: () => {
        this.previousValues.margem = margemLucroPct;
      },
    });

    // 3. Markup (%)
    const markupObj = { val: this.previousValues.markup };
    this.currentTweens['markup'] = gsap.to(markupObj, {
      val: markupPct,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        elMarkup.textContent = formatPercent(markupObj.val, 1);
      },
      onComplete: () => {
        this.previousValues.markup = markupPct;
      },
    });

    // 4. Faturamento / Venda Total (R$)
    const vendaObj = { val: this.previousValues.vendaTotal };
    this.currentTweens['vendaTotal'] = gsap.to(vendaObj, {
      val: valorTotalVenda,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        elVendaTotal.textContent = formatCurrency(vendaObj.val);
      },
      onComplete: () => {
        this.previousValues.vendaTotal = valorTotalVenda;
      },
    });
  }

  public resetCounters(): void {
    const elLucro = document.getElementById('kpi-lucro');
    const elMargem = document.getElementById('kpi-margem');
    const elMarkup = document.getElementById('kpi-markup');
    const elVendaTotal = document.getElementById('kpi-venda-total');

    if (elLucro) elLucro.textContent = 'R$ 0,00';
    if (elMargem) elMargem.textContent = '0,00%';
    if (elMarkup) elMarkup.textContent = '0,0%';
    if (elVendaTotal) elVendaTotal.textContent = 'R$ 0,00';

    this.previousValues = {
      lucro: 0,
      margem: 0,
      markup: 0,
      vendaTotal: 0,
    };
  }

  public destroy(): void {
    this.ctx?.revert();
  }
}

export const margemLucroAnimManager = new MargemLucroAnimManager();
