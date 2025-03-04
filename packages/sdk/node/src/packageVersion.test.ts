import { describe, it, expect } from "vitest";
import packageJson from "../package.json";
import { PACKAGE_VERSION } from "./packageVersion";

describe("Package Version", () => {
  it("should match the version in package.json", () => {
    expect(PACKAGE_VERSION).toBe(packageJson.version);
  });
});
