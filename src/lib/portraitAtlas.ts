export function frameIndex(position: number, count: number) {
  return Math.round(
    Math.min(1, Math.max(0, position)) * Math.max(0, count - 1),
  );
}

// Load and decode one shared bitmap before enabling movement. Moving the
// portrait afterwards only translates that bitmap; it never changes its URL.
export function prepareAtlas(
  url: string,
  onReady: () => void,
  onFailure: () => void,
  createImage: () => HTMLImageElement = () => new Image(),
) {
  const image = createImage();
  let cancelled = false;
  let started = false;
  const fail = () => {
    if (!cancelled) onFailure();
  };
  const loaded = () => {
    if (cancelled || started) return;
    started = true;
    try {
      const decoded =
        typeof image.decode === "function" ? image.decode() : Promise.resolve();
      decoded.then(() => {
        if (!cancelled) onReady();
      }, fail);
    } catch {
      fail();
    }
  };
  image.onload = loaded;
  image.onerror = fail;
  image.src = url;
  if (image.complete && image.naturalWidth > 0) loaded();
  return () => {
    cancelled = true;
    image.onload = image.onerror = null;
  };
}
