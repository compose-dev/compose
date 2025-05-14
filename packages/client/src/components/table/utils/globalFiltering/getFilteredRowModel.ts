// getAdvancedFilteredRowModel.ts
import type { RowModel, Table, Row } from "@tanstack/react-table";
import { memo, getMemoOptions, createRow } from "@tanstack/react-table";
import { FormattedTableRow, INTERNAL_COLUMN_ID } from "../constants";
import { UI } from "@composehq/ts-public";
import { searchTableRow } from "./searchTableRow";
import { filterTableRow } from "./filterTableRow";

function filterRowModelFromLeafs(
  rowsToFilter: Row<FormattedTableRow>[],
  filterRow: (row: Row<FormattedTableRow>) => boolean,
  table: Table<FormattedTableRow>
): RowModel<FormattedTableRow> {
  const newFilteredFlatRows: Row<FormattedTableRow>[] = [];
  const newFilteredRowsById: Record<string, Row<FormattedTableRow>> = {};
  const maxDepth = table.options.maxLeafRowFilterDepth ?? 100;

  const recurseFilterRows = (
    rowsToFilter: Row<FormattedTableRow>[],
    depth = 0
  ) => {
    const rows: Row<FormattedTableRow>[] = [];

    // Filter from children up first
    for (let i = 0; i < rowsToFilter.length; i++) {
      let row = rowsToFilter[i]!;

      const newRow = createRow(
        table,
        row.id,
        row.original,
        row.index,
        row.depth,
        undefined,
        row.parentId
      );
      newRow.columnFilters = row.columnFilters;

      if (row.subRows?.length && depth < maxDepth) {
        newRow.subRows = recurseFilterRows(row.subRows, depth + 1);
        row = newRow;

        if (filterRow(row) && !newRow.subRows.length) {
          rows.push(row);
          newFilteredRowsById[row.id] = row;
          newFilteredFlatRows.push(row);
          continue;
        }

        if (filterRow(row) || newRow.subRows.length) {
          rows.push(row);
          newFilteredRowsById[row.id] = row;
          newFilteredFlatRows.push(row);
          continue;
        }
      } else {
        row = newRow;
        if (filterRow(row)) {
          rows.push(row);
          newFilteredRowsById[row.id] = row;
          newFilteredFlatRows.push(row);
        }
      }
    }

    return rows;
  };

  return {
    rows: recurseFilterRows(rowsToFilter),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById,
  };
}

// Custom implementation of tanstack table getFilteredRowModel that supports
// our own search + advanced filtering.
function getFilteredRowModel(opts: {
  getSearchQuery: () => string | null;
  getAdvancedFilter: () => UI.Table.AdvancedFilterModel<FormattedTableRow[]>;
}) {
  return (table: Table<FormattedTableRow>) =>
    memo(
      () => [
        table.getPreFilteredRowModel(), // ➜ base rows
        opts.getSearchQuery(),
        opts.getAdvancedFilter(),
      ],
      (preRowModel, searchQuery, advFilter): RowModel<FormattedTableRow> => {
        // ✧ Fast exit – no filters, return the untouched model
        if (!searchQuery && !advFilter) {
          return preRowModel;
        }

        const columns: {
          id: string;
          format: UI.Table.ColumnFormat | undefined;
        }[] = [];
        const columnFormatMap: Record<
          string,
          UI.Table.ColumnFormat | undefined
        > = {};

        table.getAllColumns().forEach((col) => {
          if (
            col.id !== INTERNAL_COLUMN_ID.ACTION &&
            col.id !== INTERNAL_COLUMN_ID.SELECT
          ) {
            columns.push({ id: col.id, format: col.columnDef.meta?.format });
            columnFormatMap[col.id] = col.columnDef.meta?.format;
          }
        });

        const formattedSearchQuery = searchQuery
          ? searchQuery.toLowerCase()
          : null;

        const filterRowsImpl = (row: Row<FormattedTableRow>) => {
          if (formattedSearchQuery) {
            if (!searchTableRow(row.original, columns, formattedSearchQuery)) {
              return false;
            }
          }

          if (advFilter) {
            if (!filterTableRow(row.original, advFilter, columnFormatMap)) {
              return false;
            }
          }

          return true;
        };

        return filterRowModelFromLeafs(preRowModel.rows, filterRowsImpl, table);
      },
      // Still let TanStack memo‑optimise & auto‑reset page index
      getMemoOptions(
        table.options,
        "debugTable",
        "advancedFilteredRowModel",
        () => table._autoResetPageIndex()
      )
    );
}

export { getFilteredRowModel };
