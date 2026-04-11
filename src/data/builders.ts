import type { Builder } from "../types/types.ts";

import invoiceImg from "../assets/invoice.png";
import quotesImg from "../assets/quotes.png";
import agreementImg from "../assets/agreement.png";
import checkImg from "../assets/check.png";
import reportImg from "../assets/report.png";
import expencesImg from "../assets/expences.png";
import calendarImg from "../assets/calendar-deadline-date.png";
import checkOutImg from "../assets/check-out.png";
import deliveryManImg from "../assets/delivery-man.png";
import noteImg from "../assets/note.png";

export const builders: Builder[] = [
  {
    id: "invoice",
    name: "Invoice Builder",
    desc: "Create and download invoices as PDF.",
    icon: "fas fa-file-invoice-dollar",
    image: invoiceImg,
    path: "invoice-builder",
    longDesc: "Create itemized invoices, add tax, due dates, and download as high-quality PDF. Perfect for contractors & freelancers."
  },
  {
    id: "quote",
    name: "Quote Builder",
    desc: "Generate professional quotes for clients.",
    icon: "fas fa-file-signature",
    image: quotesImg,
    path: "quote-builder",
    longDesc: "Build polished quotes with pricing tables, validity terms, and client branding. Export to PDF or share link."
  },
  {
    id: "contract",
    name: "Contract Builder",
    desc: "Customize and export legal agreements.",
    icon: "fas fa-file-contract",
    image: agreementImg,
    path: "contract-builder",
    longDesc: "Customize legal agreement templates, e-signature ready, export as PDF or DOCX. Flexible clauses for any project."
  },
  {
    id: "receipt",
    name: "Receipt Builder",
    desc: "Issue receipts after payments.",
    icon: "fas fa-receipt",
    image: checkImg,
    path: "receipt-builder",
    longDesc: "Generate payment receipts with transaction ID, amount, and breakdown. Instant PDF download and email copy."
  },
  {
    id: "report",
    name: "Report Builder",
    desc: "Summarize transactions into clear reports.",
    icon: "fas fa-chart-line",
    image: reportImg,
    path: "report-builder",
    longDesc: "Aggregate transactions, expenses, and summaries into visual reports. Charts & clear tables ready for printing."
  },
  {
    id: "expense",
    name: "Expense Builder",
    desc: "Track and log business expenses.",
    icon: "fas fa-wallet",
    image: expencesImg,
    path: "expense-builder",
    longDesc: "Record daily expenses, categorize by project, attach receipts, and generate expense reports for tax purposes."
  },
  {
    id: "timesheet",
    name: "Timesheet Builder",
    desc: "Manage work hours and payroll.",
    icon: "fas fa-clock",
    image: calendarImg,
    path: "timesheet-builder",
    longDesc: "Log employee hours, overtime, breaks, and generate timesheets for payroll and client billing."
  },
  {
    id: "creditnote",
    name: "Credit Note Builder",
    desc: "Issue credit notes for returns.",
    icon: "fas fa-credit-card",
    image: checkOutImg,
    path: "credit-note-builder",
    longDesc: "Create professional credit notes for refunds, returns, or invoice adjustments. Keep accurate financial records."
  },
  {
    id: "deliverynote",
    name: "Delivery Note Builder",
    desc: "Create delivery dockets.",
    icon: "fas fa-truck",
    image: deliveryManImg,
    path: "delivery-note-builder",
    longDesc: "Generate delivery notes with itemized lists, quantities, and signatures. Perfect for logistics and dispatch."
  },
  {
    id: "purchaseorder",
    name: "Purchase Order Builder",
    desc: "Generate purchase orders for suppliers.",
    icon: "fas fa-shopping-cart",
    image: noteImg,
    path: "purchase-order-builder",
    longDesc: "Create purchase orders with supplier info, line items, and approval workflows. Streamline procurement."
  }
];