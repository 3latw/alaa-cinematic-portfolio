import { describe, expect, it } from "vitest";
import { normalizedX, scrubTime, smoothPosition } from "./scrub";
describe("absolute portrait frame mapping", () => {
  it("maps mouse left, center and right to real video times", () => {
    expect(
      [0, 720, 1440].map((x) => scrubTime(normalizedX(x, 1440), 3.87)),
    ).toEqual([0, 1.915, 3.83]);
  });
  it("clamps pointer and slider input without accumulating deltas", () => {
    expect(normalizedX(-20, 390)).toBe(0);
    expect(normalizedX(500, 390)).toBe(1);
    expect(normalizedX(10, 0)).toBe(0.5);
    expect(scrubTime(1, Infinity)).toBe(0);
    expect(scrubTime(1, 0)).toBe(0);
  });
  it("converges smoothly in either direction and tolerates slow frames", () => {
    expect(smoothPosition(0, 1, 16)).toBeGreaterThan(0);
    expect(smoothPosition(1, 0, 16)).toBeLessThan(1);
    let value = 0;
    for (let i = 0; i < 60; i++) value = smoothPosition(value, 1, 16);
    expect(value).toBeCloseTo(1, 4);
    expect(smoothPosition(0, 1, 1000)).toBeLessThan(1);
  });
});
