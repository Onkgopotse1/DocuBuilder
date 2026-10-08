import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportPDF = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element with id "${elementId}" not found.`);

  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      ignoreElements: (candidate) => candidate.tagName === "BUTTON",
    });

    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    if (canvas.width <= 0 || canvas.height <= 0) {
      throw new Error("The preview has no printable content.");
    }

    const scale = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
    const imageWidth = canvas.width * scale;
    const imageHeight = canvas.height * scale;
    const x = (pdfWidth - imageWidth) / 2;
    const y = (pdfHeight - imageHeight) / 2;

    pdf.addImage(canvas.toDataURL("image/png"), "PNG", x, y, imageWidth, imageHeight);

    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("PDF generation failed:", error);
    throw new Error(`PDF generation failed: ${message}`);
  }
};