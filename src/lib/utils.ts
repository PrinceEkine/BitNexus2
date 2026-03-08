import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'NGN') {
  const localeMap: Record<string, string> = {
    NGN: 'en-NG',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB'
  };

  return new Intl.NumberFormat(localeMap[currency] || 'en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
