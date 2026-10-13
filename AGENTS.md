# AGENTS.md — Alaa's cinematic portfolio (greenfield)

You are implementing a **NEW, independent website from scratch** in this repository. Do not import, clone, copy, or modify anything from `3latw/portfolio` (the older portfolio), or any other existing portfolio belonging to this owner.

## Product goal
Build a highly polished, cinematic, interactive developer portfolio inspired by the **visual pacing, immersive opening screen, kinetic typography and site-wide animation** at https://mohassan.online/ . The website must have **original implementation and original/owner-supplied assets**; don't scrape/copy third-party proprietary code, images, videos, wording or fonts. Study the reference visually when browser tools are available. The screenshot shared by the owner shows: black REC/REEL introductory frame with corner crop marks, a very large centered name, tracking-spaced subtitle, blue progress line, READY_ / 100%, an outlined OPEN button, and a quiet footer.

## Nonnegotiable visual direction
- Whole experience predominantly **near black** (#050505–#090909), off-white large typography. Avoid conventional business-template look.
- Accent color sampled from the studio background of the owner's supplied video: **sky blue #7DCAF4** (approximate). Use it on pill buttons, progress, outlines, focus, hover and micro highlights, NOT across all page backgrounds.
- Consistent art direction and polished transitions throughout: opening, hero, navigation, about, experience, skills, projects, contact, footer.
- English content, premium typography, responsive layout, tasteful restrained sound only by explicit user choice; default **no autoplay sound**.

## Opening experience (required, not optional)
1. A dedicated full-viewport cinematic intro, modeled in rhythm/layout (but original implementation) on the supplied reference screenshot. Text must read **ALAA / TAWALBEH** rather than reference author's name. Subtitle e.g. `THE MIND BEHIND THE CODE`.
2. Small `REC — REEL 2026` cue at upper left, subtle timecode at upper right, faint framing corners, bottom copyright / location (`IRBID, JORDAN`) and `BEST WITH SOUND ON` only if an actual user-enabled soundscape exists (otherwise use a non-misleading cue).
3. Real asset loading (or meaningful staged introduction without falsely reporting network completion), smooth 0→100% visual progress, animated READY_, then strong bordered **OPEN** call to enter the experience. Provide skip/keyboard activation, reduced-motion path. Respect prior visit in same session if sensible.
4. Animated per-letter/per-line reveal of the owner's name, masking, scale/offset easing, clean seamless hand-off into full main site. Never omit the intro or make it a static modal.

## Interactive portrait video
- The owner uploaded a short ~3.87 s video, `IMG_6816.MP4`, showing his head turn **left → front → right** over a **light-blue studio background**. Owner wants the person's **real head direction** to correspond to cursor X:
  - mouse left → look left (early frame)
  - center → frontal (middle frame)
  - right → look right (late frame).
- Cursor **absolute normalized X**, not accumulated relative delta or fake CSS rotation of a static video. Smooth motion with efficient seek/frame extraction using requestAnimationFrame; evaluate pre-extracting short AVIF/WebP frames/sprite for performance and mobile. Limit memory on lower-end devices. Pointer Y can drive a gentle stage/parallax effect, NOT fake up/down face rotation.
- On touch devices offer swipe/slider control, and poster fallback. Don't autoplay repeated distracting motion; accessible fallback + `prefers-reduced-motion`.
- **MEDIA AVAILABILITY**: The user's attachment `IMG_6816.MP4` was supplied to ChatGPT; it might NOT be in this GitHub repository and cannot be assumed visible to Codex. Use `public/media/IMG_6816.MP4` when present, otherwise implement functional placeholder/fallback and clearly state how the owner can upload that video to `public/media/` (do not reuse the old portfolio video). Never falsely say video was shipped if absent.

## Hero and overall motion
- Oversized editorial `ALAA TAWALBEH` name with character staggering, scroll-driven transforms, section transitions, elegant mouse hover states, cinematic video stage.
- Display exactly this identity line: `Software Developer | Full Stack & Flutter | Computer Science Graduate at JUST`.
- Navigation opens as a full-viewport animated overlay on ALL sizes; links Home, Work, About, Experience, Skills, Contact, CV. Keyboard/focus trap/Escape/backdrop close.
- Smooth section entrances, hover-reactive CTA buttons, magnetic accents if light enough, scrolling cues, custom transitions between sections with no accessibility regressions.
- Use Framer Motion/Motion and/or GSAP + ScrollTrigger + Lenis only where appropriate, and clean up listeners/timelines correctly.

## Required original content
- Name: **Alaa Ziad Tawalbeh** (hero display may use **ALAA TAWALBEH**).
- Title: **Software Developer | Full Stack & Flutter | Computer Science Graduate at JUST**.
- Education: BSc Computer Science, **Jordan University of Science and Technology (JUST), 2026**.
- Experience: **Software Development Trainee — King Abdullah University Hospital, 2026**; collaborated on software development, system support, technical operations, troubleshooting.
- Training: **Tuned Applications Academy, 2024**, 80-hour hands-on ASP.NET Core 6/C# training: MVC, Entity Framework Core, RESTful APIs, authentication, database integration.
- Skills documented in owner's CV: Flutter, Dart, ASP.NET Core 6, C#, HTML5, CSS3, JavaScript, SQL Server, MySQL, REST APIs, Git, GitHub, Python, database management, AI-assisted development. Include additional skills only if verified/confirmed, without fabricating work history.
- Languages: Arabic (native), English (good).
- GitHub: https://github.com/3latw
- LinkedIn (user-confirmed): https://www.linkedin.com/in/alaa-tawalbeh/
- Contact email: 3latawalbeh@gmail.com
- Phone in resume: +962 795333908 (only expose if appropriate to the public site; avoid gratuitous exposure in contact hero).
- CV download: `/files/Alaa-Ziad-Tawalbeh-CV.pdf` (owner's CV is provided to ChatGPT, but this *new* repository currently may NOT contain the PDF). Set up the link and keep a clear media checklist when missing. Do not read files from old repo.
- Projects: elegant, animated cinematic showcase cards for **Smart Bus**, **SkillSwap**, **CV Analyzer**, **Job Finder Platform**, **University Management System**, **AI Chatbot Application**. The owner wants motion previews but will supply them later: until then each card must visibly say **COMING SOON** and not imply live deployment, testimonials, launch, or public source code. Provide editable data config where videos, screenshots, project descriptions, GitHub/demo URLs can be added without changing components.

## Engineering quality
- New implementation: preferably React + Vite + TypeScript, component architecture, `src/data` content config, CSS/animation architecture.
- Mobile, tablet, desktop thoroughly handled, no clipping/overflow. Semantic HTML, color contrast, keyboard navigation, accessible links and buttons, honor `prefers-reduced-motion`.
- Performance: fast initial load, progressive media loading, no huge blocking hero video, no autoplay audio, avoid costly 3D effects.
- Deploy-ready via GitHub Pages or comparable static hosting with correct Vite `base` for repository path, and a deployment workflow or clear deploy steps.
- Test: `npm install`, `npm run build`, desktop/mobile browser inspection, intro progression, mouse-left/center/right scrub, touch fallback, navigation, links, missing media behavior, CV download. Report honest test results.
- Work on a feature branch and open a PR for owner review. Do not merge or deploy without explicit approval.

## Deliverable
Create the actual complete code and PR, not merely a concept, plan or screenshot. Provide concise status, tests and missing-media checklist. The original site must remain untouched.
