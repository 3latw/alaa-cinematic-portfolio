import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { identity } from "../data/content";
import { useModal } from "../lib/useModal";

export default function Navigation({
  onClose,
  onCv,
}: {
  onClose: () => void;
  onCv: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  useModal(dialog);
  return (
    <dialog
      className="navigation-overlay"
      ref={dialog}
      aria-label="Main navigation"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        className="navigation-panel"
        initial={reduced ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="nav-top">
          <span className="mono">AT / INDEX</span>
          <button onClick={onClose} className="menu-button">
            CLOSE <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Sections">
          {["Home", "Work", "About", "Experience", "Skills", "Contact"].map(
            (name, index) => (
              <motion.a
                key={name}
                href={`#${name.toLowerCase()}`}
                onClick={onClose}
                initial={reduced ? false : { y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: reduced ? 0 : index * 0.045 }}
              >
                <span className="mono nav-number">0{index + 1}</span>
                {name}
                <span className="nav-arrow" aria-hidden="true">
                  ↗
                </span>
              </motion.a>
            ),
          )}
          <button
            className="nav-cv"
            onClick={() => {
              onClose();
              onCv();
            }}
          >
            <span className="mono nav-number">07</span>CV{" "}
            <span className="nav-arrow" aria-hidden="true">
              ↓
            </span>
          </button>
        </nav>
        <div className="nav-bottom mono">
          <a href={`mailto:${identity.email}`}>{identity.email}</a>
          <span>IRBID, JORDAN</span>
        </div>
      </motion.div>
    </dialog>
  );
}
