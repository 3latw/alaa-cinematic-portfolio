import { useRef } from "react";
import { identity } from "../data/content";
import { useModal } from "../lib/useModal";
export default function CvDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useModal(ref);
  return (
    <dialog
      ref={ref}
      className="cv-dialog"
      aria-labelledby="cv-heading"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div>
        <p className="eyebrow">THE NEXT CHAPTER</p>
        <h2 id="cv-heading">CV coming soon.</h2>
        <p>
          The downloadable résumé will be available here once Alaa adds the PDF.
          In the meantime, get in touch for a copy.
        </p>
        <a
          className="pill"
          href={`mailto:${identity.email}?subject=CV%20request`}
        >
          Request CV <span aria-hidden="true">↗</span>
        </a>
        <button onClick={onClose} className="text-button">
          Close
        </button>
      </div>
    </dialog>
  );
}
