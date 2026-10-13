import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Intro from "./Intro";
afterEach(() => vi.useRealTimers());
it("runs a staged 0–100 introduction, then enables keyboard entry", () => {
  vi.useFakeTimers();
  const enter = vi.fn();
  render(<Intro onEnter={enter} />);
  const progress = screen.getByRole("progressbar");
  const open = screen.getByRole("button", {
    name: "OPEN",
  }) as HTMLButtonElement;
  expect(progress.getAttribute("aria-valuenow")).toBe("0");
  expect(open.disabled).toBe(true);
  act(() => vi.advanceTimersByTime(2500));
  expect(progress.getAttribute("aria-valuenow")).toBe("100");
  expect(open.disabled).toBe(false);
  expect(document.activeElement).toBe(open);
  fireEvent.click(open);
  expect(enter).toHaveBeenCalledOnce();
});
it("lets the visitor skip the sequence immediately", () => {
  const enter = vi.fn();
  render(<Intro onEnter={enter} />);
  fireEvent.click(screen.getByRole("button", { name: "SKIP INTRO →" }));
  expect(enter).toHaveBeenCalledOnce();
});
