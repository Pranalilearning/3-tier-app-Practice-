import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemTable from "../components/items/ItemTable";

describe("ItemTable Component", () => {
  const mockItems = [
    { id: 1, name: "Production Gateway" },
    { id: 2, name: "Redis Cache Cluster" },
    { id: 3, name: "PostgreSQL Database" },
  ];

  test("renders loading state when loading is true", () => {
    render(
      <ItemTable
        items={[]}
        loading={true}
        error=""
        onOpenCreate={vi.fn()}
        onRefresh={vi.fn()}
        refreshing={false}
      />
    );

    expect(screen.getByText("Loading items from PostgreSQL...")).toBeInTheDocument();
    expect(screen.getByText(/Querying cloudapp.items table/i)).toBeInTheDocument();
  });

  test("renders error state with retry button when error is present", async () => {
    const handleRefresh = vi.fn();
    render(
      <ItemTable
        items={[]}
        loading={false}
        error="Failed to fetch items from database."
        onOpenCreate={vi.fn()}
        onRefresh={handleRefresh}
        refreshing={false}
      />
    );

    expect(screen.getByText("Failed to fetch items from database.")).toBeInTheDocument();
    const retryBtn = screen.getByRole("button", { name: /retry query/i });
    expect(retryBtn).toBeInTheDocument();

    await userEvent.click(retryBtn);
    expect(handleRefresh).toHaveBeenCalledTimes(1);
  });

  test("renders empty state when no items exist", async () => {
    const handleOpenCreate = vi.fn();
    render(
      <ItemTable
        items={[]}
        loading={false}
        error=""
        onOpenCreate={handleOpenCreate}
        onRefresh={vi.fn()}
        refreshing={false}
      />
    );

    expect(screen.getByText("No items in database")).toBeInTheDocument();
    expect(screen.getByText("Create your first database item to get started.")).toBeInTheDocument();

    // Click the create button in empty state
    const createBtns = screen.getAllByRole("button", { name: /create item/i });
    await userEvent.click(createBtns[1] || createBtns[0]);
    expect(handleOpenCreate).toHaveBeenCalled();
  });

  test("renders items table with records, id badges, and metadata", () => {
    render(
      <ItemTable
        items={mockItems}
        loading={false}
        error=""
        onOpenCreate={vi.fn()}
        onRefresh={vi.fn()}
        refreshing={false}
      />
    );

    expect(screen.getByText("Production Gateway")).toBeInTheDocument();
    expect(screen.getByText("Redis Cache Cluster")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL Database")).toBeInTheDocument();
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("#2")).toBeInTheDocument();
    expect(screen.getByText("#3")).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element?.tagName === "SPAN" && element?.textContent?.includes("Showing 3 of 3 items"))
    ).toBeInTheDocument();
    expect(screen.getByText("Table: cloudapp.public.items")).toBeInTheDocument();
  });

  test("filters item rows using the search input", async () => {
    render(
      <ItemTable
        items={mockItems}
        loading={false}
        error=""
        onOpenCreate={vi.fn()}
        onRefresh={vi.fn()}
        refreshing={false}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search records by id or name/i);
    await userEvent.type(searchInput, "Redis");

    expect(screen.getByText("Redis Cache Cluster")).toBeInTheDocument();
    expect(screen.queryByText("Production Gateway")).not.toBeInTheDocument();
    expect(screen.queryByText("PostgreSQL Database")).not.toBeInTheDocument();

    // Clear search using backspaces
    await userEvent.clear(searchInput);
    expect(screen.getByText("Production Gateway")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL Database")).toBeInTheDocument();
  });

  test("displays no matches state and clears search on button click", async () => {
    render(
      <ItemTable
        items={mockItems}
        loading={false}
        error=""
        onOpenCreate={vi.fn()}
        onRefresh={vi.fn()}
        refreshing={false}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search records by id or name/i);
    await userEvent.type(searchInput, "NonExistentItemName");

    expect(screen.getByText("No matching items found")).toBeInTheDocument();
    const clearBtn = screen.getByRole("button", { name: /clear search/i });
    expect(clearBtn).toBeInTheDocument();

    await userEvent.click(clearBtn);
    expect(screen.getByText("Production Gateway")).toBeInTheDocument();
  });

  test("triggers onRefresh callback when refresh toolbar button is clicked", async () => {
    const handleRefresh = vi.fn();
    render(
      <ItemTable
        items={mockItems}
        loading={false}
        error=""
        onOpenCreate={vi.fn()}
        onRefresh={handleRefresh}
        refreshing={false}
      />
    );

    const refreshBtn = screen.getByTitle("Refresh database records");
    await userEvent.click(refreshBtn);
    expect(handleRefresh).toHaveBeenCalledTimes(1);
  });
});
