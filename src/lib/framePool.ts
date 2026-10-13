export function frameIndex(position: number, count: number) {
  return Math.round(
    Math.min(1, Math.max(0, position)) * Math.max(0, count - 1),
  );
}

// One active image request, latest requested frame wins, at most six decoded
// images retained. Never blank the displayed portrait while another frame loads.
export class PortraitFramePool {
  private cache = new Map<number, HTMLImageElement>();
  private failed = new Set<number>();
  private pending: HTMLImageElement | null = null;
  private target = -1;
  private disposed = false;

  constructor(
    private url: (index: number) => string,
    private onFrame: (url: string) => void,
    private createImage: () => HTMLImageElement = () => new Image(),
  ) {}

  setTarget(index: number) {
    this.target = index;
    this.pump();
  }

  private pump() {
    if (this.disposed || this.target < 0) return;
    const index = this.target;
    const cached = this.cache.get(index);
    if (cached) {
      this.cache.delete(index);
      this.cache.set(index, cached);
      this.onFrame(this.url(index));
      return;
    }
    if (this.pending || this.failed.has(index)) return;
    const image = this.createImage();
    this.pending = image;
    image.onload = () => {
      image.onload = image.onerror = null;
      if (this.disposed) return;
      this.pending = null;
      this.cache.set(index, image);
      while (this.cache.size > 6)
        this.cache.delete(this.cache.keys().next().value!);
      if (index === this.target) this.onFrame(this.url(index));
      else this.pump();
    };
    image.onerror = () => {
      image.onload = image.onerror = null;
      if (this.disposed) return;
      this.pending = null;
      this.failed.add(index);
      this.pump();
    };
    image.src = this.url(index);
  }

  dispose() {
    this.disposed = true;
    if (this.pending) this.pending.onload = this.pending.onerror = null;
    this.pending = null;
    this.cache.clear();
    this.failed.clear();
  }
}
