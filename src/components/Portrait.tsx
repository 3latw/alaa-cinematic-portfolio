import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "motion/react";
import { assetUrl } from "../data/content";
import frames from "../data/portraitFrames.json";
import atlas from "../data/portraitAtlas.json";
import { normalizedX, smoothPosition } from "../lib/scrub";
import { frameIndex, prepareAtlas } from "../lib/portraitAtlas";

const poster = assetUrl(atlas.poster);
const atlasUrl = assetUrl(atlas.source);

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
  const [position, setPosition] = useState(50);
  const [ready, setReady] = useState(false);
  const [missing, setMissing] = useState(!available);
  const [failed, setFailed] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const [motionFailed, setMotionFailed] = useState(false);
  const [frame, setFrame] = useState(frames.posterIndex);
  const [visible, setVisible] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!missing && image.current?.complete && image.current.naturalWidth > 0)
      setReady(true);
  }, [missing]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry?.isIntersecting ?? true),
    );
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!available) return;
    return prepareAtlas(
      atlasUrl,
      () => setMotionReady(true),
      () => setMotionFailed(true),
    );
  }, [available]);
  useEffect(() => {
    if (reduced || !motionReady || !visible) return;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (
        event.target instanceof Element &&
        event.target.closest(".portrait-bottom")
      )
        return;
      target.current = normalizedX(event.clientX, window.innerWidth);
      setPosition(Math.round(target.current * 100));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced, motionReady, visible]);
  useEffect(() => {
    if (!motionReady || !visible) return;
    let animation = 0;
    let previous = performance.now();
    let requested = frames.posterIndex;
    const tick = (now: number) => {
      if (!document.hidden && (!reduced || explicitControl.current)) {
        current.current = reduced
          ? target.current
          : smoothPosition(current.current, target.current, now - previous);
        const index = frameIndex(current.current, atlas.count);
        if (requested !== index) {
          setFrame(index);
          requested = index;
        }
      }
      previous = now;
      animation = requestAnimationFrame(tick);
    };
    animation = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animation);
  }, [motionReady, reduced, visible]);
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
      className={`portrait-stage hero-portrait ${missing && !motionReady ? "is-placeholder" : ""} ${ready || motionReady ? "portrait-ready" : ""}`}
      ref={stage}
      onPointerDown={(event) => {
        if (
          event.pointerType !== "touch" ||
          !motionReady ||
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
            className="portrait-video portrait-poster"
            src={poster}
            width={frames.width}
            height={frames.height}
            alt={
              motionReady
                ? ""
                : "Alaa Tawalbeh, standing in front of a blue studio background"
            }
            aria-hidden={motionReady || undefined}
            style={motionReady ? { visibility: "hidden" } : undefined}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setReady(true)}
            onError={() => {
              setMissing(true);
              setFailed(true);
            }}
          />
        )}
        {motionReady && (
          <div
            className="portrait-video portrait-frame portrait-sprite"
            role="img"
            aria-label="Alaa Tawalbeh, standing in front of a blue studio background"
            data-frame={String(frame).padStart(3, "0")}
          >
            <img
              className="portrait-atlas"
              src={atlasUrl}
              alt=""
              aria-hidden="true"
              draggable={false}
              style={{
                transform: `translate3d(-${((frame % atlas.columns) * 100) / atlas.columns}%, -${(Math.floor(frame / atlas.columns) * 100) / atlas.rows}%, 0)`,
              }}
            />
          </div>
        )}
        {!motionReady && (missing || !ready) && (
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
          disabled={!motionReady}
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
          {missing && !motionReady
            ? "PORTRAIT UNAVAILABLE"
            : !motionReady
              ? motionFailed
                ? "PORTRAIT VIEW"
                : "PREPARING MOTION"
              : reduced
                ? "USE THE SLIDER TO CHOOSE A FRAME"
                : "MOVE YOUR CURSOR · SWIPE OR USE THE SLIDER"}
        </p>
      </div>
    </div>
  );
}
