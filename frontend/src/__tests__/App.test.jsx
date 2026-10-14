import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import api from "../services/api";

// Mock the axios API module
vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("App End-to-End Component Workflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("fetches and renders items and operational health on load", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/health") {
        return Promise.resolve({
          data: { status: "OK", uptime: 450, timestamp: "2026-10-15T00:00:00.000Z" },
        });
      }
      if (url === "/api/items/getitems") {
        return Promise.resolve({
          data: {
            success: true,
            count: 2,
            data: [
              { id: 1, name: "Amazon ECS Cluster" },
              { id: 2, name: "RDS PostgreSQL Database" },
            ],
          },
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    render(
      <MemoryRouter initialEntries={["/items"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Amazon ECS Cluster")).toBeInTheDocument();
      expect(screen.getByText("RDS PostgreSQL Database")).toBeInTheDocument();
    });

    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("#2")).toBeInTheDocument();
  });

  test("handles API failure state gracefully and displays error message", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/health") {
        return Promise.resolve({ data: { status: "OK" } });
      }
      if (url === "/api/items/getitems") {
        return Promise.reject(new Error("Network Error"));
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    render(
      <MemoryRouter initialEntries={["/items"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch items from database.")).toBeInTheDocument();
    });
  });

  test("creates a new item and updates list and activity telemetry", async () => {
    const initialItems = [{ id: 1, name: "Existing Item" }];

    api.get.mockImplementation((url) => {
      if (url === "/health") {
        return Promise.resolve({ data: { status: "OK" } });
      }
      if (url === "/api/items/getitems") {
        return Promise.resolve({
          data: { success: true, count: 1, data: initialItems },
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    api.post.mockResolvedValueOnce({
      data: {
        success: true,
        data: { id: 99, name: "New Lambda Function" },
      },
    });

    render(
      <MemoryRouter initialEntries={["/items"]}>
        <App />
      </MemoryRouter>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("Existing Item")).toBeInTheDocument();
    });

    // Open modal via create item button
    const createBtn = screen.getByRole("button", { name: /create item/i });
    await userEvent.click(createBtn);

    // Modal should be open
    expect(screen.getByRole("heading", { name: "Create New Item" })).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/e\.g\. Production Cluster Config/i);
    await userEvent.type(input, "New Lambda Function");

    const modal = screen.getByRole("dialog");
    const modalSubmitBtn = within(modal).getByRole("button", { name: /create item/i });
    await userEvent.click(modalSubmitBtn);

    // Verify API call was made with trimmed item payload
    expect(api.post).toHaveBeenCalledWith("/api/items/createitems", {
      name: "New Lambda Function",
    });

    // Verify success banner appears
    await waitFor(() => {
      expect(
        screen.getByText(/created successfully in PostgreSQL/i)
      ).toBeInTheDocument();
    });

    // Verify new item appears in the list
    expect(screen.getByText("New Lambda Function")).toBeInTheDocument();
  });

  test("handles item creation failure with user-visible alert banner", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/health") {
        return Promise.resolve({ data: { status: "OK" } });
      }
      if (url === "/api/items/getitems") {
        return Promise.resolve({
          data: { success: true, count: 0, data: [] },
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    api.post.mockRejectedValueOnce({
      response: {
        data: {
          error: "Database constraint violated: duplicate item",
        },
      },
    });

    render(
      <MemoryRouter initialEntries={["/items"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No items in database")).toBeInTheDocument();
    });

    const createBtn = screen.getAllByRole("button", { name: /create item/i })[0];
    await userEvent.click(createBtn);

    const input = screen.getByPlaceholderText(/e\.g\. Production Cluster Config/i);
    await userEvent.type(input, "Duplicate Item");

    const modal = screen.getByRole("dialog");
    const modalSubmitBtn = within(modal).getByRole("button", { name: /create item/i });
    await userEvent.click(modalSubmitBtn);

    // Verify user-visible error banner
    await waitFor(() => {
      expect(
        screen.getByText("Database constraint violated: duplicate item")
      ).toBeInTheDocument();
    });
  });
});
