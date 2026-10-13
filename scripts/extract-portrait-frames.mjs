import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const ffmpeg = process.env.FFMPEG_BIN || "ffmpeg";
const ffprobe = process.env.FFPROBE_BIN || "ffprobe";
const source = resolve("public/media/IMG_6816.MP4");
const sourceSha = createHash("sha256")
  .update(readFileSync(source))
  .digest("hex");
const count = 49;
const probe = spawnSync(
  ffprobe,
  [
    "-v",
    "error",
    "-show_entries",
    "format=duration:stream=codec_type,width,height",
    "-of",
    "json",
    source,
  ],
  { encoding: "utf8", windowsHide: true },
);
if (probe.status !== 0)
  throw new Error(probe.stderr || "Video inspection failed");
const metadata = JSON.parse(probe.stdout);
const duration = Number(metadata.format.duration);
const video = metadata.streams.find((stream) => stream.codec_type === "video");
if (!video || !Number.isFinite(duration) || duration <= 0)
  throw new Error("Invalid source video");
const directory = `media/portrait-frames-${sourceSha.slice(0, 8)}`;
mkdirSync(resolve("public", directory), { recursive: true });
let totalBytes = 0;
for (let index = 0; index < count; index++) {
  const time = (index / (count - 1)) * (duration - 0.04);
  const target = resolve(
    "public",
    directory,
    `frame-${String(index).padStart(3, "0")}.jpg`,
  );
  const result = spawnSync(
    ffmpeg,
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-ss",
      time.toFixed(6),
      "-i",
      source,
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
    throw new Error(result.stderr || "Frame extraction failed");
  totalBytes += statSync(target).size;
}
const manifest = {
  directory,
  count,
  posterIndex: 24,
  width: video.width,
  height: video.height,
  duration,
  sourceSha,
  totalBytes,
};
writeFileSync(
  "src/data/portraitFrames.json",
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(JSON.stringify(manifest));
