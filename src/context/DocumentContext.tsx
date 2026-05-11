import React, { createContext, useState, useContext,  } from "react";
import type {ReactNode} from 'react';

// ---------- Data interfaces ----------
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  taxRate: number;
  items: InvoiceItem[];
}

export interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteData {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  quoteNumber: string;
  issueDate: string;
  expiryDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  items: QuoteItem[];
  terms: string;
}

export interface ContractData {
  documentTitle: string;
  effectiveDate: string;
  governingLaw: string;
  clientName: string;
  clientAddress: string;
  contractorName: string;
  contractorAddress: string;
  totalValue: number;
  depositPercent: number;
  scope: string;
}

export interface ReceiptItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface ReceiptData {
  customerName: string;
  customerEmail: string;
  receiptNumber: string;
  paymentDate: string;
  paymentMethod: string;
  items: ReceiptItem[];
  memo: string;
  taxRate: number;
}

export interface ReportEntry {
  category: string;
  description: string;
  amount: number;
}

export interface ReportData {
  reportTitle: string;
  reportType: string;
  reportNumber: string;
  dateFrom: string;
  dateTo: string;
  preparedByCompany: string;
  preparedByEmail: string;
  preparedForCompany: string;
  preparedForEmail: string;
  entries: ReportEntry[];
  taxRate: number;
  summaryNotes: string;
}

export interface ExpenseItem {
  date: string;
  category: string;
  description: string;
  amount: number;
}

export interface ExpenseData {
  claimantName: string;
  department: string;
  email: string;
  submittedTo: string;
  claimNumber: string;
  periodFrom: string;
  periodTo: string;
  items: ExpenseItem[];
  purposeNotes: string;
}

export interface TimesheetProject {
  project: string;
  hours: number[]; // length 7 (Mon-Sun)
}

export interface TimesheetData {
  employeeName: string;
  jobTitle: string;
  department: string;
  submittedTo: string;
  weekStarting: string;
  weekEnding: string;
  hourlyRate: number;
  projects: TimesheetProject[];
  overtimeHours: number;
  overtimeRate: number;
  notes: string;
}

export interface CreditNoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreditNoteData {
  creditNoteNumber: string;
  issueDate: string;
  originalInvoice: string;
  originalInvoiceDate: string;
  issuedByCompany: string;
  issuedByEmail: string;
  issuedByAddress: string;
  issuedToClientName: string;
  issuedToEmail: string;
  issuedToAddress: string;
  reason: string;
  reasonDetails: string;
  items: CreditNoteItem[];
}

export interface DeliveryNoteItem {
  description: string;
  quantity: number;
  unit: string;
  condition: string;
}

export interface DeliveryNoteData {
  dnNumber: string;
  date: string;
  poReference: string;
  invoiceReference: string;
  dispatchedFromCompany: string;
  dispatchedFromContact: string;
  dispatchedFromPhone: string;
  dispatchedFromAddress: string;
  deliverToCompany: string;
  deliverToContact: string;
  deliverToPhone: string;
  deliverToAddress: string;
  items: DeliveryNoteItem[];
  driverName: string;
  vehicleReg: string;
  eta: string;
  instructions: string;
}

export interface PurchaseOrderItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface PurchaseOrderData {
  poNumber: string;
  issueDate: string;
  requiredBy: string;
  currency: string;
  buyerCompany: string;
  buyerContact: string;
  buyerEmail: string;
  buyerAddress: string;
  vendorName: string;
  vendorContact: string;
  vendorEmail: string;
  vendorAddress: string;
  items: PurchaseOrderItem[];
  paymentTerms: string;
  notes: string;
  taxRate: number;
}

export interface DocumentState {
  invoice: InvoiceData;
  quote: QuoteData;
  contract: ContractData;
  receipt: ReceiptData;
  report: ReportData;
  expense: ExpenseData;
  timesheet: TimesheetData;
  creditNote: CreditNoteData;
  deliveryNote: DeliveryNoteData;
  purchaseOrder: PurchaseOrderData;
}

// ---------- Initial empty state ----------
const initialInvoice: InvoiceData = {
  clientName: "",
  clientEmail: "",
  clientAddress: "",
  invoiceNumber: "",
  invoiceDate: "",
  taxRate: 0,
  items: [],
};

const initialQuote: QuoteData = {
  companyName: "",
  companyEmail: "",
  companyAddress: "",
  quoteNumber: "",
  issueDate: "",
  expiryDate: "",
  clientName: "",
  clientEmail: "",
  clientAddress: "",
  items: [],
  terms: "",
};

const initialContract: ContractData = {
  documentTitle: "",
  effectiveDate: "",
  governingLaw: "",
  clientName: "",
  clientAddress: "",
  contractorName: "",
  contractorAddress: "",
  totalValue: 0,
  depositPercent: 0,
  scope: "",
};

const initialReceipt: ReceiptData = {
  customerName: "",
  customerEmail: "",
  receiptNumber: "",
  paymentDate: "",
  paymentMethod: "EFT / Bank Transfer",
  items: [],
  memo: "",
  taxRate: 0,
};

const initialReport: ReportData = {
  reportTitle: "",
  reportType: "",
  reportNumber: "",
  dateFrom: "",
  dateTo: "",
  preparedByCompany: "",
  preparedByEmail: "",
  preparedForCompany: "",
  preparedForEmail: "",
  entries: [],
  taxRate: 0,
  summaryNotes: "",
};

const initialExpense: ExpenseData = {
  claimantName: "",
  department: "",
  email: "",
  submittedTo: "",
  claimNumber: "",
  periodFrom: "",
  periodTo: "",
  items: [],
  purposeNotes: "",
};

const initialTimesheet: TimesheetData = {
  employeeName: "",
  jobTitle: "",
  department: "",
  submittedTo: "",
  weekStarting: "",
  weekEnding: "",
  hourlyRate: 0,
  projects: [],
  overtimeHours: 0,
  overtimeRate: 0,
  notes: "",
};

const initialCreditNote: CreditNoteData = {
  creditNoteNumber: "",
  issueDate: "",
  originalInvoice: "",
  originalInvoiceDate: "",
  issuedByCompany: "",
  issuedByEmail: "",
  issuedByAddress: "",
  issuedToClientName: "",
  issuedToEmail: "",
  issuedToAddress: "",
  reason: "",
  reasonDetails: "",
  items: [],
};

const initialDeliveryNote: DeliveryNoteData = {
  dnNumber: "",
  date: "",
  poReference: "",
  invoiceReference: "",
  dispatchedFromCompany: "",
  dispatchedFromContact: "",
  dispatchedFromPhone: "",
  dispatchedFromAddress: "",
  deliverToCompany: "",
  deliverToContact: "",
  deliverToPhone: "",
  deliverToAddress: "",
  items: [],
  driverName: "",
  vehicleReg: "",
  eta: "",
  instructions: "",
};

const initialPurchaseOrder: PurchaseOrderData = {
  poNumber: "",
  issueDate: "",
  requiredBy: "",
  currency: "ZAR",
  buyerCompany: "",
  buyerContact: "",
  buyerEmail: "",
  buyerAddress: "",
  vendorName: "",
  vendorContact: "",
  vendorEmail: "",
  vendorAddress: "",
  items: [],
  paymentTerms: "",
  notes: "",
  taxRate: 0,
};

const initialDocumentState: DocumentState = {
  invoice: initialInvoice,
  quote: initialQuote,
  contract: initialContract,
  receipt: initialReceipt,
  report: initialReport,
  expense: initialExpense,
  timesheet: initialTimesheet,
  creditNote: initialCreditNote,
  deliveryNote: initialDeliveryNote,
  purchaseOrder: initialPurchaseOrder,
};

// ---------- Context ----------
interface DocumentContextType {
  document: DocumentState;
  setDocument: React.Dispatch<React.SetStateAction<DocumentState>>;
}

const DocumentContext = createContext<DocumentContextType>({
  document: initialDocumentState,
  setDocument: () => {},
});

export const useDocument = () => useContext(DocumentContext);

// ---------- Provider ----------
export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [document, setDocument] = useState<DocumentState>(initialDocumentState);
  return <DocumentContext.Provider value={{ document, setDocument }}>{children}</DocumentContext.Provider>;
};