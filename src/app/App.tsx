import { Routes, Route, } from "react-router-dom";
import { InvoiceProvider } from "../context/InvoiceContext.tsx";

import Home from "../pages/Home.tsx";

import InvoiceBuilder from "../features/invoice/InvoiceBuilder.tsx";
import TimesheetBuilder from "../features/timesheet/TimesheetBuilder.tsx";
import QuoteBuilder from "../features/quote/QuoteBuilder.tsx";
import ContractBuilder from "../features/contract/ContractBuilder.tsx";
import ReceiptBuilder from "../features/receipt/ReceiptBuilder.tsx";
import ReportBuilder from "../features/report/ReportBuilder.tsx";
import ExpenseBuilder from "../features/expense/ExpenseBuilder.tsx";
import CreditNoteBuilder from "../features/creditNote/CreditNoteBuilder.tsx";
import DeliveryNoteBuilder from "../features/deliveryNote/DeliveryNoteBuilder.tsx";
import PurchaseOrderBuilder from "../features/purchaseOrder/PurchaseOrderBuilder.tsx";

import InvoicePreview from "../features/invoice/InvoicePreview.tsx";
import QuotePreview from "../features/quote/QuotePreview.tsx";
import ContractPreview from "../features/contract/ContractPreview.tsx";
import ReceiptPreview from "../features/receipt/ReceiptPreview.tsx";
import ReportPreview from "../features/report/ReportPreview.tsx";
import ExpensePreview from "../features/expense/ExpensePreview.tsx";
import CreditNotePreview from "../features/creditNote/CreditNotePreview.tsx";
import DeliveryNotePreview from "../features/deliveryNote/DeliveryNotePreview.tsx";
import PurchaseOrderPreview from "../features/purchaseOrder/PurchaseOrderPreview.tsx";
import TimesheetPreviw from "../features/timesheet/TimesheetPreview.tsx";

function App() {
  return (
    <InvoiceProvider>
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Generic builder route (optional if you use dynamic rendering) */}
  

      {/* Specific builder routes */}
      <Route path="/invoice-builder" element={<InvoiceBuilder />} />
      <Route path="/quote-builder" element={<QuoteBuilder />} />
      <Route path="/contract-builder" element={<ContractBuilder />} />
      <Route path="/receipt-builder" element={<ReceiptBuilder />} />
      <Route path="/report-builder" element={<ReportBuilder />} />
      <Route path="/expense-builder" element={<ExpenseBuilder />} />
      <Route path="/timesheet-builder" element={<TimesheetBuilder />} />
      <Route path="/credit-note-builder" element={<CreditNoteBuilder />} />
      <Route path="/delivery-note-builder" element={<DeliveryNoteBuilder />} />
      <Route path="/purchase-order-builder" element={<PurchaseOrderBuilder />} />
      
      <Route path="/invoice-preview" element={<InvoicePreview />} />
      <Route path="/quote-preview" element={<QuotePreview />} />
      <Route path="/contract-preview" element={<ContractPreview />} />
      <Route path="/receipt-preview" element={<ReceiptPreview />} />
      <Route path="/report-preview" element={<ReportPreview />} />
      <Route path="/expense-preview" element={<ExpensePreview />} />
      <Route path="/credit-note-preview" element={<CreditNotePreview />} />
      <Route path="/delivery-note-preview" element={<DeliveryNotePreview />} />
      <Route path="/purchase-order-preview" element={<PurchaseOrderPreview />} />
      <Route path="/timesheet-preview" element={<TimesheetPreviw />} />

    </Routes>
    </InvoiceProvider>
  );
}

export default App;