# Alaa Tawalbeh — cinematic portfolio

An original React / Vite / TypeScript portfolio built for [issue #1](https://github.com/3latw/alaa-cinematic-portfolio/issues/1). No code or assets from the owner's earlier portfolio were used. The reference was studied visually; all layouts, motion, project artwork, and implementation here are original.

## Run and verify

Use Node.js 22.12+ (Node 24 LTS also works).

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

The intro's 2.3-second progress is explicitly an introduction sequence, not a network-loading claim. OPEN becomes keyboard-focusable at completion; Skip intro is available immediately. Entry is remembered in session storage, and Replay intro is available in the footer. Reduced motion removes the wait and transform animations. There is no audio or automatic video playback.

## Owner media checklist

The owner's original `IMG_6816.MP4` is now included at `public/media/IMG_6816.MP4` (645,806 bytes, 464×848, approximately 3.87 seconds). The full head-to-toe frame is shown at the top of the site using contain sizing. An extended studio-blue background blends into black, with soft video-edge masks. The desktop figure sits beside the name; the mobile name follows the full figure so it does not cover the legs. The CV PDF and project previews are still pending.

- To replace the portrait, use **`public/media/IMG_6816.MP4`**. Exact casing matters on GitHub Pages. Prefer an H.264 MP4 with frequent keyframes and fast-start metadata for responsive seeking.
- Add the real résumé at **`public/files/Alaa-Ziad-Tawalbeh-CV.pdf`**. No substitute résumé is generated.
- Regenerate the JPEG frames and atlas when replacing the portrait video, then restart Vite / rebuild. Vite checks the frontal frame's availability when its config loads. A failed atlas keeps the frontal poster visible; if both images fail, clear fallback artwork appears. Missing CV opens a request dialog instead of a broken download.
- Add future project videos, screenshots, descriptions, and source/demo URLs in **`src/data/content.ts`**. Media paths are relative to `public/`; absolute HTTPS URLs also work. All six cards deliberately keep their COMING SOON status. Preview videos have user-controlled playback, muted by default, with `preload="none"`.

## Portrait implementation

Absolute mouse X across the viewport maps to 49 **real frames extracted from the original video**: left → early frame, center → middle frame, right → late frame. A requestAnimationFrame loop smooths that position. There is no CSS face rotation, autoplay, audio, video decoding, or reliance on a `loadeddata` event in the hero. The frontal poster is an eager, high-priority image; it stays visible while motion prepares.

All motion frames share one 7×7 JPEG atlas (726,585 bytes, 2240×4095, approximately 35 MiB decoded). Motion controls activate only after this bitmap has loaded and decoded. Movement translates the same image within a clipped frame; no image URL changes or network requests occur while scrubbing. Each frame retains the full body at 320×585. A failed atlas keeps the frontal poster visible with motion disabled. Animation stops off screen or in a hidden tab. Touch swipes do not depend on `PointerEvent.buttons`, and the labeled native slider also works with touch and keyboard. Reduced motion stays on the frontal frame until the user explicitly moves a control. The original MP4 remains unchanged in the repository.

Source frames are stored in `public/media/portrait-frames-95647c1d/`, with a generated manifest at `src/data/portraitFrames.json`. To regenerate after replacing the video, install FFmpeg and ffprobe, then run `node scripts/extract-portrait-frames.mjs` followed by `node scripts/build-portrait-atlas.mjs`. The latter writes the atlas and `src/data/portraitAtlas.json`, and guards its dimensions at 4096 pixels. `FFMPEG_BIN` and `FFPROBE_BIN` can specify absolute executable paths. Extraction preserves the full source dimensions and records the source SHA-256; no external media service is used.

## Hosting (manual owner action)

CI runs the tests and production build on pull requests. The owner has authorized GitHub Pages publication at https://3latw.github.io/alaa-cinematic-portfolio/ . The current deployment serves the verified static build from the `gh-pages` branch. Updating that deployment requires a repository-base build and publishing the contents of `dist/` to `gh-pages`. Source changes on the feature branch do not automatically publish.

After reviewing and merging the PR, the owner can optionally switch **Settings → Pages → Source: GitHub Actions**, then run **Deploy portfolio (owner approval only)** on `main`. That workflow is manual only and builds with `VITE_BASE_PATH=/alaa-cinematic-portfolio/`. For a custom domain or root hosting, leave the base unset (`/`). All bundled assets and owner media/download paths respect that base. `dist/` is the static deployment directory.

## Architecture and accessibility

- `src/components/`: intro, animated name, portrait, project cards, navigation, and CV dialog.
- `src/data/content.ts`: verified identity, education, experience, skills, and editable project content.
- `src/lib/`: seek math and reusable modal focus/scroll management.
- `src/styles.css`: responsive editorial layout and reduced-motion overrides.
- Motion provides entrance, name, navigation, and scroll animation; effects clean up their observers, listeners, and animation frames.
- Native modal dialogs make the page behind them inert; explicit Tab / Shift+Tab loops, Escape, backdrop close, and focus restoration support keyboard navigation.
- Self-hosted Barlow Condensed, DM Sans, and IBM Plex Mono are distributed by Fontsource under their open licenses, shipped in `public/licenses/`. No third-party requests are needed at runtime.

See [TESTING.md](TESTING.md) for verified results and the remaining owner-media checks.
