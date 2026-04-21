import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// ---------- Types ----------
export interface LineItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceFields {
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  taxRate: number;
}

interface InvoiceContextValue extends InvoiceFields {
  setClientName: (v: string) => void;
  setClientEmail: (v: string) => void;
  setClientAddress: (v: string) => void;
  setInvoiceNumber: (v: string) => void;
  setInvoiceDate: (v: string) => void;
  setTaxRate: (v: number) => void;
  lineItems: LineItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  updateLineItem: (id: number, field: keyof LineItem, value: string | number) => void;
  addLineItem: () => void;
  removeLineItem: (id: number) => void;
  generatePDF: () => void;
}

// ---------- Helpers ----------
export const formatMoney = (amount: number): string => `R${amount.toFixed(2)}`;

let nextId = 4;
const initialLineItems: LineItem[] = [
  { id: 1, description: 'Web Development - Deposit', quantity: 1, unitPrice: 850.0 },
  { id: 2, description: 'UI/UX Design', quantity: 2, unitPrice: 375.0 },
  { id: 3, description: 'Hosting Setup', quantity: 1, unitPrice: 120.0 },
];

// ---------- Context ----------
const InvoiceContext = createContext<InvoiceContextValue | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fields, setFields] = useState<InvoiceFields>({
    clientName: 'Acme Innovations',
    clientEmail: 'billing@acme.com',
    clientAddress: '123 Business Blvd, Suite 100\nAustin, TX 78701',
    invoiceNumber: 'INV-2025-0042',
    invoiceDate: new Date().toISOString().slice(0, 10),
    taxRate: 8.5,
  });
  const [lineItems, setLineItems] = useState<LineItem[]>(initialLineItems);

  // Generic field setter — produces a typed setter for any InvoiceFields key
  const set = <K extends keyof InvoiceFields>(key: K) =>
    (value: InvoiceFields[K]) => setFields(prev => ({ ...prev, [key]: value }));

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = subtotal * (fields.taxRate / 100);
  const total = subtotal + taxAmount;

  const updateLineItem = (id: number, field: keyof LineItem, value: string | number) =>
    setLineItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, [field]: (field === 'quantity' || field === 'unitPrice') ? parseFloat(value as string) || 0 : value }
          : item
      )
    );

  const addLineItem = () =>
    setLineItems(prev => [...prev, { id: nextId++, description: 'New Service', quantity: 1, unitPrice: 0 }]);

  const removeLineItem = (id: number) =>
    setLineItems(prev => prev.filter(item => item.id !== id));
// grenerate pdf
  const generatePDF = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = margin;

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE BUILDER', margin, yPos);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Invoice', pageWidth - margin, yPos, { align: 'right' });
    yPos += 10;

    doc.setFontSize(9);
    doc.text(`Invoice #: ${fields.invoiceNumber}`, pageWidth - margin, yPos, { align: 'right' });
    doc.text(`Date: ${fields.invoiceDate}`, pageWidth - margin, yPos + 5, { align: 'right' });
    yPos += 12;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 6;
    doc.setFontSize(9);
    [fields.clientName, fields.clientEmail, fields.clientAddress].forEach(line => {
      doc.text(line, margin, yPos);
      yPos += 5;
    });
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      head: [['Description', 'Qty', 'Unit Price', 'Amount']],
      body: lineItems.map(item => [item.description, item.quantity.toString(), formatMoney(item.unitPrice), formatMoney(item.quantity * item.unitPrice)]),
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [30, 60, 114], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 248, 250] },
    });

    let finalY = (doc as any).lastAutoTable.finalY + 5;
    const rightX = pageWidth - margin;

    doc.setFontSize(9);
    doc.text(`Subtotal: ${formatMoney(subtotal)}`, rightX, finalY, { align: 'right' });
    finalY += 5;
    doc.text(`Tax (${fields.taxRate}%): ${formatMoney(taxAmount)}`, rightX, finalY, { align: 'right' });
    finalY += 6;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${formatMoney(total)}`, rightX, finalY, { align: 'right' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your business. Payment due within 30 days.', margin, doc.internal.pageSize.getHeight() - 10);

    doc.save(`Invoice_${fields.invoiceNumber}.pdf`);
  };//----------

  return (
    <InvoiceContext.Provider value={{
      ...fields,
      setClientName: set('clientName'),
      setClientEmail: set('clientEmail'),
      setClientAddress: set('clientAddress'),
      setInvoiceNumber: set('invoiceNumber'),
      setInvoiceDate: set('invoiceDate'),
      setTaxRate: set('taxRate'),
      lineItems, subtotal, taxAmount, total,
      updateLineItem, addLineItem, removeLineItem, generatePDF,
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = (): InvoiceContextValue => {
  const context = useContext(InvoiceContext);
  if (!context) throw new Error('useInvoice must be used within an InvoiceProvider');
  return context;
};