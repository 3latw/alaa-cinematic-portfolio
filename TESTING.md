# Verification record

## Automated checks

- `npm install`: completed; lockfile committed.
- `npm test`: 17 tests across 5 files. Covers absolute left/center/right frame mapping, smoothing, input clamping, atlas integration without per-movement requests, zero-button touch swipes, slider input, blocked-video independence, missing/failed poster and CV handling, modal focus loops/restoration, intro progression/skip, reduced-motion readiness, decode-before-motion gating, failure retention, cached-image handling, and disposal.
- `npm run build`: TypeScript and production build passed.
- Repository-path production build with `VITE_BASE_PATH=/alaa-cinematic-portfolio/`: passed.
- Served that production build at `/alaa-cinematic-portfolio/` and confirmed the intro, main site, and bundled JavaScript/CSS load under the repository base.
- `npm audit`: zero vulnerabilities at verification time.

The image loader is simulated in unit tests. Browser inspection additionally checks real JPEG decoding and movement from frame 000 to 048 using the native slider. The hero has no video element or media-playback dependency.

## Browser inspection

Inspected the actual running website in the Codex browser at desktop 1440×900, wide desktop 1920×1080, tablet 768×1024, mobile 390×844, and minimum mobile 320×568.

- Observed intro progress from its starting state to READY / 100%; activated OPEN with Enter; verified Skip and Replay.
- Inspected main hero, project gallery, About, Experience, Skills, and Contact. Confirmed the six COMING SOON projects and supplied identity, experience, skill, and language content.
- Opened full-screen navigation on desktop and mobile; verified section navigation, Tab / Shift+Tab containment, Escape, backdrop close, and restored Menu focus.
- Verified missing portrait artwork and disabled range input, missing CV request dialog, and the configured GitHub, LinkedIn, and email destinations. No contact messages were sent.
- Corrected mobile name wrapping during QA. Checked document and heading bounds for horizontal overflow.
- Browser console: no application errors or warnings at inspection time.

## Supplied video and revised hero

The owner supplied `IMG_6816.MP4`, which is now committed unchanged at `public/media/IMG_6816.MP4`: 645,806 bytes, 464×848, duration 3.866667 seconds, SHA-256 `95647c1d6c6b6b275f9a17ce80198d163aae5cdbdd1af8a5f700a619443670b0`.

- The real MP4 decoded in the browser; `readyState=4`, no media error, `muted=true`, and `paused=true`.
- Verified real seeking through the native slider: first frame near 0.025s, frontal frame near 1.889s, last frame near 3.816s. Observed actual head turns rather than a CSS rotation.
- Replaced the framed portrait card with an enlarged video integrated into the top hero, soft radial masks, and gradient fades into the black background. Checked the revised desktop 1440×900 and mobile 390×844 layouts without horizontal overflow.
- The 10 automated tests still cover input mapping, touch/slider behavior, missing or invalid media, modal navigation, and intro behavior.

## iPhone compatibility correction

The owner reported an empty portrait on an iPhone 11 Pro. The original file is H.264 High / yuv420p with AAC audio. The old hero waited for `loadeddata` and kept the video transparent until that event arrived, so a browser that withheld initial video decoding could display nothing. The exact phone failure was not reproduced on physical hardware.

The hero now uses 49 real frames extracted locally from the unchanged MP4. The eager frontal poster is visible independently of video events. Touch handling accepts a zero-button pointer and cancels on pointer-up/cancel. `vh` fallback avoids depending on `svh` support. The subsequent stuttering report exposed a per-frame loader that could wait for changing targets during continuous movement. All frames now share one preloaded and decoded 7×7 atlas. Scrubbing only translates the bitmap; it does not fetch or decode a separate image per movement. Controls stay disabled while the atlas prepares, and a failed atlas leaves the poster visible. The 2240×4095 atlas is 726,585 bytes (approximately 35 MiB decoded); each visible frame is 320×585, with the whole body preserved.

Local browser inspection at 375×812 confirmed the real atlas decoded at 2240×4095, the native slider reached frames 000 and 048 while retaining the same image URL, the full figure remained visible, and there was no horizontal overflow. Pointer motion over the range controls is ignored so it cannot override keyboard or slider input.

## Remaining asset/device checks

The full-body layout revision uses `object-fit: contain` and the source aspect ratio, with an expanded studio-blue hero background fading into black. Desktop 1440×900 showed the whole video between y=106 and y=790. Mobile 390×844 showed the video ending at y=587.5 and the name starting below it at y=688.8. Minimum mobile 320×568 showed the video ending at y=560, with no horizontal overflow. The original video remains unchanged.

- Verify swipe and slider on physical touch devices; the automated swipe test uses a simulated pointer event.
- Confirm the JPEG frame interaction on physical iOS Safari and Android, including low-power / data-saving modes. No autoplay or video-decoder permission is required by the new hero.
- Confirm the real CV downloads successfully, opens as a valid PDF, and respects the GitHub Pages repository base.
- Verify real project previews when supplied. Current cards truthfully present original artwork and COMING SOON status.

The CV and future project previews are still missing. Physical iOS/Android testing has not been performed. The original owner video is now included and has been tested in the desktop browser.
