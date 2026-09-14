import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { test, expect, describe, beforeEach, vi } from "vitest";
import { useEffect } from "react";
import Home from "../pages/Home";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider, useTheme } from "../context/Theme Context.tsx";

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
      image: "/images/invoice.png",
      path: "/invoice",
    },
    {
      id: 2,
      name: "Quote Builder",
      desc: "Create quotes",
      icon: "fas fa-file-signature",
      image: "/images/quote.png",
      path: "/quote",
    },
    {
      id: 3,
      name: "Contract Builder",
      desc: "Create contracts",
      icon: "fas fa-file-contract",
      image: "/images/contract.png",
      path: "/contract",
    },
    {
      id: 4,
      name: "Credit Note Builder",
      desc: "Create credit notes",
      icon: "fas fa-credit-card",
      image: "/images/credit-note.png",
      path: "/credit-note",
    },
  ],
}));

const renderHome = (theme: "light" | "dark" = "light") => {
  const HomeWithTheme = () => {
    const { setTheme } = useTheme();

    useEffect(() => {
      setTheme(theme);
    }, [theme, setTheme]);

    return <Home />;
  };

  return render(
    <ThemeProvider>
      <MemoryRouter>
        <HomeWithTheme />
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe("Home Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renders DocuBuilder title", () => {
    renderHome();
    expect(screen.getByText("DocuBuilder")).toBeInTheDocument();
    expect(screen.getByText(/Complete toolkit for pros 10 builders/i)).toBeInTheDocument();
    expect(screen.getByText(/PC \+ mobile ready smart docs/i)).toBeInTheDocument();
  });

  test("renders the header logo image for DocuBuilder", () => {
    renderHome();

    const logo = screen.getByAltText("DocuBuilder");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", expect.stringContaining("doc.png"));
  });

  test("renders one card for each builder", () => {
    renderHome();

    expect(screen.getAllByTestId("builder-card")).toHaveLength(4);
  });

  test("renders each builder's name, description, image, and launch text", () => {
    renderHome();

    expect(screen.getByText("Invoice Builder")).toBeInTheDocument();
    expect(screen.getByText("Create invoices")).toBeInTheDocument();
    expect(screen.getByAltText("Invoice Builder")).toBeInTheDocument();

    expect(screen.getByText("Quote Builder")).toBeInTheDocument();
    expect(screen.getByText("Create quotes")).toBeInTheDocument();
    expect(screen.getByAltText("Quote Builder")).toBeInTheDocument();

    expect(screen.getByText("Contract Builder")).toBeInTheDocument();
    expect(screen.getByText("Create contracts")).toBeInTheDocument();
    expect(screen.getByAltText("Contract Builder")).toBeInTheDocument();

    expect(screen.getByText("Credit Note Builder")).toBeInTheDocument();
    expect(screen.getByText("Create credit notes")).toBeInTheDocument();
    expect(screen.getByAltText("Credit Note Builder")).toBeInTheDocument();

    expect(screen.getAllByText("Launch tool")).toHaveLength(4);
  });

  test("renders builder images with the expected src values", () => {
    renderHome();

    const builderImages = [
      { name: "Invoice Builder", src: "/images/invoice.png" },
      { name: "Quote Builder", src: "/images/quote.png" },
      { name: "Contract Builder", src: "/images/contract.png" },
      { name: "Credit Note Builder", src: "/images/credit-note.png" },
    ];

    builderImages.forEach(({ name, src }) => {
      expect(screen.getByAltText(name)).toHaveAttribute("src", src);
    });
  });

  test("applies dark mode styles when the theme is set to dark", async () => {
    renderHome("dark");

    await waitFor(() => {
      expect(document.querySelector(".home-container")).toHaveClass("bg-indigo-950");
    });
  });

  test("renders Settings, Help, and About buttons", () => {
    renderHome();

    expect(screen.getByRole("button", { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /help/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /about/i })).toBeInTheDocument();
  });

  test("renders the footer instruction", () => {
    renderHome();

    expect(screen.getByText("Click any card to open the builder")).toBeInTheDocument();
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

  test("navigates when clicking Help", () => {
    renderHome();
    const helpButton = screen.getByText(/help/i);
    fireEvent.click(helpButton);
    expect(mockNavigate).toHaveBeenCalledWith("/settings?tab=help");
  });

  test("navigates when clicking About", () => {
    renderHome();
    const aboutButton = screen.getByText(/about/i);
    fireEvent.click(aboutButton);
    expect(mockNavigate).toHaveBeenCalledWith("/settings?tab=about");
  });
});