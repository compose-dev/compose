import { clamp, roundWithPadding } from "./number";

function isValidEmail(str: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
const localhostDomainRE = /^localhost(?:[:?\d]*)(?:[^:?]\S*)?$/;
const nonLocalhostDomainRE = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.\S{2,}$/;
/**
 * Loosely checks if a string is a valid URL. Checks the following:
 * - Optionally starts with a protocol (e.g. http://).
 * - Either a valid localhost or non-localhost domain.
 * @param str - The string to check.
 * @returns True if the string is a valid URL, false otherwise.
 */
function isValidUrl(str: string): boolean {
  if (typeof str !== "string") {
    return false;
  }

  const match = str.match(protocolAndDomainRE);

  const everythingAfterProtocol = match === null ? str : match[1];
  if (!everythingAfterProtocol) {
    return false;
  }

  if (
    localhostDomainRE.test(everythingAfterProtocol) ||
    nonLocalhostDomainRE.test(everythingAfterProtocol)
  ) {
    return true;
  }

  return false;
}

function addThousandsSeparator(value: number | string): string {
  let parsed: number;

  if (typeof value === "string") {
    parsed = parseFloat(value);
  } else {
    parsed = value;
  }

  if (isNaN(parsed)) {
    return "0";
  }

  const parts = value.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function formatCurrency(
  value: number | string,
  prefix: string = "$",
  decimals: number = 2
) {
  let parsed;

  if (typeof value === "string") {
    parsed = parseFloat(value);
  } else {
    parsed = value;
  }

  if (isNaN(parsed)) {
    return "PARSE ERROR";
  }

  const roundedValue = parsed.toFixed(clamp(decimals, 0, 2));

  const formattedValue = addThousandsSeparator(roundedValue);

  return `${prefix}${formattedValue}`;
}

function formatNumber(value: number | string, decimals: number = 0) {
  let parsed;

  if (typeof value === "string") {
    parsed = parseFloat(value);
  } else {
    parsed = value;
  }

  if (isNaN(parsed)) {
    return "PARSE ERROR";
  }

  const roundedValue = Number(
    parsed.toFixed(clamp(decimals, 0, 16))
  ).toString();

  const formattedValue = addThousandsSeparator(roundedValue);

  return formattedValue;
}

function capitalize(str: string) {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }

  if (str.length === 1) {
    return str.toUpperCase();
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Tries to prettify a key string. Will convert camelCase, snake_case, and dash-case to
 * a space-separated string. Will also convert id and uuid to ID and UUID.
 *
 * @param {string} key - The key to prettify.
 * @param {boolean} titleCase - Whether to use title case (i.e. capitalize the first letter of each word). If false, will only capitalize the first word in the string. Defaults to true.
 *
 * @returns {string} The prettified key.
 */
function prettifyKey(key: string, titleCase: boolean = true): string {
  if (typeof key !== "string" || key.length === 0) {
    return key;
  }

  // Handle camelCase, snake_case, and dash-case, and spaces
  const words = key
    .split(/(?=[A-Z][a-z])|_|-|\s/)
    .filter((word) => word.length > 0);

  // Preserve acronyms and handle ID/UUID cases
  const result = words
    .map((word, idx) => {
      const upperWord = word.toUpperCase();

      // Preserve acronyms
      if (upperWord === word) {
        return word;
      }

      // return all caps for ID and UUID
      if (upperWord === "ID" || upperWord === "UUID") {
        return upperWord;
      }

      // capitalize the first letter of the first word, or all words if
      // titleCase is true.
      if (titleCase === true || idx === 0) {
        return capitalize(word);
      } else if (titleCase === false && idx > 0) {
        return word.toLowerCase();
      }

      return word;
    })
    .join(" ");

  // Special case for single-letter words
  if (result.length === 1) {
    return result.toUpperCase();
  }

  return result;
}

function isValidJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Sorts two strings alphabetically. Meant to be used with `Array.sort`.
 *
 * @param a - The first string to sort.
 * @param b - The second string to sort.
 * @returns -1 if a should come before b, 1 if a should come after b, and 0 if they are equal.
 */
function sortAlphabetically(a: string, b: string) {
  return a.localeCompare(b);
}

/**
 * The width of each character in a sans-serif font with a font size of 14px.
 *
 * This was painstakingly hand-measured.
 */
const SANS_SERIF_14_CHAR_WIDTH = {
  " ": 3.91,
  ".": 3.89,
  ",": 3.89,
  "-": 4.67,
  "0": 7.8,
  "1": 5.2,
  "2": 7.8,
  "3": 7.8,
  "4": 7.8,
  "5": 7.8,
  "6": 7.8,
  "7": 7.8,
  "8": 7.8,
  "9": 7.8,
  a: 7.8,
  b: 7.8,
  c: 7,
  d: 7.8,
  e: 7.8,
  f: 3.89,
  g: 7.8,
  h: 7.8,
  i: 3.13,
  j: 3.38,
  k: 7,
  l: 3.13,
  m: 11.67,
  n: 7.8,
  o: 7.8,
  p: 7.8,
  q: 7.8,
  r: 4.67,
  s: 7,
  t: 3.89,
  u: 7.8,
  v: 7,
  w: 10.13,
  x: 7,
  y: 7,
  z: 7,
  A: 9.34,
  B: 9.34,
  C: 10.13,
  D: 10.13,
  E: 9.34,
  F: 8.56,
  G: 10.89,
  H: 10.13,
  I: 3.89,
  J: 7,
  K: 9.34,
  L: 7.8,
  M: 11.67,
  N: 10.13,
  O: 10.89,
  P: 9.34,
  Q: 10.89,
  R: 10.13,
  S: 9.34,
  T: 8.56,
  U: 10.13,
  V: 9.34,
  W: 13.22,
  X: 9.34,
  Y: 9.34,
  Z: 8.56,
};

export {
  capitalize,
  isValidEmail,
  isValidUrl,
  formatCurrency,
  formatNumber,
  prettifyKey,
  isValidJSON,
  sortAlphabetically,
  SANS_SERIF_14_CHAR_WIDTH,
};
