export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', label: '₹ INR (Indian Rupee)' },
  { code: 'USD', symbol: '$', label: '$ USD (US Dollar)' },
  { code: 'EUR', symbol: '€', label: '€ EUR (Euro)' },
  { code: 'GBP', symbol: '£', label: '£ GBP (British Pound)' },
  { code: 'AED', symbol: 'AED', label: 'AED (UAE Dirham)' },
  { code: 'CAD', symbol: 'C$', label: 'C$ CAD (Canadian Dollar)' },
  { code: 'AUD', symbol: 'A$', label: 'A$ AUD (Australian Dollar)' },
  { code: 'JPY', symbol: '¥', label: '¥ JPY (Japanese Yen)' },
];

export const getCurrencySymbol = (currency?: string): string => {
  if (!currency) return '₹';
  const trimmed = currency.trim();
  const found = CURRENCY_OPTIONS.find(
    (c) => c.code === trimmed || c.symbol === trimmed || c.label === trimmed
  );
  if (found) return found.symbol;
  if (trimmed.startsWith('₹') || trimmed.includes('INR')) return '₹';
  if (trimmed.startsWith('$') || trimmed.includes('USD')) return '$';
  if (trimmed.startsWith('€') || trimmed.includes('EUR')) return '€';
  if (trimmed.startsWith('£') || trimmed.includes('GBP')) return '£';
  if (trimmed.startsWith('¥') || trimmed.includes('JPY')) return '¥';
  if (trimmed.startsWith('C$') || trimmed.includes('CAD')) return 'C$';
  if (trimmed.startsWith('A$') || trimmed.includes('AUD')) return 'A$';
  return trimmed.split(' ')[0] || '₹';
};

export const formatMoney = (amount: number, currency?: string): string => {
  const sym = getCurrencySymbol(currency);
  return `${sym}${Math.abs(amount).toLocaleString('en-IN')}`;
};
