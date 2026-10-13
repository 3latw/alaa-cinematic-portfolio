import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  define: { __PORTRAIT_AVAILABLE__: false, __CV_AVAILABLE__: false },
  test: { environment: "jsdom", setupFiles: ["src/test/setup.ts"] },
});
