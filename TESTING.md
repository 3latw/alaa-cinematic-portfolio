# Verification record

## Automated checks

- `npm install`: completed; lockfile committed.
- `npm test`: 10 tests across 4 files. Covers absolute left/center/right time mapping, smoothing, input clamping, simulated media `currentTime` integration, touch swipe and slider input, decoder failure, missing video/CV behavior, modal focus loops/restoration, staged intro progression/skip, and immediate reduced-motion readiness.
- `npm run build`: TypeScript and production build passed.
- Repository-path production build with `VITE_BASE_PATH=/alaa-cinematic-portfolio/`: passed.
- Served that production build at `/alaa-cinematic-portfolio/` and confirmed the intro, main site, and bundled JavaScript/CSS load under the repository base.
- `npm audit`: zero vulnerabilities at verification time.

The portrait integration test uses a **simulated HTMLMediaElement**, not the owner's film. It proves time seeking and UI behavior; it cannot prove real face direction or decode performance.

## Browser inspection

Inspected the actual running website in the Codex browser at desktop 1440×900, wide desktop 1920×1080, tablet 768×1024, mobile 390×844, and minimum mobile 320×568.

- Observed intro progress from its starting state to READY / 100%; activated OPEN with Enter; verified Skip and Replay.
- Inspected main hero, project gallery, About, Experience, Skills, and Contact. Confirmed the six COMING SOON projects and supplied identity, experience, skill, and language content.
- Opened full-screen navigation on desktop and mobile; verified section navigation, Tab / Shift+Tab containment, Escape, backdrop close, and restored Menu focus.
- Verified missing portrait artwork and disabled range input, missing CV request dialog, and the configured GitHub, LinkedIn, and email destinations. No contact messages were sent.
- Corrected mobile name wrapping during QA. Checked document and heading bounds for horizontal overflow.
- Browser console: no application errors or warnings at inspection time.

## Required after the real media is supplied

- Confirm `IMG_6816.MP4` renders the owner's left-facing, frontal, and right-facing frames at mouse X 0 / 0.5 / 1; verify swipe and slider on physical touch devices.
- Confirm MP4 scrubbing latency, orientation, and cropping on iOS Safari and Android. Verify muted/paused behavior and no recurring playback.
- Confirm the real CV downloads successfully, opens as a valid PDF, and respects the GitHub Pages repository base.
- Verify real project previews when supplied. Current cards truthfully present original artwork and COMING SOON status.

The missing owner video and CV prevent these asset-specific checks. This PR is ready for code/design review, not a claim that the missing owner assets were tested or shipped.
