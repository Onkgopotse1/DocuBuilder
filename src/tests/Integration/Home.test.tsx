import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, describe, beforeEach, afterEach, vi } from "vitest";
import { useEffect } from "react";
import Home from "../../pages/Home";
import { builders } from "../../data/builders";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider, useTheme } from "../../context/Theme Context.tsx";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

describe("Rendering tests", () => {
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

    expect(screen.getAllByTestId("builder-card")).toHaveLength(builders.length);
  });

  test("renders each builder's name, description, image, and launch text", () => {
    renderHome();

    builders.forEach(({ name, desc }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByText(desc)).toBeInTheDocument();
      expect(screen.getByAltText(name)).toBeInTheDocument();
    });

    expect(screen.getAllByText("Launch tool")).toHaveLength(builders.length);
  });

  test("renders builder images with the expected src values", () => {
    renderHome();

    builders.forEach(({ name, image }) => {
      expect(screen.getByAltText(name)).toHaveAttribute("src", image);
    });
  });

  test("applies all dark mode style branches", async () => {
    renderHome("dark");

    await waitFor(() => {
      const homeContainer = document.querySelector(".home-container");
      const panel = homeContainer?.firstElementChild;
      const header = document.querySelector(".header-section");
      const card = screen.getAllByTestId("builder-card")[0];
      const cardHeading = card.querySelector("h3");
      const cardDescription = card.querySelector("div.flex-1");
      const launchText = card.querySelector("div.inline-flex");
      const buttons = document.querySelectorAll(".buttons-section button");
      const readinessBadge = document.querySelector(".header-section > div:last-child");

      expect(homeContainer).toHaveClass("bg-indigo-950");
      expect(panel).toHaveClass("bg-slate-900/95");
      expect(header).toHaveClass("bg-slate-800/80");
      expect(card).toHaveClass(
        "bg-slate-800",
        "border-slate-700",
        "shadow-slate-950/30",
        "hover:border-blue-400/40"
      );
      expect(cardHeading).toHaveClass("text-slate-100");
      expect(cardDescription).toHaveClass("text-slate-400");
      expect(launchText).toHaveClass("text-blue-400");
      expect(buttons).toHaveLength(3);
      buttons.forEach((button) => {
        expect(button).toHaveClass(
          "bg-slate-800",
          "text-slate-200",
          "hover:bg-slate-700",
          "hover:text-blue-300"
        );
      });
      expect(readinessBadge).toHaveClass("text-slate-200", "bg-slate-800");
    });
  });

  test("applies all light mode style branches", async () => {
    renderHome("light");

    await waitFor(() => {
      const homeContainer = document.querySelector(".home-container");
      const panel = homeContainer?.firstElementChild;
      const header = document.querySelector(".header-section");
      const card = screen.getAllByTestId("builder-card")[0];
      const cardHeading = card.querySelector("h3");
      const cardDescription = card.querySelector("div.flex-1");
      const launchText = card.querySelector("div.inline-flex");
      const buttons = document.querySelectorAll(".buttons-section button");
      const readinessBadge = document.querySelector(".header-section > div:last-child");

      expect(homeContainer).toHaveClass("bg-slate-100");
      expect(panel).toHaveClass("bg-white/90");
      expect(header).toHaveClass("bg-slate-50/90");
      expect(card).toHaveClass(
        "bg-white",
        "border-slate-300/50",
        "hover:border-blue-200"
      );
      expect(cardHeading).toHaveClass("text-slate-900");
      expect(cardDescription).toHaveClass("text-slate-600");
      expect(launchText).toHaveClass("text-blue-600");
      expect(buttons).toHaveLength(3);
      buttons.forEach((button) => {
        expect(button).toHaveClass("bg-slate-50", "text-slate-700", "hover:bg-white", "hover:text-blue-800");
      });
      expect(readinessBadge).toHaveClass("text-slate-600", "bg-blue-50");
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
});

describe("Interaction tests", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test.each(builders.map(({ name, path }) => [name, path]))(
    "opens the %s when its card is clicked",
    (builderName, expectedPath) => {
      renderHome();

      const builderCard = screen
        .getByText(builderName)
        .closest('[data-testid="builder-card"]');

      expect(builderCard).toBeInTheDocument();

      fireEvent.click(builderCard!);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
    }
  );

  test("opens the Invoice Builder when its card is activated with Enter", async () => {
    const user = userEvent.setup();
    renderHome();

    const invoiceCard = screen.getByRole("button", { name: /Invoice Builder/i });
    invoiceCard.focus();

    await user.keyboard("{Enter}");

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("invoice-builder");
  });

  test("opens the Invoice Builder when its card is activated with Space", async () => {
    const user = userEvent.setup();
    renderHome();

    const invoiceCard = screen.getByRole("button", { name: /Invoice Builder/i });
    invoiceCard.focus();

    await user.keyboard(" ");

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("invoice-builder");
  });

  test("navigates when clicking the Invoice Builder name", () => {
    renderHome();

    fireEvent.click(screen.getByText("Invoice Builder"));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("invoice-builder");
  });

  test("navigates when clicking the Invoice Builder description", () => {
    renderHome();

    fireEvent.click(screen.getByText("Create and download invoices as PDF."));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("invoice-builder");
  });

  test("navigates when clicking the Invoice Builder image", () => {
    renderHome();

    fireEvent.click(screen.getByAltText("Invoice Builder"));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("invoice-builder");
  });

  test("navigates when clicking the Launch tool text", () => {
    renderHome();

    fireEvent.click(screen.getAllByText("Launch tool")[0]);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("invoice-builder");
  });

  test("navigates when clicking Settings", () => {
    renderHome();
    const settingsButton = screen.getByText(/settings/i);
    fireEvent.click(settingsButton);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/settings");
  });

  test("navigates when clicking Help", () => {
    renderHome();
    const helpButton = screen.getByText(/help/i);
    fireEvent.click(helpButton);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/settings?tab=help");
  });

  test("navigates when clicking About", () => {
    renderHome();
    const aboutButton = screen.getByText(/about/i);
    fireEvent.click(aboutButton);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/settings?tab=about");
  });

  test.each([
    ["Settings", "/settings"],
    ["Help", "/settings?tab=help"],
    ["About", "/settings?tab=about"],
  ])("does not trigger builder navigation when clicking %s", (buttonName, expectedPath) => {
    renderHome();

    fireEvent.click(screen.getByRole("button", { name: buttonName }));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
    builders.forEach(({ path }) => {
      expect(mockNavigate).not.toHaveBeenCalledWith(path);
    });
  });

  test("does not navigate when clicking the header title", () => {
    renderHome();

    fireEvent.click(screen.getByText("DocuBuilder"));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("does not navigate when clicking the logo", () => {
    renderHome();

    fireEvent.click(screen.getByAltText("DocuBuilder"));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("does not navigate when clicking the footer instruction", () => {
    renderHome();

    fireEvent.click(screen.getByText("Click any card to open the builder"));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("does not navigate when clicking the device readiness text", () => {
    renderHome();

    fireEvent.click(screen.getByText("PC + mobile ready smart docs"));

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe("Data flow tests", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("updates all theme-derived data without changing builder data or navigation", async () => {
    const ThemeUpdateHarness = () => {
      const { setTheme } = useTheme();

      useEffect(() => {
        setTheme("light");
      }, []);

      return (
        <>
          <button type="button" data-testid="set-dark" onClick={() => setTheme("dark")}>
            Set dark
          </button>
          <button type="button" data-testid="set-light" onClick={() => setTheme("light")}>
            Set light
          </button>
          <Home />
        </>
      );
    };

    render(
      <ThemeProvider>
        <MemoryRouter>
          <ThemeUpdateHarness />
        </MemoryRouter>
      </ThemeProvider>
    );

    const getBuilderSnapshot = () =>
      screen.getAllByTestId("builder-card").map((card) => ({
        name: card.querySelector("h3")?.textContent,
        description: card.querySelector("div.flex-1")?.textContent,
        imageSrc: card.querySelector("img")?.getAttribute("src"),
        imageAlt: card.querySelector("img")?.getAttribute("alt"),
      }));

    await waitFor(() => {
      expect(document.querySelector(".home-container")).toHaveClass("bg-slate-100");
    });

    const lightSnapshot = getBuilderSnapshot();
    expect(lightSnapshot).toHaveLength(builders.length);

    fireEvent.click(screen.getByTestId("set-dark"));

    await waitFor(() => {
      const homeContainer = document.querySelector(".home-container");
      const panel = homeContainer?.firstElementChild;
      const header = document.querySelector(".header-section");
      const card = screen.getAllByTestId("builder-card")[0];
      const buttons = document.querySelectorAll(".buttons-section button");
      const readinessBadge = document.querySelector(".header-section > div:last-child");

      expect(homeContainer).toHaveClass("bg-indigo-950");
      expect(panel).toHaveClass("bg-slate-900/95");
      expect(header).toHaveClass("bg-slate-800/80");
      expect(card).toHaveClass(
        "bg-slate-800",
        "border-slate-700",
        "shadow-slate-950/30",
        "hover:border-blue-400/40"
      );
      expect(card.querySelector("h3")).toHaveClass("text-slate-100");
      expect(card.querySelector("div.flex-1")).toHaveClass("text-slate-400");
      expect(card.querySelector("div.inline-flex")).toHaveClass("text-blue-400");
      buttons.forEach((button) => {
        expect(button).toHaveClass(
          "bg-slate-800",
          "text-slate-200",
          "hover:bg-slate-700",
          "hover:text-blue-300"
        );
      });
      expect(readinessBadge).toHaveClass("text-slate-200", "bg-slate-800");
    });

    expect(getBuilderSnapshot()).toEqual(lightSnapshot);
    expect(mockNavigate).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("set-light"));

    await waitFor(() => {
      const homeContainer = document.querySelector(".home-container");
      const panel = homeContainer?.firstElementChild;
      const header = document.querySelector(".header-section");
      const card = screen.getAllByTestId("builder-card")[0];
      const buttons = document.querySelectorAll(".buttons-section button");
      const readinessBadge = document.querySelector(".header-section > div:last-child");

      expect(homeContainer).toHaveClass("bg-slate-100");
      expect(panel).toHaveClass("bg-white/90");
      expect(header).toHaveClass("bg-slate-50/90");
      expect(card).toHaveClass("bg-white", "border-slate-300/50", "hover:border-blue-200");
      expect(card.querySelector("h3")).toHaveClass("text-slate-900");
      expect(card.querySelector("div.flex-1")).toHaveClass("text-slate-600");
      expect(card.querySelector("div.inline-flex")).toHaveClass("text-blue-600");
      buttons.forEach((button) => {
        expect(button).toHaveClass("bg-slate-50", "text-slate-700", "hover:bg-white", "hover:text-blue-800");
      });
      expect(readinessBadge).toHaveClass("text-slate-600", "bg-blue-50");
    });

    expect(getBuilderSnapshot()).toEqual(lightSnapshot);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("maps every builder field to its card in source order", () => {
    renderHome();

    const cards = screen.getAllByTestId("builder-card");

    expect(cards).toHaveLength(builders.length);
    expect(new Set(builders.map(({ id }) => id)).size).toBe(builders.length);

    cards.forEach((card, index) => {
      const builder = builders[index];
      const heading = card.querySelector("h3");
      const description = card.querySelector("div.flex-1");
      const image = card.querySelector("img");

      expect(heading).toHaveTextContent(builder.name);
      expect(description).toHaveTextContent(builder.desc);
      expect(image).toHaveAttribute("src", builder.image);
      expect(image).toHaveAttribute("alt", builder.name);
    });
  });

  test("preserves the builder card data when rerendered", () => {
    const { rerender } = renderHome();
    const initialCards = screen.getAllByTestId("builder-card");

    rerender(
      <ThemeProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </ThemeProvider>
    );

    const rerenderedCards = screen.getAllByTestId("builder-card");

    expect(rerenderedCards).toHaveLength(builders.length);
    rerenderedCards.forEach((card, index) => {
      expect(card).toHaveAttribute("data-testid", initialCards[index].dataset.testid);
      expect(card.querySelector("h3")).toHaveTextContent(builders[index].name);
    });
  });

  test.each(builders.map(({ name, path }) => [name, path]))(
    "uses the %s builder path as its navigation target",
    (builderName, expectedPath) => {
      renderHome();

      fireEvent.click(screen.getByRole("button", { name: new RegExp(builderName as string, "i") }));

      expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
    }
  );

  test("renders correctly when the builder collection is empty", async () => {
    vi.resetModules();
    vi.doMock("../../data/builders", () => ({ builders: [] }));

    const [{ default: EmptyHome }, { ThemeProvider: EmptyThemeProvider }, { MemoryRouter: EmptyMemoryRouter }] =
      await Promise.all([
        import("../../pages/Home"),
        import("../../context/Theme Context.tsx"),
        import("react-router-dom"),
      ]);

    mockNavigate.mockClear();

    render(
      <EmptyThemeProvider>
        <EmptyMemoryRouter>
          <EmptyHome />
        </EmptyMemoryRouter>
      </EmptyThemeProvider>
    );

    expect(screen.queryAllByTestId("builder-card")).toHaveLength(0);
    expect(screen.getByText("DocuBuilder")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /help/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText("Click any card to open the builder")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  describe("Theme default flow", () => {
    beforeEach(() => {
      mockNavigate.mockClear();
      window.localStorage.removeItem("docubuilder-theme");
    });

    afterEach(() => {
      window.localStorage.removeItem("docubuilder-theme");
    });

    const renderHomeWithStoredTheme = () =>
      render(
        <ThemeProvider>
          <MemoryRouter>
            <Home />
          </MemoryRouter>
        </ThemeProvider>
      );

    test("uses light theme when no stored theme exists", async () => {
      renderHomeWithStoredTheme();

      await waitFor(() => {
        expect(document.querySelector(".home-container")).toHaveClass("bg-slate-100");
      });
    });

    test("uses dark theme when dark is stored", async () => {
      window.localStorage.setItem("docubuilder-theme", "dark");

      renderHomeWithStoredTheme();

      await waitFor(() => {
        expect(document.querySelector(".home-container")).toHaveClass("bg-indigo-950");
      });
    });

    test("falls back to light theme for an invalid stored value", async () => {
      window.localStorage.setItem("docubuilder-theme", "invalid");

      renderHomeWithStoredTheme();

      await waitFor(() => {
        expect(document.querySelector(".home-container")).toHaveClass("bg-slate-100");
      });
    });
  });

  describe("Context boundary", () => {
    test("throws when rendered without ThemeProvider", () => {
      expect(() =>
        render(
          <MemoryRouter>
            <Home />
          </MemoryRouter>
        )
      ).toThrow("useTheme must be used inside a ThemeProvider");
    });
  });
});