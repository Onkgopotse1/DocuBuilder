import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  DocumentProvider,
  useDocument,
  defaultDocument,
  defaultInvoice,
  defaultQuote,
  defaultContract,
  defaultReceipt,
  defaultReport,
  defaultExpense,
  defaultTimesheet,
  defaultCreditNote,
  defaultDeliveryNote,
  defaultPurchaseOrder,
} from '../../context/DocumentContext';
import { ThemeProvider, useTheme } from '../../context/Theme Context.tsx';

describe('DocumentContext', () => {
  it('defaults match the canonical default values', () => {
    const { result } = renderHook(() => useDocument(), {
      wrapper: DocumentProvider,
    });

    expect(result.current.document).toEqual(defaultDocument);
    expect(result.current.document.invoice).toEqual(defaultInvoice);
    expect(result.current.document.quote).toEqual(defaultQuote);
    expect(result.current.document.contract).toEqual(defaultContract);
    expect(result.current.document.receipt).toEqual(defaultReceipt);
    expect(result.current.document.report).toEqual(defaultReport);
    expect(result.current.document.expense).toEqual(defaultExpense);
    expect(result.current.document.timesheet).toEqual(defaultTimesheet);
    expect(result.current.document.creditNote).toEqual(defaultCreditNote);
    expect(result.current.document.deliveryNote).toEqual(defaultDeliveryNote);
    expect(result.current.document.purchaseOrder).toEqual(defaultPurchaseOrder);
  });

  it('updates one document type without mutating any of the other nine', () => {
    const { result } = renderHook(() => useDocument(), {
      wrapper: DocumentProvider,
    });

    const before = structuredClone(result.current.document);

    act(() => {
      result.current.setDocument((prev) => ({
        ...prev,
        invoice: {
          ...prev.invoice,
          clientName: 'Updated Client',
        },
      }));
    });

    const after = result.current.document;

    expect(after.invoice.clientName).toBe('Updated Client');
    expect(after.quote).toEqual(before.quote);
    expect(after.contract).toEqual(before.contract);
    expect(after.receipt).toEqual(before.receipt);
    expect(after.report).toEqual(before.report);
    expect(after.expense).toEqual(before.expense);
    expect(after.timesheet).toEqual(before.timesheet);
    expect(after.creditNote).toEqual(before.creditNote);
    expect(after.deliveryNote).toEqual(before.deliveryNote);
    expect(after.purchaseOrder).toEqual(before.purchaseOrder);
  });
});

describe('ThemeContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('reads the initial theme from localStorage', () => {
    window.localStorage.setItem('docubuilder-theme', 'dark');

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggleTheme flips between light and dark and persists the value', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(window.localStorage.getItem('docubuilder-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(window.localStorage.getItem('docubuilder-theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('setTheme writes the explicit theme to localStorage and updates the dark class', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(window.localStorage.getItem('docubuilder-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.theme).toBe('light');
    expect(window.localStorage.getItem('docubuilder-theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
