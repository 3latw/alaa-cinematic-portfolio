import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { assetUrl, identity } from "../data/content";
import { normalizedX, scrubTime, smoothPosition } from "../lib/scrub";

export default function Portrait({
  available = __PORTRAIT_AVAILABLE__,
}: {
  available?: boolean;
}) {
  const reduced = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const target = useRef(0.5);
  const current = useRef(0.5);
  const explicitControl = useRef(false);
  const [position, setPosition] = useState(50);
  const [ready, setReady] = useState(false);
  const [missing, setMissing] = useState(!available);
  const [visible, setVisible] = useState(true);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
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
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const element = video.current;
      if (
        element &&
        !document.hidden &&
        (!reduced || explicitControl.current)
      ) {
        current.current = reduced
          ? target.current
          : smoothPosition(current.current, target.current, now - previous);
        const time = scrubTime(current.current, element.duration);
        // Serialize seeks to avoid decoder churn; never play or rotate the video.
        if (!element.seeking && Math.abs(element.currentTime - time) > 0.025)
          element.currentTime = time;
      }
      previous = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ready, missing, reduced, visible]);
  const update = (value: number) => {
    explicitControl.current = true;
    target.current = value / 100;
    setPosition(value);
  };
  return (
    <div
      className={`portrait-stage ${missing ? "is-placeholder" : ""}`}
      ref={stage}
      onPointerMove={(event) => {
        if (event.pointerType === "touch" && event.buttons > 0 && !missing) {
          const bounds = event.currentTarget.getBoundingClientRect();
          update(
            Math.round(
              normalizedX(event.clientX - bounds.left, bounds.width) * 100,
            ),
          );
        }
      }}
    >
      <div className="portrait-top mono">
        <span>PORTRAIT / 001</span>
        <span>
          {missing
            ? "AWAITING FOOTAGE"
            : ready
              ? "INTERACTIVE"
              : "PREPARING FRAME"}
        </span>
      </div>
      {!missing && (
        <video
          ref={video}
          className="portrait-video"
          src={assetUrl(identity.portrait)}
          preload="auto"
          muted
          playsInline
          aria-label="Portrait of Alaa turning from left to right"
          onLoadedData={(event) => {
            event.currentTarget.pause();
            event.currentTarget.currentTime = scrubTime(
              0.5,
              event.currentTarget.duration,
            );
            setReady(true);
          }}
          onError={() => setMissing(true)}
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
            {missing
              ? "Portrait film coming soon"
              : "A moment for the first frame"}
          </span>
        </div>
      )}
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
            ? "OWNER FOOTAGE WILL BRING THIS FRAME TO LIFE"
            : reduced
              ? "USE THE SLIDER TO CHOOSE A FRAME"
              : "MOVE YOUR CURSOR · SWIPE OR USE THE SLIDER"}
        </p>
      </div>
    </div>
  );
}
