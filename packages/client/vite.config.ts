import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": "/src",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    rollupOptions: {
      external: [/\.test\.(tsx?|jsx?)$/, /\.testUtils\.(tsx?|jsx?)$/],
    },
  },
  // Vitest config
  // @ts-expect-error: Vitest is not typed
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
