import { describe, it, expect } from 'vitest';
import {
  calculateTotals,
  QUOTE_TAX_RATE_PERCENT,
} from '../../utils/calculateTotals';

interface LineItem {
  quantity: number;
  unitPrice: number;
}

const getLineTotal = (item: LineItem) => item.quantity * item.unitPrice;

describe('calculateTotals', () => {
  it('returns zero totals for an empty item list', () => {
    const result = calculateTotals<LineItem>([], getLineTotal, QUOTE_TAX_RATE_PERCENT);

    expect(result).toEqual({
      subtotal: 0,
      tax: 0,
      total: 0,
    });
  });

  it('calculates the subtotal by summing getLineTotal values', () => {
    const items: LineItem[] = [
      { quantity: 2, unitPrice: 10 },
      { quantity: 3, unitPrice: 4.5 },
    ];

    const result = calculateTotals(items, getLineTotal, 0);

    expect(result.subtotal).toBeCloseTo(33.5);
    expect(result.tax).toBe(0);
    expect(result.total).toBeCloseTo(33.5);
  });

  it('applies the tax rate as a percentage', () => {
    const items: LineItem[] = [
      { quantity: 1, unitPrice: 200 },
    ];

    const result = calculateTotals(items, getLineTotal, QUOTE_TAX_RATE_PERCENT);

    expect(result.subtotal).toBe(200);
    expect(result.tax).toBe(30);
    expect(result.total).toBe(230);
  });

  it('uses the tax rate as a percent, not a decimal', () => {
    const items: LineItem[] = [
      { quantity: 1, unitPrice: 100 },
    ];

    expect(calculateTotals(items, getLineTotal, 7.5).tax).toBe(7.5);
    expect(calculateTotals(items, getLineTotal, 0).tax).toBe(0);
  });

  it('handles fractional monetary values without internal rounding', () => {
    const items: LineItem[] = [
      { quantity: 1, unitPrice: 19.99 },
    ];

    const result = calculateTotals(items, getLineTotal, 8.25);

    expect(result.subtotal).toBeCloseTo(19.99);
    expect(result.tax).toBeCloseTo(19.99 * 0.0825);
    expect(result.total).toBeCloseTo(19.99 + 19.99 * 0.0825);
  });

  it('works with generic non-object item types', () => {
    const fruits = ['apple', 'banana', 'cherry'];
    const getLength = (fruit: string) => fruit.length;

    const result = calculateTotals(fruits, getLength, 10);

    expect(result.subtotal).toBe(17); 
    expect(result.tax).toBeCloseTo(1.7);
    expect(result.total).toBeCloseTo(18.7);
  });

  it('returns the expected DocumentTotals shape', () => {
    const items: LineItem[] = [
      { quantity: 1, unitPrice: 10 },
    ];

    const result = calculateTotals(items, getLineTotal, QUOTE_TAX_RATE_PERCENT);

    expect(result).toEqual({
      subtotal: expect.any(Number),
      tax: expect.any(Number),
      total: expect.any(Number),
    });
  });
});

describe('QUOTE_TAX_RATE_PERCENT', () => {
  it('is set to 15 percent', () => {
    expect(QUOTE_TAX_RATE_PERCENT).toBe(15);
  });
});