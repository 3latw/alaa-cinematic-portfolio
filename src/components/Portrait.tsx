import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "motion/react";
import { assetUrl } from "../data/content";
import frames from "../data/portraitFrames.json";
import { normalizedX, smoothPosition } from "../lib/scrub";
import { frameIndex, PortraitFramePool } from "../lib/framePool";

const frameUrl = (index: number) =>
  assetUrl(`${frames.directory}/frame-${String(index).padStart(3, "0")}.jpg`);
const poster = frameUrl(frames.posterIndex);

export default function Portrait({
  available = __PORTRAIT_AVAILABLE__,
}: {
  available?: boolean;
}) {
  const reduced = useReducedMotion();
  const target = useRef(0.5);
  const current = useRef(0.5);
  const explicitControl = useRef(false);
  const activeTouch = useRef<number | null>(null);
  const pool = useRef<PortraitFramePool | null>(null);
  const [position, setPosition] = useState(50);
  const [ready, setReady] = useState(false);
  const [missing, setMissing] = useState(!available);
  const [failed, setFailed] = useState(false);
  const [source, setSource] = useState(poster);
  const [visible, setVisible] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!missing && image.current?.complete && image.current.naturalWidth > 0)
      setReady(true);
  }, [source, missing]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry?.isIntersecting ?? true),
    );
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (missing) return;
    const loader = new PortraitFramePool(frameUrl, setSource);
    pool.current = loader;
    return () => {
      loader.dispose();
      pool.current = null;
    };
  }, [missing]);
  useEffect(() => {
    if (reduced || missing || !visible) return;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.current = normalizedX(event.clientX, window.innerWidth);
      setPosition(Math.round(target.current * 100));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced, missing, visible]);
  useEffect(() => {
    if (!ready || missing || !visible) return;
    let animation = 0;
    let previous = performance.now();
    let requested = -1;
    const tick = (now: number) => {
      if (!document.hidden && (!reduced || explicitControl.current)) {
        current.current = reduced
          ? target.current
          : smoothPosition(current.current, target.current, now - previous);
        const index = frameIndex(current.current, frames.count);
        if (requested !== index) {
          pool.current?.setTarget(index);
          requested = index;
        }
      }
      previous = now;
      animation = requestAnimationFrame(tick);
    };
    animation = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animation);
  }, [ready, missing, reduced, visible]);
  const update = (value: number) => {
    explicitControl.current = true;
    target.current = value / 100;
    setPosition(value);
  };
  const swipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    update(
      Math.round(normalizedX(event.clientX - bounds.left, bounds.width) * 100),
    );
  };
  return (
    <div
      className={`portrait-stage hero-portrait ${missing ? "is-placeholder" : ""} ${ready ? "portrait-ready" : ""}`}
      ref={stage}
      onPointerDown={(event) => {
        if (
          event.pointerType !== "touch" ||
          missing ||
          !ready ||
          event.target instanceof HTMLInputElement
        )
          return;
        activeTouch.current = event.pointerId;
        swipe(event);
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          /* Older browsers still have the range control. */
        }
      }}
      onPointerMove={(event) => {
        if (
          event.pointerType === "touch" &&
          activeTouch.current === event.pointerId
        )
          swipe(event);
      }}
      onPointerUp={() => {
        activeTouch.current = null;
      }}
      onPointerCancel={() => {
        activeTouch.current = null;
      }}
    >
      <div className="portrait-film">
        {!missing && (
          <img
            ref={image}
            className="portrait-video portrait-frame"
            src={source}
            width={frames.width}
            height={frames.height}
            alt="Alaa Tawalbeh, standing in front of a blue studio background"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setReady(true)}
            onError={() => {
              if (source !== poster) setSource(poster);
              else {
                setMissing(true);
                setFailed(true);
              }
            }}
          />
        )}
        {(missing || !ready) && (
          <div className="portrait-placeholder">
            <div className="portrait-reticle" aria-hidden="true">
              <span>AT</span>
              <i />
              <i />
            </div>
            <p className="mono">
              {missing ? "A FACE TO THE NAME." : "PREPARING PORTRAIT."}
            </p>
            <span>
              {failed
                ? "Portrait temporarily unavailable"
                : missing
                  ? "Portrait film coming soon"
                  : "A moment for the first frame"}
            </span>
          </div>
        )}
      </div>
      <div className="portrait-bottom">
        <div className="mono">
          <span>LEFT</span>
          <span>FRONT</span>
          <span>RIGHT</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          disabled={missing || !ready}
          aria-label="Portrait head direction"
          aria-valuetext={
            position < 35
              ? "Looking left"
              : position > 65
                ? "Looking right"
                : "Looking forward"
          }
          onChange={(event) => update(Number(event.target.value))}
        />
        <p className="mono">
          {missing
            ? "PORTRAIT UNAVAILABLE"
            : reduced
              ? "USE THE SLIDER TO CHOOSE A FRAME"
              : "MOVE YOUR CURSOR · SWIPE OR USE THE SLIDER"}
        </p>
      </div>
    </div>
  );
}
