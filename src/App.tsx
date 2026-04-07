import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.tsx";
import BuilderPage from "./pages/BuilderPage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/builder/:builderId" element={<BuilderPage />} />
      {/* Redirect old-style paths to new param route */}
      <Route path="/invoice-builder" element={<Navigate to="/builder/invoice-builder" replace />} />
      <Route path="/quote-builder" element={<Navigate to="/builder/quote-builder" replace />} />
      <Route path="/contract-builder" element={<Navigate to="/builder/contract-builder" replace />} />
      <Route path="/receipt-builder" element={<Navigate to="/builder/receipt-builder" replace />} />
      <Route path="/report-builder" element={<Navigate to="/builder/report-builder" replace />} />
      <Route path="/expense-builder" element={<Navigate to="/builder/expense-builder" replace />} />
      <Route path="/timesheet-builder" element={<Navigate to="/builder/timesheet-builder" replace />} />
      <Route path="/credit-note-builder" element={<Navigate to="/builder/credit-note-builder" replace />} />
      <Route path="/delivery-note-builder" element={<Navigate to="/builder/delivery-note-builder" replace />} />
      <Route path="/purchase-order-builder" element={<Navigate to="/builder/purchase-order-builder" replace />} />
    </Routes>
  );
}

export default App;