import { gsap } from 'gsap';
import { formatCurrency } from '../utils/formatters';

export class Regra503020AnimManager {
  private ctx: gsap.Context | null = null;
  private currentTweens: { [key: string]: gsap.core.Tween } = {};
  private previousValues = {
    fixos: 0,
    variaveis: 0,
    investimentos: 0,
    renda: 0,
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
    valorFixos: number,
    valorVariaveis: number,
    valorInvestimentos: number,
    rendaLiquida: number
  ): void {
    const elFixos = document.getElementById('kpi-fixos');
    const elVariaveis = document.getElementById('kpi-variaveis');
    const elInvestimentos = document.getElementById('kpi-investimentos');
    const elRenda = document.getElementById('kpi-renda');

    if (!elFixos || !elVariaveis || !elInvestimentos || !elRenda) return;

    Object.values(this.currentTweens).forEach((t) => t?.kill());

    // 1. Custos Fixos (50%)
    const fixosObj = { val: this.previousValues.fixos };
    this.currentTweens['fixos'] = gsap.to(fixosObj, {
      val: valorFixos,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        elFixos.textContent = formatCurrency(fixosObj.val);
      },
      onComplete: () => {
        this.previousValues.fixos = valorFixos;
      },
    });

    // 2. Custos Variáveis (30%)
    const varObj = { val: this.previousValues.variaveis };
    this.currentTweens['variaveis'] = gsap.to(varObj, {
      val: valorVariaveis,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        elVariaveis.textContent = formatCurrency(varObj.val);
      },
      onComplete: () => {
        this.previousValues.variaveis = valorVariaveis;
      },
    });

    // 3. Investir ou Reduzir Dívidas (20%)
    const invObj = { val: this.previousValues.investimentos };
    this.currentTweens['investimentos'] = gsap.to(invObj, {
      val: valorInvestimentos,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        elInvestimentos.textContent = formatCurrency(invObj.val);
      },
      onComplete: () => {
        this.previousValues.investimentos = valorInvestimentos;
      },
    });

    // 4. Renda Líquida Total (100%)
    const rendaObj = { val: this.previousValues.renda };
    this.currentTweens['renda'] = gsap.to(rendaObj, {
      val: rendaLiquida,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        elRenda.textContent = formatCurrency(rendaObj.val);
      },
      onComplete: () => {
        this.previousValues.renda = rendaLiquida;
      },
    });
  }

  public resetCounters(): void {
    const elFixos = document.getElementById('kpi-fixos');
    const elVariaveis = document.getElementById('kpi-variaveis');
    const elInvestimentos = document.getElementById('kpi-investimentos');
    const elRenda = document.getElementById('kpi-renda');

    if (elFixos) elFixos.textContent = 'R$ 0,00';
    if (elVariaveis) elVariaveis.textContent = 'R$ 0,00';
    if (elInvestimentos) elInvestimentos.textContent = 'R$ 0,00';
    if (elRenda) elRenda.textContent = 'R$ 0,00';

    this.previousValues = {
      fixos: 0,
      variaveis: 0,
      investimentos: 0,
      renda: 0,
    };
  }

  public destroy(): void {
    this.ctx?.revert();
  }
}

export const regra503020AnimManager = new Regra503020AnimManager();
