import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Intro from "./components/Intro";
import Name from "./components/Name";
import Portrait from "./components/Portrait";
import Navigation from "./components/Navigation";
import CvDialog from "./components/CvDialog";
import ProjectCard from "./components/ProjectCard";
import {
  assetUrl,
  experience,
  identity,
  projects,
  skillGroups,
} from "./data/content";
import type { ReactNode } from "react";

function previouslyEntered() {
  try {
    return sessionStorage.getItem("alaa-entered") === "yes";
  } catch {
    return false;
  }
}
function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { y: 35, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
function Portfolio({ onReplay }: { onReplay: () => void }) {
  const [menu, setMenu] = useState(false);
  const [cv, setCv] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: hero,
    offset: ["start start", "end start"],
  });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);
  function openCv() {
    if (__CV_AVAILABLE__) {
      const link = document.createElement("a");
      link.href = assetUrl(identity.cv);
      link.download = "Alaa-Ziad-Tawalbeh-CV.pdf";
      link.click();
    } else setCv(true);
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Alaa Tawalbeh home">
          AT<span>✳</span>
        </a>
        <span className="header-caption mono">DEVELOPER / CREATIVE MIND</span>
        <button
          className="menu-button"
          aria-haspopup="dialog"
          aria-expanded={menu}
          onClick={() => setMenu(true)}
        >
          MENU <span aria-hidden="true">＋</span>
        </button>
      </header>
      <main id="main">
        <section
          className="hero section-shell"
          id="home"
          ref={hero}
          aria-labelledby="hero-heading"
        >
          <Portrait />
          <div className="hero-meta mono">
            <span>
              <i className="status-dot" /> OPEN TO WHAT’S NEXT
            </span>
            <span>IRBID, JORDAN / 2026</span>
          </div>
          <motion.h1
            id="hero-heading"
            style={reduced ? undefined : { y: nameY, opacity: nameOpacity }}
          >
            <Name />
          </motion.h1>
          <div className="hero-grid">
            <Reveal className="hero-story">
              <span className="eyebrow">THE MIND BEHIND THE CODE</span>
              <p className="hero-statement">
                Thoughtful systems.
                <br />
                Human experiences.
              </p>
              <p className="identity-line">{identity.title}</p>
              <div className="hero-actions">
                <a className="pill" href="#work">
                  Explore my work <span aria-hidden="true">↘</span>
                </a>
                <button
                  className="circle-button"
                  onClick={openCv}
                  aria-label="Download CV"
                >
                  ↓
                </button>
                <span className="mono cv-caption">CV</span>
              </div>
              <a className="scroll-cue mono" href="#about">
                <span aria-hidden="true">↓</span> SCROLL TO DISCOVER
              </a>
            </Reveal>
          </div>
        </section>
        <div className="manifesto-strip" aria-hidden="true">
          <span>IDEA → CODE → EXPERIENCE</span>
          <i>✳</i>
          <span>BUILT WITH INTENTION</span>
          <i>✳</i>
        </div>
        <section
          className="work-section section-shell"
          id="work"
          aria-labelledby="work-heading"
        >
          <Reveal>
            <div className="section-label mono">
              <span>01 / SELECTED WORK</span>
              <span>A PREVIEW OF WHAT’S NEXT</span>
            </div>
            <h2 id="work-heading">
              Ideas in
              <br />
              <span className="outline-type">the making.</span>
            </h2>
            <p className="section-intro">
              Six explorations. One curious mind.
              <br />
              The stories behind the builds are coming soon.
            </p>
          </Reveal>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>
        <section
          className="about-section section-shell"
          id="about"
          aria-labelledby="about-heading"
        >
          <Reveal>
            <div className="section-label mono">
              <span>02 / THE PERSON</span>
              <span>BEHIND THE SCREEN</span>
            </div>
            <div className="about-grid">
              <h2 id="about-heading">
                Curiosity.
                <br />
                Then <em>code.</em>
              </h2>
              <div className="about-copy">
                <p className="large-copy">
                  I’m Alaa Ziad Tawalbeh, a developer drawn to the space where
                  thoughtful systems meet everyday life.
                </p>
                <p>
                  A Computer Science graduate from Jordan University of Science
                  and Technology (JUST), I work with full stack development and
                  Flutter. I enjoy turning a problem into something clear,
                  useful, and carefully built.
                </p>
                <p>
                  From mobile interfaces to APIs and databases, I’m building my
                  practice one idea at a time.
                </p>
                <div className="about-facts mono">
                  <span>
                    BASED IN
                    <br />
                    <strong>IRBID, JORDAN</strong>
                  </span>
                  <span>
                    LANGUAGES
                    <br />
                    <strong>
                      ARABIC · NATIVE
                      <br />
                      ENGLISH · GOOD
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
        <section
          className="experience-section section-shell"
          id="experience"
          aria-labelledby="experience-heading"
        >
          <Reveal>
            <div className="section-label mono">
              <span>03 / THE JOURNEY</span>
              <span>LEARNING BY BUILDING</span>
            </div>
            <h2 id="experience-heading">
              A foundation.
              <br />A forward motion.
            </h2>
          </Reveal>
          <div className="timeline">
            {experience.map((item) => (
              <Reveal className="timeline-row" key={item.kind}>
                <span className="timeline-year">{item.year}</span>
                <div>
                  <span className="eyebrow">{item.kind}</span>
                  <h3>{item.title}</h3>
                  <p className="timeline-place">{item.place}</p>
                  <p>{item.detail}</p>
                </div>
                <span className="timeline-plus" aria-hidden="true">
                  ↗
                </span>
              </Reveal>
            ))}
          </div>
        </section>
        <section
          className="skills-section section-shell"
          id="skills"
          aria-labelledby="skills-heading"
        >
          <Reveal>
            <div className="section-label mono">
              <span>04 / THE TOOLKIT</span>
              <span>TOOLS SERVE THE IDEA</span>
            </div>
            <h2 id="skills-heading">
              Different tools.
              <br />
              <span className="outline-type">Same intention.</span>
            </h2>
          </Reveal>
          <div className="skill-groups">
            {skillGroups.map((group, index) => (
              <Reveal className="skill-group" key={group.title}>
                <span className="mono">0{index + 1}</span>
                <h3>{group.title}</h3>
                <ul>
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>
        <section
          className="contact-section section-shell"
          id="contact"
          aria-labelledby="contact-heading"
        >
          <Reveal>
            <div className="section-label mono">
              <span>05 / SAY HELLO</span>
              <span>EVERYTHING STARTS WITH A CONVERSATION</span>
            </div>
            <h2 id="contact-heading">
              Let’s build
              <br />
              <em>what’s next.</em>
            </h2>
            <a className="contact-email" href={`mailto:${identity.email}`}>
              {identity.email}
              <span aria-hidden="true">↗</span>
            </a>
            <div className="contact-links">
              <a
                className="pill secondary"
                href={identity.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
              <a
                className="pill secondary"
                href={identity.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗
              </a>
              <button className="pill secondary" onClick={openCv}>
                Download CV ↓
              </button>
            </div>
          </Reveal>
        </section>
      </main>
      <footer className="site-footer section-shell">
        <a className="wordmark" href="#home" aria-label="Back to top">
          AT<span>✳</span>
        </a>
        <span className="mono">
          © 2026 ALAA TAWALBEH
          <br />
          CRAFTED WITH INTENTION.
        </span>
        <button className="text-button mono" onClick={onReplay}>
          REPLAY INTRO ↺
        </button>
      </footer>
      {menu && <Navigation onClose={() => setMenu(false)} onCv={openCv} />}
      {cv && <CvDialog onClose={() => setCv(false)} />}
    </>
  );
}
export default function App() {
  const [entered, setEntered] = useState(previouslyEntered);
  function enter() {
    try {
      sessionStorage.setItem("alaa-entered", "yes");
    } catch {
      /* private mode */
    }
    setEntered(true);
  }
  function replay() {
    window.scrollTo({ top: 0, behavior: "instant" });
    setEntered(false);
  }
  return (
    <AnimatePresence mode="wait">
      {entered ? (
        <motion.div
          key="portfolio"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          <Portfolio onReplay={replay} />
        </motion.div>
      ) : (
        <Intro key="intro" onEnter={enter} />
      )}
    </AnimatePresence>
  );
}
