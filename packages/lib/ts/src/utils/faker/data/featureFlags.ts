// Feature flag types
type BooleanFlag = { type: "boolean"; value: boolean };
type NumericFlag = { type: "numeric"; value: number };
type StringFlag = { type: "string"; value: string };

type FeatureFlag = BooleanFlag | NumericFlag | StringFlag;

// Predefined feature flags with realistic names and values
const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  // Boolean flags
  darkMode: { type: "boolean", value: true },
  betaFeatures: { type: "boolean", value: false },
  analyticsEnabled: { type: "boolean", value: true },
  advancedSearch: { type: "boolean", value: false },
  multiFactorAuth: { type: "boolean", value: true },
  autoSave: { type: "boolean", value: true },
  notifications: { type: "boolean", value: true },
  experimentalUI: { type: "boolean", value: false },
  dataExport: { type: "boolean", value: false },
  customBranding: { type: "boolean", value: false },

  // Numeric flags
  maxFileSize: { type: "numeric", value: 25 }, // in MB
  requestLimit: { type: "numeric", value: 1000 },
  cacheTimeout: { type: "numeric", value: 3600 }, // in seconds
  retryAttempts: { type: "numeric", value: 3 },
  concurrentConnections: { type: "numeric", value: 5 },

  // String flags
  deploymentRegion: { type: "string", value: "us-west" },
  logLevel: { type: "string", value: "info" },
  apiVersion: { type: "string", value: "v2" },
  renderEngine: { type: "string", value: "standard" },
  cdnProvider: { type: "string", value: "cloudflare" },
};

// Flag keys in a consistent order
const FLAG_KEYS = Object.keys(FEATURE_FLAGS);

/**
 * Generates a consistent set of feature flags.
 *
 * @param count - Number of feature flags to generate (max 20)
 * @returns Record of feature flag names to their values
 */
function generateFeatureFlags(
  count: number
): Record<string, boolean | number | string> {
  // Ensure count is within bounds
  const flagCount = Math.min(Math.max(0, count), FLAG_KEYS.length);

  // Always return the same subset of flags for a given count
  const selectedFlags = FLAG_KEYS.slice(0, flagCount);

  // Create the result object
  const result: Record<string, boolean | number | string> = {};

  // Add each selected flag to the result
  for (const flagName of selectedFlags) {
    const flag = FEATURE_FLAGS[flagName];
    result[flagName] = flag.value;
  }

  return result;
}

export { generateFeatureFlags };
