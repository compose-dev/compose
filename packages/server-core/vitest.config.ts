import { defineConfig } from "vitest/config";

export default defineConfig({
  // For now, we need to run tests sequentially since they rely
  // on a single test database instance.
  test: {
    fileParallelism: false,
  },
  envDir: "../../../.env",
});
