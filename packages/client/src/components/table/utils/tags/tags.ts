import { UI } from "@composehq/ts-public";

/**
 * Format tag colors for fast lookup.
 *
 * Since table tags support boolean values, we format
 * as strings to include in the lookup, but preseve the
 * original value for filtering.
 */
type FormattedTagColors = Record<
  string,
  {
    color: UI.Table.TagColor;
    originalValue: string | number | boolean;
  }
>;

function getUniqueValues(
  tableData: UI.Components.InputTable["model"]["properties"]["data"],
  columnKey: string
): (string | number | boolean)[] {
  // Use Set for O(1) lookups and automatic deduplication
  const uniqueValues = new Set<string | number | boolean>();

  // Single pass through the data
  for (let i = 0; i < tableData.length; i++) {
    const value = tableData[i][columnKey];

    // Handle arrays
    if (Array.isArray(value)) {
      for (let j = 0; j < value.length; j++) {
        const item = value[j];
        // Only add primitives
        if (
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean"
        ) {
          uniqueValues.add(item);
        }
      }
      continue;
    }

    // Handle primitive values
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      uniqueValues.add(value);
    }
  }

  // Convert Set to Array only once at the end
  return Array.from(uniqueValues);
}

function guessTagColors(
  presets: Exclude<
    UI.Table.AdvancedColumn<UI.Table.DataRow[]>["tagColors"],
    undefined
  >,
  data: UI.Components.InputTable["model"]["properties"]["data"],
  key: string
): FormattedTagColors {
  const result: FormattedTagColors = {};

  const uniqueValues = getUniqueValues(data, key);
  const colorUsage = new Map<UI.Table.TagColor, number>();
  let defaultColor: UI.Table.TagColor | undefined = undefined;

  // First pass: collect assigned values and initialize color usage
  for (let i = 0; i < Object.keys(presets).length; i++) {
    const color = Object.keys(presets)[i] as keyof typeof presets;

    if (color === "_default") {
      defaultColor = presets["_default"];
      continue;
    }

    const cellValues = presets[color];
    const cellValueArray = Array.isArray(cellValues)
      ? cellValues
      : [cellValues];

    for (const value of cellValueArray) {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        result[value.toString()] = { color, originalValue: value };
        colorUsage.set(color, (colorUsage.get(color) || 0) + 1);
      }
    }
  }

  // Initialize color usage for unused colors
  for (const color of Object.values(UI.Table.TAG_COLOR)) {
    if (!colorUsage.has(color)) {
      colorUsage.set(color, 0);
    }
  }

  // Second pass: assign colors to unassigned values
  for (const value of uniqueValues) {
    if (value.toString() in result) {
      continue;
    }

    if (defaultColor) {
      result[value.toString()] = {
        color: defaultColor,
        originalValue: value,
      };
      continue;
    }

    // Check for semantic colors first
    const semanticColor =
      UI.Table.SEMANTIC_COLOR[value.toString().toLowerCase()];

    if (semanticColor) {
      result[value.toString()] = {
        color: semanticColor,
        originalValue: value,
      };
      colorUsage.set(semanticColor, (colorUsage.get(semanticColor) || 0) + 1);
      continue;
    }

    // Find least used color
    let minUsage = Infinity;
    let selectedColor = Object.values(UI.Table.TAG_COLOR)[0];

    for (const [color, usage] of colorUsage) {
      if (usage < minUsage) {
        minUsage = usage;
        selectedColor = color;
      }
    }

    result[value.toString()] = {
      color: selectedColor,
      originalValue: value,
    };
    colorUsage.set(selectedColor, minUsage + 1);
  }

  return result;
}

export type { FormattedTagColors };
export { guessTagColors, getUniqueValues };
