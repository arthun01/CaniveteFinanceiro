/**
 * Utilitários para máscaras de entrada e parsing
 */

export function parseCurrencyInput(value: string): number {
  if (!value) return 0;
  // Remove tudo que não for dígito
  const cleanDigits = value.replace(/\D/g, '');
  if (!cleanDigits) return 0;
  return parseFloat(cleanDigits) / 100;
}

export function formatCurrencyInputValue(value: number): string {
  if (value === 0) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
}

export function parsePercentageInput(value: string): number {
  if (!value) return 0;
  // Permite vírgula ou ponto
  const clean = value.replace(/[^\d.,]/g, '').replace(',', '.');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function parseIntegerInput(value: string): number {
  if (!value) return 0;
  const clean = value.replace(/\D/g, '');
  const parsed = parseInt(clean, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Aplica máscara de moeda brasileira em tempo real no elemento input
 */
export function attachCurrencyMask(inputEl: HTMLInputElement, initialValue = 0): void {
  inputEl.value = formatCurrencyInputValue(initialValue);

  inputEl.addEventListener('input', () => {
    const rawVal = parseCurrencyInput(inputEl.value);
    inputEl.value = formatCurrencyInputValue(rawVal);
  });

  inputEl.addEventListener('focus', () => {
    // Posiciona o cursor no final
    setTimeout(() => {
      inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length;
    }, 10);
  });
}
