import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const available = (path: string) =>
  existsSync(fileURLToPath(new URL(path, import.meta.url)));
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/",
  define: {
    __PORTRAIT_AVAILABLE__: available("./public/media/IMG_6816.MP4"),
    __CV_AVAILABLE__: available("./public/files/Alaa-Ziad-Tawalbeh-CV.pdf"),
  },
});
