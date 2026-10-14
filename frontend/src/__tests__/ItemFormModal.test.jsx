import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemFormModal from "../components/items/ItemFormModal";

describe("ItemFormModal Component", () => {
  test("renders nothing when isOpen is false", () => {
    const { container } = render(
      <ItemFormModal
        isOpen={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        submitting={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test("renders form elements and title when isOpen is true", () => {
    render(
      <ItemFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        submitting={false}
      />
    );

    expect(screen.getByRole("heading", { name: "Create New Item" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Production Cluster Config/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create item/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("validates minimum length requirement (at least 2 characters)", async () => {
    const handleSubmit = vi.fn();
    render(
      <ItemFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={handleSubmit}
        submitting={false}
      />
    );

    const input = screen.getByPlaceholderText(/e\.g\. Production Cluster Config/i);
    await userEvent.type(input, "A");

    const submitBtn = screen.getByRole("button", { name: /create item/i });
    await userEvent.click(submitBtn);

    expect(screen.getByText("Item name must be at least 2 characters.")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test("trims leading and trailing whitespace on valid submission", async () => {
    const handleSubmit = vi.fn();
    render(
      <ItemFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={handleSubmit}
        submitting={false}
      />
    );

    const input = screen.getByPlaceholderText(/e\.g\. Production Cluster Config/i);
    await userEvent.type(input, "   Clean Item Name   ");

    const submitBtn = screen.getByRole("button", { name: /create item/i });
    await userEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith({ name: "Clean Item Name" });
  });

  test("handles close via cancel button, close icon, and Escape key", async () => {
    const handleClose = vi.fn();
    const { unmount } = render(
      <ItemFormModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={vi.fn()}
        submitting={false}
      />
    );

    // Cancel button
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Close icon button
    const closeIconBtn = screen.getByLabelText("Close modal");
    await userEvent.click(closeIconBtn);
    expect(handleClose).toHaveBeenCalledTimes(2);

    // Escape key
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(3);

    unmount();
  });

  test("disables inputs and shows spinner when submitting is true", () => {
    render(
      <ItemFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        submitting={true}
      />
    );

    expect(screen.getByText("Creating...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Production Cluster Config/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });
});
