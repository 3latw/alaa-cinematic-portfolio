import { describe, expect, it, vi } from "vitest";
import { frameIndex, PortraitFramePool } from "./framePool";

function fixture() {
  const images: HTMLImageElement[] = [];
  const show = vi.fn();
  const pool = new PortraitFramePool(
    (index) => `frame-${index}.jpg`,
    show,
    () => {
      const image = {
        src: "",
        onload: null,
        onerror: null,
      } as unknown as HTMLImageElement;
      images.push(image);
      return image;
    },
  );
  const loaded = (image: HTMLImageElement) =>
    image.onload?.call(image, new Event("load"));
  return { pool, images, show, loaded };
}
describe("decoder-independent portrait frames", () => {
  it("maps absolute left, center and right to real extracted frames", () => {
    expect([0, 0.5, 1].map((x) => frameIndex(x, 49))).toEqual([0, 24, 48]);
    expect(frameIndex(-1, 49)).toBe(0);
    expect(frameIndex(2, 49)).toBe(48);
  });
  it("loads only one request at a time and displays the latest target", () => {
    const { pool, images, show, loaded } = fixture();
    pool.setTarget(0);
    pool.setTarget(12);
    pool.setTarget(48);
    expect(images).toHaveLength(1);
    loaded(images[0]);
    expect(show).not.toHaveBeenCalled();
    expect(images).toHaveLength(2);
    expect(images[1].src).toBe("frame-48.jpg");
    loaded(images[1]);
    expect(show).toHaveBeenCalledExactlyOnceWith("frame-48.jpg");
  });
  it("retains six decoded images and reloads an evicted frame", () => {
    const { pool, images, loaded } = fixture();
    for (let index = 0; index < 9; index++) {
      pool.setTarget(index);
      loaded(images.at(-1)!);
    }
    const count = images.length;
    pool.setTarget(8);
    expect(images).toHaveLength(count);
    pool.setTarget(0);
    expect(images).toHaveLength(count + 1);
  });
  it("keeps the previous image on a failed load and cancels callbacks on disposal", () => {
    const { pool, images, loaded, show } = fixture();
    pool.setTarget(24);
    loaded(images[0]);
    pool.setTarget(48);
    images[1].onerror?.call(images[1], new Event("error"));
    expect(show).toHaveBeenCalledExactlyOnceWith("frame-24.jpg");
    pool.setTarget(0);
    pool.dispose();
    expect(images[2].onload).toBeNull();
    expect(images[2].onerror).toBeNull();
    pool.setTarget(10);
    expect(images).toHaveLength(3);
  });
});
