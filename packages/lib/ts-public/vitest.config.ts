import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
      tsconfig: "./tsconfig.test.json",
      checker: "tsc",
      include: ["**/*.test-d.ts"],
    },
  },
});
