import { Table as TanStackTable, Row, ColumnDef } from "@tanstack/react-table";
import {
  FormattedTableRow,
  INTERNAL_COLUMN_ID,
  TableColumnProp,
} from "./constants";
import { UI } from "@composehq/ts-public";
import { useMemo } from "react";
import { classNames } from "~/utils/classNames";
import { CheckboxRaw } from "~/components/checkbox";
import { HeaderCell, DataCell, RowCell, TableActionCell } from "../components";

type TanStackTableColumn = ColumnDef<FormattedTableRow>;

function formatColumn(column: TableColumnProp): TanStackTableColumn {
  return {
    ...column,
    sortingFn: "basic",
    sortDescFirst: UI.Table.shouldSortDescendingFirst(column.format),
    header: (header) => {
      return (
        <HeaderCell
          sortDirection={header.column.getIsSorted()}
          nextSortDirection={header.column.getNextSortingOrder()}
          isSortable={header.column.getCanSort()}
          className={classNames({
            "min-w-48 flex-1": !column.width,
            "flex-1": column.expand === true,
          })}
          style={
            column.width ? { width: column.width, minWidth: column.width } : {}
          }
          onClick={header.column.getToggleSortingHandler()}
        >
          {column.label}
        </HeaderCell>
      );
    },
    cell: ({
      row,
      table,
    }: {
      row: Row<FormattedTableRow>;
      table: TanStackTable<FormattedTableRow>;
    }) => {
      return (
        <DataCell
          value={row.original[column.accessorKey]}
          column={column}
          meta={row.original[INTERNAL_COLUMN_ID.META]}
          isLastRow={row.index === table.getRowModel().rows.length - 1}
        />
      );
    },
  };
}

function formatSelectColumn(
  totalRecords: number,
  disableRowSelection: boolean,
  allowMultiSelection: boolean,
  offset: number,
  hasError: boolean
): TanStackTableColumn {
  return {
    id: INTERNAL_COLUMN_ID.SELECT,
    header: ({ table }: { table: TanStackTable<FormattedTableRow> }) => {
      const hasOneRow = table.getRowModel().rows.length >= 1;

      if (!hasOneRow) {
        return <></>;
      }

      return (
        <HeaderCell>
          <CheckboxRaw
            enabled={
              Object.keys(table.getState().rowSelection).length >= totalRecords
            }
            setEnabled={(isChecked) => {
              if (!isChecked) {
                table.setRowSelection({});
              } else {
                const obj: Record<number, boolean> = {};
                for (let i = 0; i < totalRecords; i++) {
                  obj[i] = true;
                }
                table.setRowSelection(obj);
              }
            }}
            disabled={disableRowSelection || !allowMultiSelection}
          />
        </HeaderCell>
      );
    },
    cell: ({
      row,
      table,
    }: {
      row: Row<FormattedTableRow>;
      table: TanStackTable<FormattedTableRow>;
    }) => (
      <RowCell
        className="pt-3"
        isLastRow={row.index === table.getRowModel().rows.length - 1}
        overflow="dynamic"
      >
        <CheckboxRaw
          enabled={table.getState().rowSelection[row.index + offset] === true}
          setEnabled={(enabled) => {
            if (enabled) {
              if (!row.getCanMultiSelect()) {
                table.setRowSelection({
                  [row.index + offset]: enabled,
                });
              } else {
                table.setRowSelection({
                  ...table.getState().rowSelection,
                  [row.index + offset]: enabled,
                });
              }
            } else {
              const newRowSelections = {
                ...table.getState().rowSelection,
              };
              delete newRowSelections[row.index + offset];
              table.setRowSelection(newRowSelections);
            }
          }}
          disabled={disableRowSelection}
          hasError={hasError}
        />
      </RowCell>
    ),
  };
}

function formatActionColumn(
  actions: NonNullable<
    UI.Components.InputTable["model"]["properties"]["actions"]
  >,
  onTableRowActionHook: (rowIdx: number, actionIdx: number) => void
): TanStackTableColumn {
  return {
    id: INTERNAL_COLUMN_ID.ACTION,
    header: ({ table }: { table: TanStackTable<FormattedTableRow> }) => {
      const hasOneRow = table.getRowModel().rows.length >= 1;

      if (!hasOneRow) {
        return <></>;
      }

      return (
        <HeaderCell
          className="sticky z-10 right-0 border-l border-brand-neutral"
          /* 
          Fixes a 2px visual gap that appears between the rightmost sticky column and the table edge 
          at arbritary screen widths/zooms in Chromium due to subpixel compositing issues with position: sticky. 

          - `contain: paint` isolates each sticky cell into its own paint layer to reduce bleed-through.
          - `box-shadow: 1px 0 0 white` overlays a solid line to visually mask the remaining gap 
            without affecting layout or causing issues at other zoom levels.

          This is a visual patch for a known rendering quirk — not a layout fix.
          */
          style={{
            contain: "paint",
            boxShadow: "1px 0 0 var(--brand-bg-overlay)",
          }}
        >
          <TableActionCell actions={actions} hidden={true} onClick={() => {}} />
        </HeaderCell>
      );
    },
    cell: ({
      row,
      table,
    }: {
      row: Row<FormattedTableRow>;
      table: TanStackTable<FormattedTableRow>;
    }) => {
      return (
        <RowCell
          className="sticky z-10 right-0 bg-brand-io border-l border-brand-neutral group-hover:bg-brand-overlay !py-[7px]"
          isLastRow={row.index === table.getRowModel().rows.length - 1}
          /* 
          Fixes a 1px visual gap that appears between the rightmost sticky column and the table edge 
          at 100% zoom in Chromium due to subpixel compositing issues with position: sticky. 

          - `contain: paint` isolates each sticky cell into its own paint layer to reduce bleed-through.

          This is a visual patch for a known rendering quirk — not a layout fix.
          */
          style={{
            contain: "paint",
          }}
          overflow="dynamic"
        >
          <TableActionCell
            actions={actions}
            onClick={(actionIdx) => {
              onTableRowActionHook(row.index, actionIdx);
            }}
          />
        </RowCell>
      );
    },
  };
}

function useFormattedColumns(
  columns: TableColumnProp[],
  enableRowSelection: boolean,
  allowMultiSelection: boolean,
  hasError: boolean,
  disableRowSelection: boolean,
  totalRecords: number,
  offset: number,
  actions: UI.Components.InputTable["model"]["properties"]["actions"],
  onTableRowActionHook: (rowIdx: number, actionIdx: number) => void
) {
  const formattedColumns = useMemo(() => {
    const formatted: TanStackTableColumn[] = [];

    // Add the row selections column first
    if (enableRowSelection) {
      formatted.push(
        formatSelectColumn(
          totalRecords,
          disableRowSelection,
          allowMultiSelection,
          offset,
          hasError
        )
      );
    }

    // Then add all data columns
    columns.forEach((column) => {
      if (column.accessorKey === INTERNAL_COLUMN_ID.META) {
        return;
      }
      formatted.push(formatColumn(column));
    });

    // Finally, add the actions column
    if (actions && actions.length > 0) {
      formatted.push(formatActionColumn(actions, onTableRowActionHook));
    }

    return formatted;
  }, [
    columns,
    enableRowSelection,
    allowMultiSelection,
    hasError,
    disableRowSelection,
    totalRecords,
    offset,
    actions,
    onTableRowActionHook,
  ]);

  return formattedColumns;
}

export { useFormattedColumns };
