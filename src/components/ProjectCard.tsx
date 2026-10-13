import { motion, useReducedMotion } from "motion/react";
import { assetUrl, type Project } from "../data/content";
import { useState } from "react";
export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  return (
    <motion.article
      className={`project-card project-${index}`}
      initial={reduced ? false : { y: 45, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7 }}
    >
      <div className="project-visual">
        {project.previewVideo && !failed ? (
          <video
            src={assetUrl(project.previewVideo)}
            poster={
              project.screenshot ? assetUrl(project.screenshot) : undefined
            }
            controls
            playsInline
            muted
            preload="none"
            onError={() => setFailed(true)}
            aria-label={`${project.name} preview`}
          />
        ) : project.screenshot && !failed ? (
          <img
            loading="lazy"
            src={assetUrl(project.screenshot)}
            alt={`${project.name} preview`}
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="project-art" aria-hidden="true">
            <div className="art-orbit" />
            <div className="art-orbit second" />
            <span>{["SB", "S↔S", "CV_", "JF", "UM", "AI"][index]}</span>
            <div className="art-line" />
          </div>
        )}
        <span className="coming-soon mono">
          <i /> COMING SOON
        </span>
        <span className="project-index mono">/{project.id}</span>
      </div>
      <div className="project-heading">
        <h3>{project.name}</h3>
        <span className="mono">{project.category}</span>
      </div>
      <p>
        {project.description} Full project details and motion preview are on the
        way.
      </p>
      {(project.githubUrl || project.demoUrl) && (
        <div className="project-links">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              Source ↗
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer">
              Preview ↗
            </a>
          )}
        </div>
      )}
    </motion.article>
  );
}
