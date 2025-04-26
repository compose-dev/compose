import { u } from "@compose/ts";
import { UI } from "@composehq/ts-public";
import TableComponent from "../Table";

function guessColumnFormat(
  data: UI.Components.InputTable["model"]["properties"]["data"],
  key: string
): React.ComponentProps<typeof TableComponent>["columns"][number]["format"] {
  // Check the first 10 rows (or all rows if less than 10)
  const rowsToCheck = Math.min(10, data.length);

  if (rowsToCheck === 0) {
    return undefined;
  }

  const type = typeof data[0][key];
  let isDate =
    typeof data[0][key] === "string" &&
    u.date.isValidISODateString(data[0][key]);

  for (let i = 0; i < rowsToCheck; i++) {
    const value = data[i][key];

    // If the key doesn't exist or the type doesn't match,
    // we can't infer the format.
    if (!(key in data[i]) || typeof value !== type) {
      return undefined;
    }

    if (
      typeof value === "string" &&
      isDate &&
      !u.date.isValidISODateString(value)
    ) {
      isDate = false;
    }
  }

  if (type === "boolean") {
    return "boolean";
  }

  if (isDate) {
    return "date";
  }

  if (type === "number") {
    return "number";
  }

  return undefined;
}

export { guessColumnFormat };
