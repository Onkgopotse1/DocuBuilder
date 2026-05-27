import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// ==================== INVOICE TYPES ====================
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  taxRate: number;
  items: InvoiceItem[];
}

// ==================== RECEIPT TYPES ====================
export interface ReceiptItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Receipt {
  customerName: string;
  customerEmail: string;
  receiptNumber: string;
  paymentDate: string;
  paymentMethod: string;
  memo: string;
  taxRate: number;
  items: ReceiptItem[];
}

// ==================== REPORT TYPES ====================
export interface ReportItem {
  category: string;
  description: string;
  amount: number;
}

export interface Report {
  title: string;
  type: string;
  reportNumber: string;
  dateFrom: string;
  dateTo: string;
  preparedByName: string;
  preparedByEmail: string;
  preparedForName: string;
  preparedForEmail: string;
  items: ReportItem[];
  taxRate: number;
  notes: string;
}

// ==================== EXPENSE TYPES ====================
export interface ExpenseItem {
  date: string;
  category: string;
  description: string;
  amount: number;
}

export interface Expense {
  claimantName: string;
  claimantRole: string;
  claimantEmail: string;
  submittedTo: string;
  claimNumber: string;
  periodFrom: string;
  periodTo: string;
  items: ExpenseItem[];
  notes: string;
}

// ==================== TIMESHEET TYPES ====================
export interface TimesheetRow {
  projectName: string;
  hours: number[]; // length 7: Mon=0 .. Sun=6
}

export interface Timesheet {
  employeeName: string;
  jobTitle: string;
  department: string;
  submittedTo: string;
  weekStarting: string;
  weekEnding: string;
  hourlyRate: number;
  rows: TimesheetRow[];
  overtimeHours: number;
  overtimeRate: number;
  notes: string;
}

// ==================== CREDIT NOTE TYPES ====================
export interface CreditNoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface CreditNote {
  creditNoteNumber: string;
  issueDate: string;
  originalInvoiceNumber: string;
  originalInvoiceDate: string;
  issuerName: string;
  issuerEmail: string;
  issuerAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  reason: string;
  reasonOtherText?: string;
  additionalDetails: string;
  items: CreditNoteItem[];
}

// ==================== DELIVERY NOTE TYPES ====================
export interface DeliveryNoteItem {
  description: string;
  quantity: number;
  unit: string;      // "Each", "Box", "Pallet", etc.
  condition: string; // "New", "Used", "Refurb"
}

export interface DeliveryNote {
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

// ==================== PURCHASE ORDER TYPES ====================
export interface PurchaseOrderItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number; // derived: quantity * unitPrice
}

export interface PurchaseOrder {
  poNumber: string;
  issueDate: string;
  requiredBy: string;
  currency: string;
  // Buyer (us)
  buyerCompany: string;
  buyerContact: string;
  buyerEmail: string;
  buyerAddress: string;
  // Vendor
  vendorName: string;
  vendorContact: string;
  vendorEmail: string;
  vendorAddress: string;
  // Items
  items: PurchaseOrderItem[];
  vatRate: number;
  paymentTerms: string; // one of "30 days net", "14 days net", "COD", "Upfront", "50% deposit", "Custom"
  customTerms?: string;
  notes: string;
}

// ==================== DOCUMENT UNION ====================
export interface DocumentType {
  invoice: Invoice;
  receipt: Receipt;
  report: Report;
  expense: Expense;
  timesheet: Timesheet;
  creditNote: CreditNote;
  deliveryNote: DeliveryNote;
  purchaseOrder: PurchaseOrder;   // <-- new
}

// ==================== INITIAL DEFAULTS ====================
const defaultInvoice: Invoice = {
  clientName: "",
  clientEmail: "",
  clientAddress: "",
  invoiceNumber: "",
  invoiceDate: new Date().toISOString().slice(0, 10),
  taxRate: 0,
  items: [{ description: "", quantity: 1, unitPrice: 0 }],
};

const defaultReceipt: Receipt = {
  customerName: "BrightWave Marketing",
  customerEmail: "contact@brightwave.com",
  receiptNumber: "RCT-1002",
  paymentDate: new Date().toISOString().slice(0, 10),
  paymentMethod: "EFT / Bank Transfer",
  memo: "Thank you for your prompt payment!",
  taxRate: 15,
  items: [{ description: "Web Development Retainer", quantity: 1, unitPrice: 15000 }],
};

const defaultReport: Report = {
  title: "Q2 Financial Summary",
  type: "Financial Summary",
  reportNumber: "RPT-2025-001",
  dateFrom: "2025-04-01",
  dateTo: "2025-06-30",
  preparedByName: "Nexus Solutions Inc.",
  preparedByEmail: "billing@nexus.com",
  preparedForName: "Acme Corp",
  preparedForEmail: "accounts@acme.com",
  items: [
    { category: "Revenue", description: "Web development services", amount: 12500 },
    { category: "Revenue", description: "UI/UX consulting", amount: 4200 },
    { category: "Expense", description: "Software subscriptions", amount: 1080 },
    { category: "Expense", description: "Office supplies", amount: 340 },
  ],
  taxRate: 15,
  notes:
    "Strong revenue growth in Q2 driven by web development services. Expenses remain within budget. Net profit margin of 68% achieved for the quarter.",
};

const defaultExpense: Expense = {
  claimantName: "John Mokoena",
  claimantRole: "Sales",
  claimantEmail: "john@email.com",
  submittedTo: "Acme Corp",
  claimNumber: "EXP-2025-001",
  periodFrom: "2025-06-01",
  periodTo: "2025-06-30",
  items: [
    { date: "2025-06-03", category: "Travel", description: "Uber to client meeting", amount: 185 },
    { date: "2025-06-05", category: "Meals", description: "Working lunch with team", amount: 420 },
    { date: "2025-06-09", category: "Fuel", description: "Site visit – Midrand", amount: 340 },
    { date: "2025-06-14", category: "Software", description: "Figma monthly subscription", amount: 320 },
    { date: "2025-06-18", category: "Stationery", description: "Printing & binding", amount: 95 },
  ],
  notes: "Business-related travel, meals, and software expenses incurred during client engagements and project delivery for the month of June 2025.",
};

const defaultTimesheet: Timesheet = {
  employeeName: "John Mokoena",
  jobTitle: "Frontend Developer",
  department: "Engineering",
  submittedTo: "Jane Smith",
  weekStarting: "2025-06-09",
  weekEnding: "2025-06-15",
  hourlyRate: 250,
  rows: [
    { projectName: "Project Alpha", hours: [8, 8, 7, 8, 6, 0, 0] },
    { projectName: "Admin / Meetings", hours: [0, 0, 1, 0, 2, 0, 0] },
    { projectName: "Project Beta", hours: [0, 0, 0, 0, 0, 4, 0] },
  ],
  overtimeHours: 4,
  overtimeRate: 375,
  notes: "Public holiday on Monday? No, but took Friday off for training.",
};

const defaultCreditNote: CreditNote = {
  creditNoteNumber: "CN-2025-001",
  issueDate: "2025-04-20",
  originalInvoiceNumber: "INV-2025-042",
  originalInvoiceDate: "2025-04-10",
  issuerName: "Nexus Solutions Inc.",
  issuerEmail: "billing@nexus.com",
  issuerAddress: "123 Business Ave, Sandton",
  clientName: "Acme Innovations",
  clientEmail: "accounts@acme.com",
  clientAddress: "456 Corporate Blvd, Rosebank",
  reason: "Returned goods",
  additionalDetails: "partial work not delivered as agreed per contract.",
  items: [
    { description: "Web Development – Phase 2 (returned)", quantity: 1, unitPrice: 3500, amount: 3500 },
    { description: "UI/UX Design (overcharge adjustment)", quantity: 2, unitPrice: 200, amount: 400 },
  ],
};

const defaultDeliveryNote: DeliveryNote = {
  dnNumber: "DN-2025-001",
  date: new Date().toISOString().slice(0, 10),
  poReference: "PO-2025-055",
  invoiceReference: "INV-2025-042",
  dispatchedFromCompany: "Nexus Solutions Inc.",
  dispatchedFromContact: "John Mokoena",
  dispatchedFromPhone: "+27 11 000 0000",
  dispatchedFromAddress: "12 Industrial Rd, Germiston",
  deliverToCompany: "Acme Innovations",
  deliverToContact: "Sarah Dlamini",
  deliverToPhone: "+27 11 123 4567",
  deliverToAddress: "456 Corporate Blvd, Rosebank",
  items: [
    { description: "Steel brackets (box of 50)", quantity: 2, unit: "Box", condition: "New" },
    { description: "Allen key set 8mm", quantity: 1, unit: "Each", condition: "New" },
  ],
  driverName: "Thabo Nkosi",
  vehicleReg: "GP 456 789",
  eta: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  instructions: "Fragile items – handle with care. Call ahead 30min before arrival.",
};

const defaultPurchaseOrder: PurchaseOrder = {
  poNumber: "PO-2025-001",
  issueDate: new Date().toISOString().slice(0, 10),
  requiredBy: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
  currency: "ZAR",
  buyerCompany: "Nexus Solutions Inc.",
  buyerContact: "Jane Smith",
  buyerEmail: "procurement@nexus.com",
  buyerAddress: "123 Business Ave, Sandton",
  vendorName: "TechSupply Co.",
  vendorContact: "Michael Lee",
  vendorEmail: "sales@techsupply.co.za",
  vendorAddress: "99 Supplier Park, Midrand",
  items: [
    { description: "MacBook Pro 14\" M3 Pro", quantity: 3, unit: "Each", unitPrice: 42000, total: 126000 },
    { description: "USB-C Hub – 7-in-1", quantity: 3, unit: "Each", unitPrice: 1200, total: 3600 },
    { description: "Software Licences – Annual", quantity: 5, unit: "Month", unitPrice: 850, total: 4250 },
  ],
  vatRate: 15,
  paymentTerms: "30 days net",
  notes: "Payment due within 30 days of delivery. All items subject to inspection on receipt. Please reference PO-2025-001 on all correspondence and invoices.",
};

const defaultDocument: DocumentType = {
  invoice: defaultInvoice,
  receipt: defaultReceipt,
  report: defaultReport,
  expense: defaultExpense,
  timesheet: defaultTimesheet,
  creditNote: defaultCreditNote,
  deliveryNote: defaultDeliveryNote,
  purchaseOrder: defaultPurchaseOrder,
};

// ==================== CONTEXT ====================
interface DocumentContextType {
  document: DocumentType;
  setDocument: React.Dispatch<React.SetStateAction<DocumentType>>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [document, setDocument] = useState<DocumentType>(defaultDocument);

  return (
    <DocumentContext.Provider value={{ document, setDocument }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider");
  }
  return context;
};