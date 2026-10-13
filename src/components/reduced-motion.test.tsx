import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => true,
}));
import Intro from "./Intro";
it("makes the reduced-motion introduction ready immediately", () => {
  render(<Intro onEnter={() => {}} />);
  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
    "100",
  );
  expect(
    (screen.getByRole("button", { name: "OPEN" }) as HTMLButtonElement)
      .disabled,
  ).toBe(false);
});
