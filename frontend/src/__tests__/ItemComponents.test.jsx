import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";

describe("ItemForm Component", () => {
  test("renders input and Add Item button", () => {
    render(<ItemForm onAdd={vi.fn()} />);

    expect(screen.getByPlaceholderText("Enter item")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Item" })).toBeInTheDocument();
  });

  test("ignores empty or whitespace-only submission", async () => {
    const handleAdd = vi.fn();
    render(<ItemForm onAdd={handleAdd} />);

    const submitBtn = screen.getByRole("button", { name: "Add Item" });
    await userEvent.click(submitBtn);

    const input = screen.getByPlaceholderText("Enter item");
    await userEvent.type(input, "     ");
    await userEvent.click(submitBtn);

    expect(handleAdd).not.toHaveBeenCalled();
  });

  test("submits trimmed name and resets input value", async () => {
    const handleAdd = vi.fn();
    render(<ItemForm onAdd={handleAdd} />);

    const input = screen.getByPlaceholderText("Enter item");
    const submitBtn = screen.getByRole("button", { name: "Add Item" });

    await userEvent.type(input, "   Sample Item   ");
    await userEvent.click(submitBtn);

    expect(handleAdd).toHaveBeenCalledWith({ name: "Sample Item" });
    expect(input).toHaveValue("");
  });
});

describe("ItemList Component", () => {
  test("renders list of items", () => {
    const items = [
      { id: 1, name: "Item Alpha" },
      { id: 2, name: "Item Beta" },
    ];

    render(<ItemList items={items} />);

    expect(screen.getByText("Item Alpha")).toBeInTheDocument();
    expect(screen.getByText("Item Beta")).toBeInTheDocument();
  });
});
