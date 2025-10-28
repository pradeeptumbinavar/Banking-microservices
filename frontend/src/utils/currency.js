// Currency formatting utilities

export const getCurrencySymbol = (currencyCode) => {
  const code = (currencyCode || '').toUpperCase();
  const map = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹'
  };
  return map[code] || code || '$';
};

export const formatCurrencyAmount = (currencyCode, amount) => {
  const code = (currencyCode || 'USD').toUpperCase();
  const value = Number(amount || 0);
  try {
    const locale = code === 'INR' ? 'en-IN' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  } catch (_) {
    const symbol = getCurrencySymbol(code);
    return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};


