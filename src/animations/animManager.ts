import { gsap } from 'gsap';
import { formatCurrency } from '../utils/formatters';

export class AnimationManager {
  private ctx: gsap.Context | null = null;
  private currentCounters: { [key: string]: gsap.core.Tween } = {};
  private previousValues: { [key: string]: number } = {
    invested: 0,
    interest: 0,
    final: 0,
  };

  /**
   * Executa a animação de entrada inicial dos elementos da página
   */
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

  /**
   * Anima os números dos cards de KPI com efeito odômetro suave
   */
  public animateKpiCounters(
    totalInvested: number,
    totalInterest: number,
    totalFinal: number
  ): void {
    const kpiElements = {
      invested: document.getElementById('kpi-invested'),
      interest: document.getElementById('kpi-interest'),
      final: document.getElementById('kpi-final'),
    };

    if (!kpiElements.invested || !kpiElements.interest || !kpiElements.final) return;

    // Cancela tweens anteriores se estiverem em andamento
    Object.values(this.currentCounters).forEach((t) => t?.kill());

    const targets = [
      { key: 'invested', el: kpiElements.invested, target: totalInvested },
      { key: 'interest', el: kpiElements.interest, target: totalInterest },
      { key: 'final', el: kpiElements.final, target: totalFinal },
    ];

    targets.forEach(({ key, el, target }) => {
      const startVal = this.previousValues[key] || 0;
      const counterObj = { val: startVal };

      this.currentCounters[key] = gsap.to(counterObj, {
        val: target,
        duration: 1.1,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = formatCurrency(counterObj.val);
        },
        onComplete: () => {
          this.previousValues[key] = target;
          el.textContent = formatCurrency(target);
        },
      });
    });

    // Animação de pulso e destaque no card do resultado final
    gsap.fromTo(
      '.kpi-final',
      { scale: 0.98 },
      { scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  }

  /**
   * Revela suavemente as seções de resultado, gráficos e tabelas
   */
  public revealResultsSection(): void {
    const sections = ['.results-section', '.charts-section', '.table-section'];
    sections.forEach((selector) => {
      const el = document.querySelector(selector) as HTMLElement;
      if (el && el.style.display === 'none') {
        el.style.display = 'block';
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
        });
      }
    });
  }

  /**
   * Anima a limpeza/reset dos valores
   */
  public animateReset(): void {
    this.previousValues = { invested: 0, interest: 0, final: 0 };
    const elements = [
      document.getElementById('kpi-invested'),
      document.getElementById('kpi-interest'),
      document.getElementById('kpi-final'),
    ];

    elements.forEach((el) => {
      if (el) el.textContent = formatCurrency(0);
    });

    gsap.fromTo(
      '.kpi-card',
      { opacity: 0.6 },
      { opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power1.out' }
    );
  }

  /**
   * Limpeza de contexto para evitar vazamentos de memória
   */
  public destroy(): void {
    this.ctx?.revert();
  }
}

export const animManager = new AnimationManager();
