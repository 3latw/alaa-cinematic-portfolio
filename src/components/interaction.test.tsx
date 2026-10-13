import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MotionConfig } from "motion/react";
import Navigation from "./Navigation";
import Portrait from "./Portrait";
import CvDialog from "./CvDialog";

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
describe("keyboard and missing media behavior", () => {
  it("traps focus in both directions and restores the opener", async () => {
    const opener = document.createElement("button");
    document.body.append(opener);
    opener.focus();
    const close = vi.fn();
    const { unmount } = render(
      <MotionConfig reducedMotion="always">
        <Navigation onClose={close} onCv={vi.fn()} />
      </MotionConfig>,
    );
    const first = screen.getByRole("button", { name: "CLOSE" });
    const last = screen.getByRole("link", { name: "3latawalbeh@gmail.com" });
    expect(document.activeElement).toBe(first);
    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(last);
    await userEvent.tab();
    expect(document.activeElement).toBe(first);
    fireEvent(
      screen.getByRole("dialog"),
      new Event("cancel", { bubbles: true }),
    );
    expect(close).toHaveBeenCalledOnce();
    unmount();
    expect(document.activeElement).toBe(opener);
    expect(document.body.style.overflow).toBe("");
    opener.remove();
  });
  it("shows a truthful portrait fallback and disables unavailable controls", () => {
    const { container } = render(<Portrait available={false} />);
    expect(screen.getByText("Portrait film coming soon")).toBeTruthy();
    expect((screen.getByRole("slider") as HTMLInputElement).disabled).toBe(
      true,
    );
    expect(container.querySelector("video")).toBeNull();
  });
  it("does not send visitors to a missing CV", () => {
    render(<CvDialog onClose={vi.fn()} />);
    expect(
      screen.getByRole("heading", { name: "CV coming soon." }),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Request CV" }).getAttribute("href"),
    ).toContain("mailto:3latawalbeh@gmail.com");
  });
});
describe("portrait integration without video decoding", () => {
  it("shows a frontal poster even when video playback would be blocked", () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockRejectedValue(new Error("NotAllowedError"));
    const { container } = render(<Portrait available />);
    expect(screen.getByRole("img").getAttribute("src")).toContain(
      "frame-024.jpg",
    );
    expect(container.querySelector("video")).toBeNull();
    expect(play).not.toHaveBeenCalled();
  });
  it("loads real frame URLs for absolute pointer X, slider and zero-button touch input", () => {
    let callback: FrameRequestCallback = () => {};
    vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => {
      callback = fn;
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal(
      "Image",
      class {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        private value = "";
        set src(value: string) {
          this.value = value;
          this.onload?.();
        }
        get src() {
          return this.value;
        }
      },
    );
    const { container } = render(<Portrait available />);
    const image = screen.getByRole("img");
    fireEvent.load(image);
    const pointer = (x: number) => {
      const event = new Event("pointermove");
      Object.assign(event, { pointerType: "mouse", clientX: x });
      fireEvent(window, event);
    };
    let clock = performance.now();
    const settle = () => {
      for (let i = 0; i < 60; i++) {
        clock += 16;
        act(() => callback(clock));
      }
    };
    pointer(0);
    settle();
    expect(image.getAttribute("src")).toContain("frame-000.jpg");
    pointer(window.innerWidth / 2);
    settle();
    expect(image.getAttribute("src")).toContain("frame-024.jpg");
    pointer(window.innerWidth);
    settle();
    expect(image.getAttribute("src")).toContain("frame-048.jpg");
    fireEvent.change(screen.getByRole("slider"), { target: { value: "0" } });
    settle();
    expect(image.getAttribute("src")).toContain("frame-000.jpg");
    const stage = container.querySelector(".portrait-stage")!;
    vi.spyOn(stage, "getBoundingClientRect").mockReturnValue({
      left: 0,
      width: 400,
    } as DOMRect);
    const touch = (type: string, x: number) => {
      const event = new Event(type, { bubbles: true });
      Object.assign(event, {
        pointerType: "touch",
        pointerId: 7,
        buttons: 0,
        clientX: x,
      });
      fireEvent(stage, event);
    };
    touch("pointerdown", 0);
    touch("pointermove", 400);
    settle();
    expect(image.getAttribute("src")).toContain("frame-048.jpg");
    touch("pointerup", 400);
    touch("pointermove", 0);
    settle();
    expect(image.getAttribute("src")).toContain("frame-048.jpg");
  });
  it("shows a clear fallback when the poster itself cannot load", () => {
    render(<Portrait available />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByText("Portrait temporarily unavailable")).toBeTruthy();
    expect((screen.getByRole("slider") as HTMLInputElement).disabled).toBe(
      true,
    );
  });
});
