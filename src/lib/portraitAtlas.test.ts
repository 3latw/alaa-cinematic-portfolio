import { describe, expect, it, vi } from "vitest";
import { frameIndex, prepareAtlas } from "./portraitAtlas";

function fixture(cached = false) {
  let finish!: () => void;
  const decode = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  const image = {
    src: "",
    onload: null,
    onerror: null,
    complete: cached,
    naturalWidth: cached ? 2240 : 0,
    decode,
  } as unknown as HTMLImageElement;
  const ready = vi.fn();
  const fail = vi.fn();
  const dispose = prepareAtlas("atlas.jpg", ready, fail, () => image);
  const load = () => image.onload?.call(image, new Event("load"));
  return { image, decode, ready, fail, dispose, load, finish: () => finish() };
}
describe("predecoded portrait atlas", () => {
  it("maps absolute left, center and right to actual video frames", () => {
    expect([0, 0.5, 1].map((x) => frameIndex(x, 49))).toEqual([0, 24, 48]);
    expect(frameIndex(-1, 49)).toBe(0);
    expect(frameIndex(2, 49)).toBe(48);
  });
  it("enables motion only after the entire bitmap finishes decoding", async () => {
    const f = fixture();
    expect(f.image.src).toBe("atlas.jpg");
    f.load();
    expect(f.ready).not.toHaveBeenCalled();
    f.finish();
    await Promise.resolve();
    expect(f.ready).toHaveBeenCalledOnce();
  });
  it("decodes a cached image once and ignores callbacks after disposal", async () => {
    const f = fixture(true);
    f.load();
    expect(f.decode).toHaveBeenCalledOnce();
    f.dispose();
    f.finish();
    await Promise.resolve();
    expect(f.ready).not.toHaveBeenCalled();
    expect(f.image.onload).toBeNull();
    expect(f.image.onerror).toBeNull();
  });
  it("reports load and decode failures without enabling motion", async () => {
    const f = fixture();
    f.image.onerror?.call(f.image, new Event("error"));
    expect(f.fail).toHaveBeenCalledOnce();
    const ready = vi.fn();
    const fail = vi.fn();
    const broken = {
      onload: null,
      onerror: null,
      decode: () => Promise.reject(new Error("decode")),
    } as unknown as HTMLImageElement;
    prepareAtlas("broken.jpg", ready, fail, () => broken);
    broken.onload?.call(broken, new Event("load"));
    await Promise.resolve();
    expect(fail).toHaveBeenCalledOnce();
    expect(ready).not.toHaveBeenCalled();
  });
});
