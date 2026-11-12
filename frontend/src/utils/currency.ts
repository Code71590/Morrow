import type { CurrencyCode } from '@/types/user';
import { LOCALE_MAP } from '@/types/user';

export function formatCurrency(amount: number, currency: CurrencyCode | string = 'INR'): string {
  const locale = LOCALE_MAP[currency as CurrencyCode] || (currency === 'INR' ? 'en-IN' : 'en-US');
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}

export function formatCurrencyCompact(amount: number, currency: CurrencyCode | string = 'INR'): string {
  const locale = LOCALE_MAP[currency as CurrencyCode] || (currency === 'INR' ? 'en-IN' : 'en-US');
  if (Math.abs(amount) >= 100000) {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(amount);
    } catch {}
  }
  return formatCurrency(amount, currency);
}

export function formatCurrencyDecimal(amount: number, currency: CurrencyCode | string = 'INR'): string {
  const locale = LOCALE_MAP[currency as CurrencyCode] || (currency === 'INR' ? 'en-IN' : 'en-US');
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `₹${amount.toFixed(2)}`;
  }
}

export function getCurrencySymbol(currency: CurrencyCode | string = 'INR'): string {
  const symbols: Record<string, string> = {
    INR: '₹', USD: '$', GBP: '£', EUR: '€',
    AED: 'AED ', SGD: 'S$', AUD: 'A$', CAD: 'C$',
  };
  return symbols[currency] || '₹';
}

export function parseCurrencyInput(value: string): number {
  return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
}
