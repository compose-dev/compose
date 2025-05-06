import { Row } from "@tanstack/react-table";
import { TanStackTable, FormattedTableRow } from "./constants";

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  let stringValue = String(value);

  // If the value is an object or array, JSON.stringify might be a reasonable default
  // You might want a more specific string representation depending on your data
  if (typeof value === "object") {
    stringValue = JSON.stringify(value);
  }

  // Check if the string contains characters that require quoting
  const needsQuoting =
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n");

  if (needsQuoting) {
    // Escape existing double quotes by replacing them with two double quotes
    const escapedValue = stringValue.replace(/"/g, '""');
    // Enclose the entire string in double quotes
    return `"${escapedValue}"`;
  }

  // Return the original string if no special characters are found
  return stringValue;
}

function generateAndDownloadCSV(
  table: TanStackTable,
  rowsToDownload: Row<FormattedTableRow>[],
  filename: string,
  includeHiddenColumns: boolean
) {
  const filteredColumns = table.getAllLeafColumns().filter((col) => {
    if (!col.columnDef.meta?.isDataColumn) {
      return false;
    }

    if (!includeHiddenColumns && !col.getIsVisible()) {
      return false;
    }

    return true;
  });

  const headers = filteredColumns.map(
    (column) => column.columnDef.meta?.label ?? "Unknown"
  );
  const headerIds = filteredColumns.map((column) => column.id);

  const data = rowsToDownload.map((row) => {
    return headerIds.map((headerId) => escapeCsvCell(row.original[headerId]));
  });

  const csvContent = [headers, ...data].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `${filename}.csv`;

  a.click();
}

export { generateAndDownloadCSV };
