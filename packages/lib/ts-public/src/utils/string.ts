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

export { capitalize, prettifyKey };
