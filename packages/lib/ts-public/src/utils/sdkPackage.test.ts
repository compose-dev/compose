import { describe, expect, it } from "vitest";

import { meetsMinimumVersion } from "./sdkPackage";

describe("meetsMinimumPackageVersion", () => {
  it("should return success for valid version above minimum", () => {
    expect(meetsMinimumVersion("1.0.0", "0.5.0")).toEqual({ success: true });
    expect(meetsMinimumVersion("2.1.0", "2.0.9")).toEqual({ success: true });
    expect(meetsMinimumVersion("0.19.1", "0.19.0")).toEqual({
      success: true,
    });
    expect(meetsMinimumVersion("0.26.0", "0.19.5")).toEqual({
      success: true,
    });
  });

  it("should return success for exact minimum version match", () => {
    expect(meetsMinimumVersion("1.0.0", "1.0.0")).toEqual({ success: true });
    expect(meetsMinimumVersion("0.19.0", "0.19.0")).toEqual({ success: true });
  });

  it("should return error for version below minimum", () => {
    const result = meetsMinimumVersion("1.0.0", "1.1.0");
    expect(result).toEqual({
      success: false,
      error:
        "Unsupported package version. Minimum supported version is 1.1.0. Please update your package to the latest version to get the latest features and bug fixes!",
    });
  });

  it("should return error for null version", () => {
    const result = meetsMinimumVersion(null, "1.0.0");
    expect(result).toEqual({
      success: false,
      error: "Package version is missing.",
    });
  });

  it("should return error for invalid semver format", () => {
    const result = meetsMinimumVersion("not.a.version", "1.0.0");
    expect(result).toEqual({
      success: false,
      error:
        "Unsupported package version. Minimum supported version is 1.0.0. Please update your package to the latest version to get the latest features and bug fixes!",
    });
  });

  it("should handle patch version comparisons correctly", () => {
    expect(meetsMinimumVersion("1.0.1", "1.0.0")).toEqual({ success: true });
    expect(meetsMinimumVersion("1.0.9", "1.0.10")).toEqual({
      success: false,
      error:
        "Unsupported package version. Minimum supported version is 1.0.10. Please update your package to the latest version to get the latest features and bug fixes!",
    });
  });

  it("should handle major version comparisons correctly", () => {
    expect(meetsMinimumVersion("2.0.0", "1.9.9")).toEqual({ success: true });
    expect(meetsMinimumVersion("1.9.9", "2.0.0")).toEqual({
      success: false,
      error:
        "Unsupported package version. Minimum supported version is 2.0.0. Please update your package to the latest version to get the latest features and bug fixes!",
    });
  });

  it("should handle minor version comparisons correctly", () => {
    expect(meetsMinimumVersion("1.2.0", "1.1.9")).toEqual({ success: true });
    expect(meetsMinimumVersion("1.1.9", "1.2.0")).toEqual({
      success: false,
      error:
        "Unsupported package version. Minimum supported version is 1.2.0. Please update your package to the latest version to get the latest features and bug fixes!",
    });
  });

  it("should handle undefined version", () => {
    const result = meetsMinimumVersion(undefined, "1.0.0");
    expect(result).toEqual({
      success: false,
      error: "Package version is missing.",
    });
  });

  it("should handle undefined minimum version", () => {
    const result = meetsMinimumVersion("1.0.0", undefined);
    expect(result).toEqual({
      success: false,
      error:
        "Minimum version is missing - perhaps because the package name was unrecognized?",
    });
  });
});
