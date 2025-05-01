import { Row, ColumnDef } from "@tanstack/react-table";
import {
  FormattedTableRow,
  INTERNAL_COLUMN_ID,
  TableColumnProp,
  TanStackTable,
} from "./constants";
import { UI } from "@composehq/ts-public";
import { MutableRefObject, useMemo, useRef } from "react";
import { classNames } from "~/utils/classNames";
import { CheckboxRaw } from "~/components/checkbox";
import { HeaderCell, DataCell, RowCell, TableActionCell } from "../components";

type TanStackTableColumn = ColumnDef<FormattedTableRow>;

function formatColumn(
  column: TableColumnProp,
  density: UI.Table.Density
): TanStackTableColumn {
  return {
    ...column,
    sortingFn:
      column.format === "json"
        ? (a, b, columnId) =>
            JSON.stringify(a.original[columnId]).localeCompare(
              JSON.stringify(b.original[columnId])
            )
        : "basic",
    sortDescFirst: UI.Table.shouldSortDescendingFirst(column.format),
    header: (header) => {
      return (
        <HeaderCell
          sortDirection={header.column.getIsSorted()}
          nextSortDirection={header.column.getNextSortingOrder()}
          isSortable={header.column.getCanSort()}
          className={classNames({
            "flex-1": column.expand === true || !column.width,
            "min-w-48": !column.width && column.format !== "json",
            "min-w-72": !column.width && column.format === "json",
          })}
          style={
            column.width ? { width: column.width, minWidth: column.width } : {}
          }
          onClick={header.column.getToggleSortingHandler()}
          density={density}
        >
          <p>{column.label}</p>
        </HeaderCell>
      );
    },
    cell: ({
      row,
      table,
    }: {
      row: Row<FormattedTableRow>;
      table: TanStackTable;
    }) => {
      return (
        <DataCell
          value={row.original[column.accessorKey]}
          column={column}
          meta={row.original[INTERNAL_COLUMN_ID.META]}
          isLastRow={row.index === table.getRowModel().rows.length - 1}
          density={density}
        />
      );
    },
  };
}

function formatSelectColumn(
  disableRowSelection: boolean,
  allowMultiSelection: boolean,
  offset: number,
  hasError: boolean,
  density: UI.Table.Density,
  lastSelectedIndex: MutableRefObject<number | null>
): TanStackTableColumn {
  return {
    id: INTERNAL_COLUMN_ID.SELECT,
    header: ({ table }: { table: TanStackTable }) => {
      const hasOneRow = table.getRowModel().rows.length >= 1;

      if (!hasOneRow) {
        return <></>;
      }

      return (
        <HeaderCell density={density}>
          <CheckboxRaw
            enabled={
              Object.keys(table.getState().rowSelection).length >=
              table.getRowCount()
            }
            setEnabled={(isChecked) => {
              if (!isChecked) {
                table.setRowSelection({});
              } else {
                const totalRecords = table.getRowCount();

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
      table: TanStackTable;
    }) => (
      <RowCell
        className={classNames("select-none", {
          "pt-2": density === "compact",
          "pt-3": density === "standard",
          "pt-4": density === "comfortable",
        })}
        isLastRow={row.index === table.getRowModel().rows.length - 1}
        overflow="dynamic"
        density={density}
      >
        <CheckboxRaw
          enabled={table.getState().rowSelection[row.index + offset] === true}
          setEnabled={(enabled, event) => {
            const currentSelectedIndex = row.index + offset;
            const isShiftClick =
              event &&
              event.nativeEvent &&
              (event.nativeEvent as MouseEvent).shiftKey;

            if (
              allowMultiSelection &&
              isShiftClick &&
              lastSelectedIndex.current !== null &&
              lastSelectedIndex.current !== currentSelectedIndex
            ) {
              const start = Math.min(
                lastSelectedIndex.current,
                currentSelectedIndex
              );
              const end = Math.max(
                lastSelectedIndex.current,
                currentSelectedIndex
              );
              const newSelection = { ...table.getState().rowSelection };
              for (let i = start; i <= end; i++) {
                newSelection[i] = true;
              }
              table.setRowSelection(newSelection);
            } else {
              if (enabled) {
                const newSelection = allowMultiSelection
                  ? {
                      ...table.getState().rowSelection,
                      [currentSelectedIndex]: true,
                    }
                  : { [currentSelectedIndex]: true };
                table.setRowSelection(newSelection);
                lastSelectedIndex.current = currentSelectedIndex;
              } else {
                const newRowSelections = {
                  ...table.getState().rowSelection,
                };
                delete newRowSelections[currentSelectedIndex];
                table.setRowSelection(newRowSelections);
                lastSelectedIndex.current = null;
              }
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
  onTableRowActionHook: (rowIdx: number, actionIdx: number) => void,
  density: UI.Table.Density
): TanStackTableColumn {
  return {
    id: INTERNAL_COLUMN_ID.ACTION,
    header: ({ table }: { table: TanStackTable }) => {
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
          density={density}
        >
          <TableActionCell
            actions={actions}
            hidden={true}
            onClick={() => {}}
            density={density}
          />
        </HeaderCell>
      );
    },
    cell: ({
      row,
      table,
    }: {
      row: Row<FormattedTableRow>;
      table: TanStackTable;
    }) => {
      return (
        <RowCell
          className={classNames(
            "sticky z-10 right-0 bg-brand-io border-l border-brand-neutral group-hover:bg-brand-overlay",
            {
              "py-[11px]": density === "comfortable",
              "py-[7px]": density === "standard",
              "py-[5px]": density === "compact",
            }
          )}
          isLastRow={row.index === table.getRowModel().rows.length - 1}
          density={density}
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
            density={density}
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
  offset: number,
  actions: UI.Components.InputTable["model"]["properties"]["actions"],
  onTableRowActionHook: (rowIdx: number, actionIdx: number) => void,
  density: UI.Table.Density
) {
  // Note: our implementation here does not account for external changes to
  // row selection state. e.g. select a row, selection state changes from
  // SDK, shift click another row, the shift click will "work" and select
  // all the rows between the last selected row and the current row, instead
  // of having been reset when the external change occurred. In practice,
  // this is quite a small issue and not worth the complexity of accounting
  // for.
  const lastSelectedIndex = useRef<number | null>(null);

  const formattedColumns = useMemo(() => {
    const formatted: TanStackTableColumn[] = [];

    // Add the row selections column first
    if (enableRowSelection) {
      formatted.push(
        formatSelectColumn(
          disableRowSelection,
          allowMultiSelection,
          offset,
          hasError,
          density,
          lastSelectedIndex
        )
      );
    }

    // Then add all data columns
    columns.forEach((column) => {
      if (column.accessorKey === INTERNAL_COLUMN_ID.META) {
        return;
      }
      formatted.push(formatColumn(column, density));
    });

    // Finally, add the actions column
    if (actions && actions.length > 0) {
      formatted.push(
        formatActionColumn(actions, onTableRowActionHook, density)
      );
    }

    return formatted;
  }, [
    columns,
    enableRowSelection,
    allowMultiSelection,
    hasError,
    disableRowSelection,
    offset,
    actions,
    onTableRowActionHook,
    density,
  ]);

  return formattedColumns;
}

export { useFormattedColumns };
