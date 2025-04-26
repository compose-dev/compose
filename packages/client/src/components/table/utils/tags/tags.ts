import { UI } from "@composehq/ts-public";

function getUniqueValues(
  data: UI.Components.InputTable["model"]["properties"]["data"],
  key: string
): (string | number)[] {
  // Use Set for O(1) lookups and automatic deduplication
  const uniqueValues = new Set<string | number>();

  // Single pass through the data
  for (let i = 0; i < data.length; i++) {
    const value = data[i][key];

    // Handle arrays
    if (Array.isArray(value)) {
      for (let j = 0; j < value.length; j++) {
        const item = value[j];
        // Only add primitives
        if (typeof item === "string" || typeof item === "number") {
          uniqueValues.add(item);
        }

        if (typeof item === "boolean") {
          uniqueValues.add(item.toString());
        }
      }
      continue;
    }

    // Handle primitive values
    if (typeof value === "string" || typeof value === "number") {
      uniqueValues.add(value);
    }

    if (typeof value === "boolean") {
      uniqueValues.add(value.toString());
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
): Record<string | number, UI.Table.TagColor> {
  const result: Record<string | number, UI.Table.TagColor> = {};

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
      if (typeof value === "string" || typeof value === "number") {
        result[value] = color;
        colorUsage.set(color, (colorUsage.get(color) || 0) + 1);
      } else if (typeof value === "boolean") {
        result[value.toString()] = color;
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
    if (value in result) continue;

    if (defaultColor) {
      result[value] = defaultColor;
      continue;
    }

    // Check for semantic colors first
    const semanticColor =
      UI.Table.SEMANTIC_COLOR[value.toString().toLowerCase()];

    if (semanticColor) {
      result[value] = semanticColor;
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

    result[value] = selectedColor;
    colorUsage.set(selectedColor, minUsage + 1);
  }

  return result;
}

export { guessTagColors };
