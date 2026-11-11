import { gsap } from 'gsap';
import { setupNavbar } from './utils/navbar';

export function initPortal(): void {
  setupNavbar();

  gsap.from('.portal-hero-badge, .portal-title, .portal-subtitle', {
    y: 24,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
  });

  gsap.from('.tool-card', {
    y: 36,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    delay: 0.2,
    ease: 'power3.out',
  });

  gsap.from('.feature-card', {
    y: 20,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    delay: 0.45,
    ease: 'power2.out',
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortal);
} else {
  initPortal();
}
