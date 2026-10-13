import { fireEvent, render, screen } from "@testing-library/react";
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
describe("portrait media integration with simulated decoder", () => {
  it("seeks actual currentTime for absolute pointer X and keyboard slider input, and handles media failure", () => {
    let callback: FrameRequestCallback = () => {};
    vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => {
      callback = fn;
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    const { container } = render(<Portrait available />);
    const video = container.querySelector("video")!;
    Object.defineProperty(video, "duration", { value: 3.87 });
    fireEvent.loadedData(video);
    expect(video.currentTime).toBeCloseTo(1.915);
    const pointer = (x: number) => {
      const event = new Event("pointermove");
      Object.assign(event, { pointerType: "mouse", clientX: x });
      fireEvent(window, event);
    };
    let clock = performance.now();
    const settle = () => {
      for (let i = 0; i < 60; i++) {
        clock += 16;
        callback(clock);
      }
    };
    pointer(0);
    settle();
    expect(video.currentTime).toBeLessThan(0.04);
    pointer(window.innerWidth / 2);
    settle();
    expect(video.currentTime).toBeCloseTo(1.915, 1);
    pointer(window.innerWidth);
    settle();
    expect(video.currentTime).toBeGreaterThan(3.79);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "0" } });
    settle();
    expect(video.currentTime).toBeLessThan(0.04);
    const stage = container.querySelector(".portrait-stage")!;
    vi.spyOn(stage, "getBoundingClientRect").mockReturnValue({
      left: 0, width: 400,
    } as DOMRect);
    const swipe = new Event("pointermove", { bubbles: true });
    Object.assign(swipe, { pointerType: "touch", buttons: 1, clientX: 400 });
    fireEvent(stage, swipe);
    settle();
    expect(video.currentTime).toBeGreaterThan(3.79);
    fireEvent.error(video);
    expect(screen.getByText("Portrait film coming soon")).toBeTruthy();
  });
});
