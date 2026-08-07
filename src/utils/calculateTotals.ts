export interface DocumentTotals {
  subtotal: number;
  tax: number;
  total: number;
}

export function calculateTotals<T>(
  items: T[],
  getLineTotal: (item: T) => number,
  taxRate: number
): DocumentTotals {
  const subtotal = items.reduce((sum, item) => sum + getLineTotal(item), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  return { subtotal, tax, total };
}


export const QUOTE_TAX_RATE_PERCENT = 15;
