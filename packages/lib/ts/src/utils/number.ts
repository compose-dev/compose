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

  // Join the parts back together and return
  return `${integerPart}.${paddedDecimalPart}`;
}

export { clamp, roundWithPadding };
