import { gsap } from 'gsap';
import { formatCurrency } from '../utils/formatters';

export class FiiAnimManager {
  private ctx: gsap.Context | null = null;
  private currentTweens: { [key: string]: gsap.core.Tween } = {};
  private previousValues = {
    patrimonio: 0,
    rendimentoMensal: 0,
    cotasRendimento: 0,
    magicNumber: 0,
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
    patrimonioFinal: number,
    rendimentoMensalFinal: number,
    cotasReinvestidas: number,
    magicNumber: number
  ): void {
    const elPatrimonio = document.getElementById('kpi-patrimonio');
    const elRendimento = document.getElementById('kpi-rendimento-mensal');
    const elCotasRendimento = document.getElementById('kpi-cotas-rendimento');
    const elMagicNumber = document.getElementById('kpi-magic-number');

    if (!elPatrimonio || !elRendimento || !elCotasRendimento || !elMagicNumber) return;

    Object.values(this.currentTweens).forEach((t) => t?.kill());

    // 1. Patrimônio Final (R$)
    const patObj = { val: this.previousValues.patrimonio };
    this.currentTweens['patrimonio'] = gsap.to(patObj, {
      val: patrimonioFinal,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        elPatrimonio.textContent = formatCurrency(patObj.val);
      },
      onComplete: () => {
        this.previousValues.patrimonio = patrimonioFinal;
      },
    });

    // 2. Rendimento Mensal no Mês 24 (R$/mês)
    const rendObj = { val: this.previousValues.rendimentoMensal };
    this.currentTweens['rendimento'] = gsap.to(rendObj, {
      val: rendimentoMensalFinal,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        elRendimento.textContent = formatCurrency(rendObj.val) + '/mês';
      },
      onComplete: () => {
        this.previousValues.rendimentoMensal = rendimentoMensalFinal;
      },
    });

    // 3. Cotas Compradas com Rendimento
    const cotasObj = { val: this.previousValues.cotasRendimento };
    this.currentTweens['cotasRendimento'] = gsap.to(cotasObj, {
      val: cotasReinvestidas,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        elCotasRendimento.textContent = `${Math.round(cotasObj.val)} cotas`;
      },
      onComplete: () => {
        this.previousValues.cotasRendimento = cotasReinvestidas;
      },
    });

    // 4. Número Mágico (Magic Number)
    const magicObj = { val: this.previousValues.magicNumber };
    this.currentTweens['magic'] = gsap.to(magicObj, {
      val: magicNumber,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        elMagicNumber.textContent = `${Math.round(magicObj.val)} cotas`;
      },
      onComplete: () => {
        this.previousValues.magicNumber = magicNumber;
      },
    });
  }

  public destroy(): void {
    this.ctx?.revert();
  }
}

export const fiiAnimManager = new FiiAnimManager();
