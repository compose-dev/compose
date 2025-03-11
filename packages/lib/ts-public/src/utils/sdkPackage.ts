const PACKAGE_NAME = {
  NODE: "compose-node",
  PYTHON: "compose-python",
} as const;

type PackageName = (typeof PACKAGE_NAME)[keyof typeof PACKAGE_NAME];

const compareVersions = (version: string, minVersion: string): number => {
  try {
    const parts = version.split(".").map(parseFloat);
    const minParts = minVersion.split(".").map(parseFloat);

    if (parts.some(isNaN) || minParts.some(isNaN)) {
      throw new Error("Invalid version format - version parts must be numbers");
    }

    for (let i = 0; i < 3; i++) {
      if (parts[i] > minParts[i]) return 1;
      if (parts[i] < minParts[i]) return -1;
    }

    return 0;
  } catch (e) {
    // If the version is not semver, we assume it's not supported
    return -2;
  }
};

function meetsMinimumPackageVersion(
  packageVersion: string | null | undefined,
  minVersion: string | null | undefined
): { success: true } | { success: false; error: string } {
  if (!packageVersion) {
    return { success: false, error: "Package version is missing." };
  }

  if (!minVersion) {
    return {
      success: false,
      error:
        "Minimum version is missing - perhaps because the package name was unrecognized?",
    };
  }

  if (compareVersions(packageVersion, minVersion) < 0) {
    return {
      success: false,
      error: `Unsupported package version. Minimum supported version is ${minVersion}. Please upgrade your package to continue using Compose. See docs for help: https://docs.composehq.com/guides/upgrade-sdk`,
    };
  }

  return { success: true };
}

const NEW_HEADER_FORMAT_MIN_PACKAGE_VERSION = {
  [PACKAGE_NAME.NODE]: "0.25.8",
  [PACKAGE_NAME.PYTHON]: "0.25.8",
} as const;

function shouldUseNewHeaderFormat(
  packageName: PackageName | undefined,
  packageVersion: string | undefined
) {
  if (!packageName || !packageVersion) {
    return false;
  }

  return meetsMinimumPackageVersion(
    packageVersion,
    NEW_HEADER_FORMAT_MIN_PACKAGE_VERSION[packageName]
  ).success;
}

export {
  PACKAGE_NAME as NAME,
  type PackageName as Name,
  meetsMinimumPackageVersion as meetsMinimumVersion,
  shouldUseNewHeaderFormat,
};
