import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportPDF = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found.`);
  }

  const originalStyle = element.getAttribute("style") || "";
  const originalClassName = element.className;

  const hiddenButtons: Array<{ button: HTMLElement; originalDisplay: string }> = [];

  try {
    const originalScrollY = window.scrollY;
    window.scrollTo(0, 0);

    // --- Prepare the element for printing ---
    element.style.width = "210mm";
    element.style.minHeight = "auto";          // allow natural height
    element.style.height = "auto";
    element.style.padding = "30mm 20mm";
    element.style.boxSizing = "border-box";
    element.style.backgroundColor = "#ffffff";
    element.style.overflow = "visible";

    // Soften rounded corners
    element.querySelectorAll(".rounded-2xl, .rounded-xl").forEach((el) => {
      el.classList.remove("rounded-2xl", "rounded-xl");
      (el as HTMLElement).style.borderRadius = "4px";
    });

    // Hide all buttons for a clean capture
    Array.from(element.querySelectorAll("button")).forEach((button) => {
      const originalDisplay = (button as HTMLElement).style.display || "";
      (button as HTMLElement).style.display = "none";
      hiddenButtons.push({ button: button as HTMLElement, originalDisplay });
    });

    // --- Render the whole element to a canvas ---
    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // Restore buttons & original styles
    hiddenButtons.forEach(({ button, originalDisplay }) => {
      button.style.display = originalDisplay;
    });
    window.scrollTo(0, originalScrollY);
    element.setAttribute("style", originalStyle);
    element.className = originalClassName;

    // --- PDF setup ---
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Canvas dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Ratio between PDF width and canvas width
    const ratio = pdfWidth / canvasWidth;
    const pageCanvasHeight = pdfHeight / ratio; // How many canvas pixels fit on one PDF page

    let remainingHeight = canvasHeight;
    let offsetY = 0;

    while (remainingHeight > 0) {
      // Capture a slice of the canvas
      const sliceHeight = Math.min(remainingHeight, pageCanvasHeight);
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvasWidth;
      pageCanvas.height = sliceHeight;

      const ctx = pageCanvas.getContext("2d")!;
      ctx.drawImage(
        canvas,
        0, offsetY, canvasWidth, sliceHeight,
        0, 0, canvasWidth, sliceHeight
      );

      const imgData = pageCanvas.toDataURL("image/png");

      if (offsetY > 0) {
        pdf.addPage(); // add a new page for every slice after the first
      }

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, sliceHeight * ratio);

      offsetY += sliceHeight;
      remainingHeight -= sliceHeight;
    }

    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    // Restore everything even on error
    hiddenButtons.forEach(({ button, originalDisplay }) => {
      button.style.display = originalDisplay;
    });
    element.setAttribute("style", originalStyle);
    element.className = originalClassName;
    const message = error instanceof Error ? error.message : String(error);
    console.error("PDF generation failed:", error);
    throw new Error(`PDF generation failed: ${message}`);
  }
};