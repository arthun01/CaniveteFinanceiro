/**
 * Gerenciador de Navegação: Menu Hambúrguer Mobile e Dark Mode
 */

export type Theme = 'light' | 'dark';

export function getInitialTheme(): Theme {
  const saved = localStorage.getItem('canivete-financeiro-theme') as Theme | null;
  if (saved === 'light' || saved === 'dark') return saved;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function setTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('canivete-financeiro-theme', theme);
  updateThemeIcons(theme);
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
}

export function toggleTheme(): void {
  const current = (document.documentElement.getAttribute('data-theme') as Theme) || 'light';
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
}

function updateThemeIcons(theme: Theme): void {
  const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
  toggleButtons.forEach((btn) => {
    const isDark = theme === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
    btn.innerHTML = isDark
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;
  });
}

export function setupNavbar(): void {
  // 1. Inicializa o Tema
  const initialTheme = getInitialTheme();
  setTheme(initialTheme);

  // Conecta todos os botões de alternância de tema
  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  themeBtns.forEach((btn) => {
    btn.addEventListener('click', () => toggleTheme());
  });

  // 2. Menu Hambúrguer Mobile
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileBackdrop = document.getElementById('mobile-menu-backdrop');
  const closeMenuBtn = document.getElementById('close-menu-btn');

  function openMenu() {
    mobileMenu?.classList.add('open');
    mobileBackdrop?.classList.add('open');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu?.classList.remove('open');
    mobileBackdrop?.classList.remove('open');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburgerBtn?.addEventListener('click', () => {
    if (mobileMenu?.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  closeMenuBtn?.addEventListener('click', closeMenu);
  mobileBackdrop?.addEventListener('click', closeMenu);

  // Fecha o menu ao clicar em qualquer link
  const mobileLinks = mobileMenu?.querySelectorAll('a');
  mobileLinks?.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // 3. Modal "Apoie o Projeto"
  const donateDialog = document.getElementById('donate-dialog') as HTMLDialogElement | null;
  const openDonateBtns = document.querySelectorAll('#open-donate-btn, #mobile-donate-btn');
  const closeDonateBtn = document.getElementById('close-donate-btn');
  const copyPixBtn = document.getElementById('copy-pix-btn');
  const pixKeyInput = document.getElementById('pix-key-input') as HTMLInputElement | null;
  const copyPixText = document.getElementById('copy-pix-text');

  function openDonate() {
    closeMenu();
    if (donateDialog && typeof donateDialog.showModal === 'function') {
      donateDialog.showModal();
    }
  }

  function closeDonate() {
    if (donateDialog && typeof donateDialog.close === 'function') {
      donateDialog.close();
    }
  }

  openDonateBtns.forEach((btn) => {
    btn.addEventListener('click', openDonate);
  });

  closeDonateBtn?.addEventListener('click', closeDonate);

  // Fecha dialog ao clicar no backdrop
  donateDialog?.addEventListener('click', (e) => {
    const rect = donateDialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) {
      closeDonate();
    }
  });

  // Copiar Chave Pix
  copyPixBtn?.addEventListener('click', async () => {
    if (!pixKeyInput) return;
    try {
      await navigator.clipboard.writeText(pixKeyInput.value);
      if (copyPixText) copyPixText.textContent = 'Copiado! ✓';
      setTimeout(() => {
        if (copyPixText) copyPixText.textContent = 'Copiar';
      }, 2500);
    } catch {
      pixKeyInput.select();
      document.execCommand('copy');
      if (copyPixText) copyPixText.textContent = 'Copiado! ✓';
      setTimeout(() => {
        if (copyPixText) copyPixText.textContent = 'Copiar';
      }, 2500);
    }
  });

  // 4. Botão do Banner Mobile do Portal (se presente na página)
  const bannerOpenMenuBtn = document.getElementById('banner-open-menu-btn');
  bannerOpenMenuBtn?.addEventListener('click', openMenu);
}
