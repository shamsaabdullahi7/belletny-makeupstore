const defaultCurrencyOptions = {
  style: "currency",
  currency: "KES",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const formatCurrency = (
  amount = 0,
  locale = "en-KE",
  options = defaultCurrencyOptions,
) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return new Intl.NumberFormat(locale, options).format(0);
  }

  return new Intl.NumberFormat(locale, {
    ...defaultCurrencyOptions,
    ...options,
  }).format(numericAmount);
};

export default formatCurrency;
