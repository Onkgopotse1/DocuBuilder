import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect, describe, beforeEach, vi } from "vitest";
import Home from "../pages/Home";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../context/Theme Context.tsx";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../data/builders", () => ({
  builders: [
    {
      id: 1,
      name: "Invoice Builder",
      desc: "Create invoices",
      icon: "fas fa-file",
      image: "",
      path: "/invoice",
    },
  ],
}));

const renderHome = () =>
  render(
    <ThemeProvider>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </ThemeProvider>
  );

describe("Home Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renders builder cards", () => {
    renderHome();
    expect(screen.getByText("Invoice Builder")).toBeInTheDocument();
    expect(screen.getByText("Create invoices")).toBeInTheDocument();
  });

  test("navigates when clicking a builder", () => {
    renderHome();
    const card = screen.getByText("Invoice Builder");
    fireEvent.click(card);
    expect(mockNavigate).toHaveBeenCalledWith("/invoice");
  });

  test("navigates when clicking Settings", () => {
    renderHome();
    const settingsButton = screen.getByText(/settings/i);
    fireEvent.click(settingsButton);
    expect(mockNavigate).toHaveBeenCalledWith("/settings");
  });
});