function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function roundWithPadding(number: number, decimals: number): string {
  // Round the number to a string with the specified number of decimal places
  const formatted = number.toFixed(decimals);

  // Split the number into integer and decimal parts
  const [integerPart, decimalPart = ""] = formatted.split(".");

  // Pad the decimal part with zeros if necessary
  const paddedDecimalPart = decimalPart.padEnd(decimals, "0");

  if (decimals === 0) {
    return integerPart;
  }

  // Join the parts back together and return
  return `${integerPart}.${paddedDecimalPart}`;
}

function roundWithoutPadding(number: number, decimals: number): string {
  return parseFloat(number.toFixed(decimals)).toString();
}

function countDecimals(number: number): number {
  // Return 0 for non-numeric values, NaN, Infinity, or integers
  if (
    typeof number !== "number" ||
    isNaN(number) ||
    !isFinite(number) ||
    Number.isInteger(number)
  ) {
    return 0;
  }

  // Convert to string and split by decimal point
  const str = number.toString();
  const decimalPart = str.split(".")[1];

  // If there's no decimal part, return 0
  if (!decimalPart) {
    return 0;
  }

  return decimalPart.length;
}

/**
 * Corrects a number by removing trailing imprecision in its fractional part.
 *
 * The function determines if the input differs only by a small floating point
 * error from a "clean" rounded number. It iterates through a range of decimals
 * (from a computed minimum up to 15) and returns the candidate with the fewest
 * decimals that is within a tolerance of the original.
 *
 * @param num - The number to test and possibly correct.
 * @returns The corrected number if imprecision is detected, or the original number.
 */
function correctFloatingPoint(num: number): number {
  // Special case for zero.
  if (num === 0) return 0;

  // Determine the minimum decimals to use.
  // For numbers less than 1, we compute a minimum so that rounding doesn't collapse the number to 0.
  let startDecimals = 0;
  if (Math.abs(num) < 1) {
    // E.g. for 2e-12, we need about 12 decimal places to preserve the nonzero value.
    startDecimals = -Math.floor(Math.log10(Math.abs(num)));
  }

  // Choose a tolerance: for numbers < 1, use a fixed tolerance; for numbers >= 1, scale with magnitude.
  const tolerance = Math.abs(num) < 1 ? 1e-10 : 1e-10 * Math.abs(num);

  let correctedCandidate = num; // Default to original if no better candidate is found.
  const maxDecimals = 15;

  // Iterate starting from startDecimals (instead of always starting at 0).
  for (let decimals = startDecimals; decimals <= maxDecimals; decimals++) {
    // Round the number to the current number of decimal places.
    const candidate = parseFloat(num.toFixed(decimals));
    // If the candidate is within our tolerance, return it.
    if (Math.abs(num - candidate) <= tolerance) {
      correctedCandidate = candidate;
      break;
    }
  }
  return correctedCandidate;
}

/**
 * Return the number, or NaN.
 */
function convertFromString(num?: number | string): number {
  if (num === undefined) {
    return Number.NaN;
  }

  return typeof num === "string" ? parseFloat(num) : num;
}

/**
 * Attempts to convert a CSS width value (string or number) into a numerical pixel value
 * using fixed conversion factors and assumptions, without browser/DOM context.
 *
 * - Handles numbers (assumed to be pixels).
 * - Handles absolute CSS units (px, cm, mm, in, pt, pc) with standard conversion factors (assuming 96 DPI).
 * - Handles 'em' and 'rem' by assuming a base font size of 16px.
 * - Returns a fallback value for invalid input types (null, undefined, boolean, NaN, objects),
 *   empty strings, or strings where the numeric part cannot be parsed.
 * - Throws an Error for:
 *   - Context-dependent units (%, vw, vh, vmin, vmax).
 *   - CSS keywords that don't represent a fixed size (auto, inherit, etc.).
 *   - Unrecognized units.
 *   - Usage of `calc()`.
 *
 * @param width - The CSS width value to convert (e.g., "100px", 100, "2em").
 * @param fallbackValue - The number to return if the input `width` is fundamentally invalid or unparseable.
 * @param baseFontSizePx - Optional. The base font size in pixels to use for 'em' and 'rem' conversions. Defaults to 16.
 * @returns The calculated width in pixels as a number.
 * @throws {Error} If the unit requires context, is a non-fixed keyword, uses calc(), or is unrecognized.
 */
function convertCssWidthToPixelsStrict(
  width: unknown,
  fallbackValue: number,
  baseFontSizePx: number = 16
): number {
  // 1. Handle fundamentally invalid input types -> return fallbackValue
  if (
    width == null || // Catches null and undefined
    typeof width === "boolean" ||
    (typeof width === "number" && !Number.isFinite(width)) || // Catches NaN, Infinity
    (typeof width !== "number" && typeof width !== "string") // Catches objects, arrays, etc.
  ) {
    return fallbackValue;
  }

  // 2. Handle valid numbers (assume pixels)
  if (typeof width === "number") {
    return width;
  }

  // 3. Process string input
  const trimmedWidth = width.trim();
  if (trimmedWidth === "") {
    return fallbackValue;
  }

  const lowerCaseWidth = trimmedWidth.toLowerCase();

  // 4. Reject keywords that don't represent a fixed size
  const nonConvertibleKeywords = [
    "auto",
    "inherit",
    "initial",
    "unset",
    "revert",
    "revert-layer",
    "max-content",
    "min-content",
    "fit-content", // includes fit-content() check below
  ];
  if (
    nonConvertibleKeywords.includes(lowerCaseWidth) ||
    lowerCaseWidth.startsWith("fit-content(")
  ) {
    throw new Error(
      `Cannot convert CSS keyword "${trimmedWidth}" to pixels without context.`
    );
  }

  // 5. Reject calc()
  if (lowerCaseWidth.startsWith("calc(")) {
    throw new Error(
      `Cannot evaluate "calc()" expression "${trimmedWidth}" without a CSS parser or browser context.`
    );
  }

  // 6. Parse numeric value and unit
  // Regex: Optional sign, digits/decimals, then optional unit characters/%.
  const match = lowerCaseWidth.match(/^([-+]?\d*\.?\d+)([a-z%]*)$/);

  if (!match) {
    // Doesn't match the expected 'valueUnit' format
    return fallbackValue;
  }

  const [, valueStr, unit] = match;
  const value = parseFloat(valueStr);

  if (!Number.isFinite(value)) {
    // Failed to parse the numeric part
    return fallbackValue;
  }

  // 7. Unit Conversion Logic
  switch (unit) {
    case "": // Unitless treated as px
    case "px":
      return value;

    case "em":
    case "rem":
      // Assume base font size (e.g., 16px)
      return value * baseFontSizePx;

    // --- Absolute Lengths (assuming 96 DPI) ---
    case "in": // Inches (1in = 96px)
      return value * 96;
    case "cm": // Centimeters (1cm = 96px / 2.54)
      return value * (96 / 2.54);
    case "mm": // Millimeters (1mm = 1cm / 10)
      return value * (96 / 2.54 / 10);
    case "pt": // Points (1pt = 1/72in)
      return value * (96 / 72);
    case "pc": // Picas (1pc = 12pt)
      return value * (96 / 72) * 12;

    // --- Context-Dependent Units -> Throw Error ---
    case "%":
    case "vw":
    case "vh":
    case "vmin":
    case "vmax":
      throw new Error(
        `Cannot convert unit "${unit}" in "${trimmedWidth}" to pixels without context.`
      );

    // --- Unrecognized Unit -> Throw Error ---
    default:
      throw new Error(
        `Unrecognized or unsupported CSS unit "${unit}" in "${trimmedWidth}".`
      );
  }
}

export {
  clamp,
  roundWithPadding,
  roundWithoutPadding,
  correctFloatingPoint,
  countDecimals,
  convertFromString,
  convertCssWidthToPixelsStrict,
};
