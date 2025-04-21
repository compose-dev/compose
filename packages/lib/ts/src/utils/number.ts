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
 * error from a “clean” rounded number. It iterates through a range of decimals
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

export {
  clamp,
  roundWithPadding,
  roundWithoutPadding,
  correctFloatingPoint,
  countDecimals,
  convertFromString,
};
