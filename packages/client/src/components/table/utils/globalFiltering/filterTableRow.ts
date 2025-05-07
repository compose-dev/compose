import { UI } from "@composehq/ts-public";
import { FormattedTableRow } from "../constants";

const collator = new Intl.Collator(undefined, {
  usage: "search", // tuned for substring / equality
  sensitivity: "base", // ignore case AND accents
});
Object.freeze(collator); // improve bundling performance

function isEqual(
  cellValue: unknown,
  filterValue: unknown,
  columnFormat: UI.Table.ColumnFormat
) {
  if (cellValue === null || cellValue === undefined) {
    return false;
  }

  if (columnFormat === UI.Table.COLUMN_FORMAT.tag) {
    const cellValueArray = Array.isArray(cellValue) ? cellValue : [cellValue];

    if ((filterValue as unknown[]).length !== cellValueArray.length) {
      return false;
    }

    return (filterValue as unknown[]).every((filterElement) =>
      cellValueArray.includes(filterElement)
    );
  }

  switch (typeof cellValue) {
    case "string":
      return collator.compare(cellValue, filterValue as string) === 0;
    case "number":
    case "boolean":
      return collator.compare(String(cellValue), filterValue as string) === 0;
    case "object":
      // Handle tag columns
      if (Array.isArray(cellValue) && cellValue.length === 1) {
        return cellValue[0] === filterValue;
      }
      return (
        collator.compare(JSON.stringify(cellValue), filterValue as string) === 0
      );
    default:
      return cellValue === filterValue; // symbol, bigint, etc.
  }
}

function isAscii(s: string) {
  return /^[\p{ASCII}]*$/u.test(s);
}

function includes(cellValue: unknown, filterValue: string): boolean {
  if (cellValue === null || cellValue === undefined) {
    return false;
  }

  // Helper: substring search with Intl.Collator
  const collatorIncludes = (haystack: string, needle: string) => {
    // Fast ASCII‑only path
    if (isAscii(haystack) && isAscii(needle)) {
      return haystack.toLowerCase().includes(needle.toLowerCase());
    }

    const n = needle.length;
    for (let i = 0; i <= haystack.length - n; i++) {
      if (collator.compare(haystack.slice(i, i + n), needle) === 0) {
        return true;
      }
    }
    return false;
  };

  switch (typeof cellValue) {
    case "string":
      return collatorIncludes(cellValue, filterValue);
    case "number":
    case "boolean":
      return collatorIncludes(cellValue.toString(), filterValue);
    case "object":
      return collatorIncludes(JSON.stringify(cellValue), filterValue);
    default:
      return false;
  }
}

function isEmpty(cellValue: unknown) {
  return (
    cellValue === null ||
    cellValue === undefined ||
    cellValue === "" ||
    (Array.isArray(cellValue) && cellValue.length === 0) ||
    (typeof cellValue === "object" && Object.keys(cellValue).length === 0)
  );
}

function hasAny(cellValue: unknown, filterValue: unknown[]) {
  if (cellValue === null || cellValue === undefined) {
    return false;
  }

  const cellValueArray = Array.isArray(cellValue) ? cellValue : [cellValue];

  return cellValueArray.some((cellElement) =>
    filterValue.includes(cellElement)
  );
}

function hasAll(cellValue: unknown, filterValue: unknown[]) {
  if (cellValue === null || cellValue === undefined) {
    return false;
  }

  const cellValueArray = Array.isArray(cellValue) ? cellValue : [cellValue];

  return filterValue.every((filterElement) =>
    cellValueArray.includes(filterElement)
  );
}

function isGreaterThan(
  cellValue: unknown,
  filterValue: unknown,
  columnFormat: UI.Table.ColumnFormat | undefined
): boolean {
  if (cellValue === null || cellValue === undefined) {
    return false;
  }

  if (
    columnFormat === UI.Table.COLUMN_FORMAT.date ||
    columnFormat === UI.Table.COLUMN_FORMAT.datetime
  ) {
    return new Date(cellValue as string) > (filterValue as Date);
  }

  return (cellValue as number) > (filterValue as number);
}

function isGreaterThanOrEqual(
  cellValue: unknown,
  filterValue: unknown,
  columnFormat: UI.Table.ColumnFormat | undefined
): boolean {
  if (cellValue === null || cellValue === undefined) {
    return false;
  }

  if (
    columnFormat === UI.Table.COLUMN_FORMAT.date ||
    columnFormat === UI.Table.COLUMN_FORMAT.datetime
  ) {
    return new Date(cellValue as string) >= (filterValue as Date);
  }

  return (cellValue as number) >= (filterValue as number);
}

function isLessThan(
  cellValue: unknown,
  filterValue: unknown,
  columnFormat: UI.Table.ColumnFormat | undefined
): boolean {
  if (cellValue === null || cellValue === undefined) {
    return false;
  }

  if (
    columnFormat === UI.Table.COLUMN_FORMAT.date ||
    columnFormat === UI.Table.COLUMN_FORMAT.datetime
  ) {
    return new Date(cellValue as string) < (filterValue as Date);
  }

  return (cellValue as number) < (filterValue as number);
}

function isLessThanOrEqual(
  cellValue: unknown,
  filterValue: unknown,
  columnFormat: UI.Table.ColumnFormat | undefined
): boolean {
  if (cellValue === null || cellValue === undefined) {
    return false;
  }

  if (
    columnFormat === UI.Table.COLUMN_FORMAT.date ||
    columnFormat === UI.Table.COLUMN_FORMAT.datetime
  ) {
    return new Date(cellValue as string) <= (filterValue as Date);
  }

  return (cellValue as number) <= (filterValue as number);
}

function filterTableRow(
  row: FormattedTableRow,
  filterBy: NonNullable<UI.Table.AdvancedFilterModel<FormattedTableRow[]>>,
  columnFormatMap: Record<string, UI.Table.ColumnFormat | undefined>
): boolean {
  // Handle filter groups
  if ("logicOperator" in filterBy) {
    if (filterBy.logicOperator === UI.Table.COLUMN_FILTER_LOGIC_OPERATOR.AND) {
      // For AND, all nested filters must be true
      return filterBy.filters.every((filter) =>
        filterTableRow(row, filter, columnFormatMap)
      );
    } else {
      // For OR, at least one nested filter must be true
      return filterBy.filters.some((filter) =>
        filterTableRow(row, filter, columnFormatMap)
      );
    }
  }

  // Handle filter clauses
  const { key, operator, value: filterValue } = filterBy;

  // We asserted key is not null in getValidFilterModel
  const cellValue = row[key as keyof FormattedTableRow];

  switch (operator) {
    case UI.Table.COLUMN_FILTER_OPERATOR.IS: {
      const columnFormat =
        columnFormatMap[key] ?? UI.Table.COLUMN_FORMAT.string;

      return isEqual(cellValue, filterValue, columnFormat);
    }
    case UI.Table.COLUMN_FILTER_OPERATOR.IS_NOT: {
      const columnFormat =
        columnFormatMap[key] ?? UI.Table.COLUMN_FORMAT.string;

      return !isEqual(cellValue, filterValue, columnFormat);
    }
    case UI.Table.COLUMN_FILTER_OPERATOR.INCLUDES:
      return includes(cellValue, filterValue);
    case UI.Table.COLUMN_FILTER_OPERATOR.NOT_INCLUDES:
      return !includes(cellValue, filterValue);
    case UI.Table.COLUMN_FILTER_OPERATOR.IS_EMPTY:
      return isEmpty(cellValue);
    case UI.Table.COLUMN_FILTER_OPERATOR.IS_NOT_EMPTY:
      return !isEmpty(cellValue);
    case UI.Table.COLUMN_FILTER_OPERATOR.GREATER_THAN: {
      const columnFormat =
        columnFormatMap[key] ?? UI.Table.COLUMN_FORMAT.string;

      return isGreaterThan(cellValue, filterValue, columnFormat);
    }
    case UI.Table.COLUMN_FILTER_OPERATOR.GREATER_THAN_OR_EQUAL: {
      const columnFormat =
        columnFormatMap[key] ?? UI.Table.COLUMN_FORMAT.string;

      return isGreaterThanOrEqual(cellValue, filterValue, columnFormat);
    }
    case UI.Table.COLUMN_FILTER_OPERATOR.LESS_THAN: {
      const columnFormat =
        columnFormatMap[key] ?? UI.Table.COLUMN_FORMAT.string;

      return isLessThan(cellValue, filterValue, columnFormat);
    }
    case UI.Table.COLUMN_FILTER_OPERATOR.LESS_THAN_OR_EQUAL: {
      const columnFormat =
        columnFormatMap[key] ?? UI.Table.COLUMN_FORMAT.string;

      return isLessThanOrEqual(cellValue, filterValue, columnFormat);
    }
    case UI.Table.COLUMN_FILTER_OPERATOR.HAS_ANY:
      return hasAny(cellValue, filterValue);
    case UI.Table.COLUMN_FILTER_OPERATOR.NOT_HAS_ANY:
      return !hasAny(cellValue, filterValue);
    case UI.Table.COLUMN_FILTER_OPERATOR.HAS_ALL:
      return hasAll(cellValue, filterValue);
    case UI.Table.COLUMN_FILTER_OPERATOR.NOT_HAS_ALL:
      return !hasAll(cellValue, filterValue);
    default:
      return false;
  }
}

export { filterTableRow };
