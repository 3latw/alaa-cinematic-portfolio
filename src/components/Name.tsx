import { motion, useReducedMotion } from "motion/react";
export default function Name({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <span className={`display-name ${className}`} aria-label="Alaa Tawalbeh">
      {["ALAA", "TAWALBEH"].map((word, line) => (
        <span className="name-line" aria-hidden="true" key={word}>
          {[...word].map((letter, index) => (
            <motion.span
              key={index}
              className="letter"
              initial={reduced ? false : { y: "110%", rotate: 4, opacity: 0 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              transition={{
                duration: 0.95,
                delay: reduced ? 0 : 0.12 + line * 0.14 + index * 0.035,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}
