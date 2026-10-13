import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const frames = JSON.parse(readFileSync("src/data/portraitFrames.json", "utf8"));
const columns = 7;
const rows = Math.ceil(frames.count / columns);
const frameWidth = 320;
const frameHeight = 585;
if (columns * frameWidth > 4096 || rows * frameHeight > 4096)
  throw new Error("Atlas exceeds the mobile texture budget");
const source = `media/portrait-atlas-${frames.sourceSha.slice(0, 8)}-320.jpg`;
const target = resolve("public", source);
const result = spawnSync(
  process.env.FFMPEG_BIN || "ffmpeg",
  [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-framerate",
    "1",
    "-start_number",
    "0",
    "-i",
    resolve("public", frames.directory, "frame-%03d.jpg"),
    "-vf",
    `scale=${frameWidth}:${frameHeight}:flags=lanczos,tile=${columns}x${rows}:nb_frames=${frames.count}`,
    "-frames:v",
    "1",
    "-q:v",
    "3",
    "-update",
    "1",
    target,
  ],
  { encoding: "utf8", windowsHide: true },
);
if (result.status !== 0)
  throw new Error(result.stderr || "Atlas generation failed");
const manifest = {
  source,
  poster: `${frames.directory}/frame-${String(frames.posterIndex).padStart(3, "0")}.jpg`,
  count: frames.count,
  columns,
  rows,
  frameWidth,
  frameHeight,
  sourceSha: frames.sourceSha,
  bytes: statSync(target).size,
};
writeFileSync(
  "src/data/portraitAtlas.json",
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(JSON.stringify(manifest));
