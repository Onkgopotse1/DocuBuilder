import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect, describe } from 'vitest';
import { beforeEach } from "vitest";
import Home from "../pages/Home";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// Mock navigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock builders
vi.mock("../data/builders", () => ({
  builders: [
    {
      id: 1,
      name: "Invoice Builder",
      desc: "Create invoices",
      icon: "fas fa-file",
      path: "/invoice",
    },
  ],
}));

describe("Home Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renders builder cards", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Invoice Builder")).toBeInTheDocument();
    expect(screen.getByText("Create invoices")).toBeInTheDocument();
  });

  test("navigates when clicking a builder", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const card = screen.getByText("Invoice Builder");
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith("/invoice");
  });

  test("shows alert when clicking Settings", () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const settingsButton = screen.getByText(/settings/i);
    fireEvent.click(settingsButton);

    expect(alertMock).toHaveBeenCalled();

    alertMock.mockRestore();
  });
});
