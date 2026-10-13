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

The owner's original `IMG_6816.MP4` is now included at `public/media/IMG_6816.MP4` (645,806 bytes, 464×848, approximately 3.87 seconds). It is displayed large at the top of the main site, with soft masks fading into the black hero background rather than a framed card. The CV PDF and project previews are still pending.

- To replace the portrait, use **`public/media/IMG_6816.MP4`**. Exact casing matters on GitHub Pages. Prefer an H.264 MP4 with frequent keyframes and fast-start metadata for responsive seeking.
- Add the real résumé at **`public/files/Alaa-Ziad-Tawalbeh-CV.pdf`**. No substitute résumé is generated.
- Restart Vite / rebuild after adding either file. Vite checks availability when its config loads. Missing video renders original AT artwork and disabled controls; an invalid or undecodable video also falls back. Missing CV opens a request dialog instead of a broken download.
- Add future project videos, screenshots, descriptions, and source/demo URLs in **`src/data/content.ts`**. Media paths are relative to `public/`; absolute HTTPS URLs also work. All six cards deliberately keep their COMING SOON status. Preview videos have user-controlled playback, muted by default, with `preload="none"`.

## Portrait implementation

Absolute mouse X across the viewport maps to a normalized 0–1 position: left → early frame, center → middle frame, right → late frame. A requestAnimationFrame loop smooths that position and seeks the paused video's **actual `currentTime`**, serializing seeks while the decoder is busy and avoiding the exact EOF. There is no CSS face rotation. Seeking stops when the stage is off screen or the tab is hidden. Touch users can swipe horizontally on the stage or use the labeled native range control; keyboard users can use arrow keys on that slider. Reduced motion keeps the center frame unless the slider is explicitly changed.

Direct seeking was selected instead of pre-extracting a frame atlas: the supplied film is short and only about 631 KiB, avoiding extra downloads and decoded-image memory on mobile. Verify seeking on physical iOS Safari and low-end Android devices; if decoding is slow there, a small frame sequence can be generated as a follow-up.

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
