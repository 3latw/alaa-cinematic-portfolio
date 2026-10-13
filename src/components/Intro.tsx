import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Name from "./Name";

export default function Intro({ onEnter }: { onEnter: () => void }) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(reduced ? 100 : 0);
  const open = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (reduced) {
      setProgress(100);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const percent = Math.min(100, ((now - start) / 2300) * 100);
      setProgress(percent);
      if (percent < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);
  useEffect(() => {
    if (progress === 100) open.current?.focus();
  }, [progress]);
  const stage =
    progress < 35
      ? "SETTING THE SCENE"
      : progress < 75
        ? "INTRODUCING ALAA"
        : progress < 100
          ? "ONE MOMENT"
          : "READY_";
  return (
    <motion.section
      className="intro"
      aria-label="Opening experience"
      exit={reduced ? { opacity: 0 } : { y: "-100%", opacity: 0.25 }}
      transition={{ duration: reduced ? 0 : 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="intro-top mono">
        <span>
          <i className="record-dot" /> REC — REEL 2026
        </span>
        <span aria-hidden="true">
          00:00:0{Math.min(2, Math.floor(progress / 43))}:00
        </span>
      </div>
      <div className="frame-corners" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="intro-center">
        <h1>
          <Name />
        </h1>
        <p className="intro-subtitle mono">THE MIND BEHIND THE CODE</p>
        <div
          className="intro-progress"
          role="progressbar"
          aria-label="Introduction sequence"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.floor(progress)}
        >
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <div className="intro-status mono">
          <span aria-live="polite">
            {progress === 100 ? "READY_" : "INTRO SEQUENCE"}
          </span>
          <span aria-hidden="true">
            {Math.floor(progress).toString().padStart(2, "0")}%
          </span>
        </div>
        <p className="sr-only">
          This progress represents a staged introduction, not asset download
          completion. {stage}
        </p>
        <button
          ref={open}
          className="open-button mono"
          disabled={progress < 100}
          onClick={onEnter}
        >
          OPEN <span aria-hidden="true">↗</span>
        </button>
        <button className="skip-intro mono" onClick={onEnter}>
          SKIP INTRO →
        </button>
      </div>
      <div className="intro-bottom mono">
        <span>© 2026 ALAA TAWALBEH — IRBID, JORDAN</span>
        <span>BUILT TO BE EXPLORED</span>
      </div>
    </motion.section>
  );
}
