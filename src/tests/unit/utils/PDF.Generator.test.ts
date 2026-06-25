import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const saveMock = vi.fn();
const addPageMock = vi.fn();
const addImageMock = vi.fn();

vi.mock("jspdf", () => ({
  default: vi.fn(function () {
    return {
      internal: {
        pageSize: {
          getWidth: () => 210,
          getHeight: () => 297,
        },
      },
      addPage: addPageMock,
      addImage: addImageMock,
      save: saveMock,
    };
  }),
}));

vi.mock("html2canvas", () => ({
  default: vi.fn(async () => ({
    width: 1000,
    height: 1500,
  })),
}));

import { exportPDF } from "../../../utils/PDF.Generator";
import html2canvas from "html2canvas";

describe("exportPDF", () => {
  let originalCreateElement: typeof document.createElement;
  let scrollToSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    originalCreateElement = document.createElement;
    scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    document.createElement = ((tagName: string) => {
      if (tagName.toLowerCase() === "canvas") {
        return {
          width: 0,
          height: 0,
          getContext: vi.fn().mockReturnValue({
            drawImage: vi.fn(),
          }),
          toDataURL: vi.fn().mockReturnValue("data:image/png;base64,fake"),
        } as unknown as HTMLCanvasElement;
      }

      return originalCreateElement.call(document, tagName);
    }) as typeof document.createElement;
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    scrollToSpy.mockRestore();
    document.body.innerHTML = "";
  });

  test("throws when the target element does not exist", async () => {
    await expect(exportPDF("missing-element", "test-file")).rejects.toThrow(
      'Element with id "missing-element" not found.'
    );
  });

  test("generates a PDF and restores original DOM state", async () => {
    const container = document.createElement("div");
    container.id = "pdf-target";
    container.className = "rounded-xl";
    container.style.display = "block";
    container.style.width = "100px";

    const button = document.createElement("button");
    button.style.display = "inline-block";
    container.appendChild(button);

    const child = document.createElement("span");
    child.textContent = "Hello PDF";
    container.appendChild(child);

    document.body.appendChild(container);

    await exportPDF("pdf-target", "output-file");

    expect(html2canvas).toHaveBeenCalledWith(container, {
      scale: 3,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      windowWidth: container.scrollWidth,
      windowHeight: container.scrollHeight,
    });

    expect(saveMock).toHaveBeenCalledWith("output-file.pdf");
    expect(addImageMock).toHaveBeenCalled();
    expect(addPageMock).toHaveBeenCalled();
    expect(button.style.display).toBe("inline-block");
    expect(container.style.width).toBe("100px");
    expect(container.className).toBe("rounded-xl");
    expect(scrollToSpy).toHaveBeenCalled();
  });
});
