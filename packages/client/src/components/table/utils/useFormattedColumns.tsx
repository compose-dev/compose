import { Row, ColumnDef, Column } from "@tanstack/react-table";
import {
  FormattedTableRow,
  INTERNAL_COLUMN_ID,
  TableColumnProp,
  TanStackTable,
  COLUMN_WIDTH_NUMERIC,
} from "./constants";
import { UI } from "@composehq/ts-public";
import { useMemo } from "react";
import { classNames } from "~/utils/classNames";
import { CheckboxRaw } from "~/components/checkbox";
import { HeaderCell, DataCell, RowCell, TableActionCell } from "../components";
import { RowSelections } from "./rowSelections";

type TanStackTableColumn = ColumnDef<FormattedTableRow>;

function formatColumn(
  column: TableColumnProp,
  density: UI.Table.Density,
  overflow: UI.Table.OverflowBehavior
): TanStackTableColumn {
  return {
    id: column.id,
    accessorKey: column.accessorKey,
    meta: {
      format: column.format,
      isDataColumn: true,
      label: column.label,
      tagColors: column.tagColors,
    },
    sortingFn:
      column.format === "json"
        ? (a, b, columnId) =>
            JSON.stringify(a.original[columnId]).localeCompare(
              JSON.stringify(b.original[columnId])
            )
        : "basic",
    sortDescFirst: UI.Table.shouldSortDescendingFirst(column.format),
    header: (header) => {
      function getStyle() {
        if (header.column.getIsPinned()) {
          if (column.pinnedWidth) {
            return {
              width: column.pinnedWidth,
              maxWidth: column.pinnedWidth,
            };
          }

          return {
            width:
              column.format === "json"
                ? COLUMN_WIDTH_NUMERIC.JSON
                : COLUMN_WIDTH_NUMERIC.DEFAULT,
            maxWidth:
              column.format === "json"
                ? COLUMN_WIDTH_NUMERIC.JSON
                : COLUMN_WIDTH_NUMERIC.DEFAULT,
          };
        }

        if (column.width) {
          return {
            flex: column.expand ? "1 1 0%" : undefined,
            width: column.width,
            minWidth: column.width,
          };
        }

        return {
          flex: "1 1 0%",
          minWidth:
            column.format === "json"
              ? COLUMN_WIDTH_NUMERIC.JSON
              : COLUMN_WIDTH_NUMERIC.DEFAULT,
        };
      }

      return (
        <HeaderCell
          sortDirection={header.column.getIsSorted()}
          nextSortDirection={header.column.getNextSortingOrder()}
          isSortable={header.column.getCanSort()}
          style={getStyle()}
          onClick={header.column.getToggleSortingHandler()}
          density={density}
        >
          <p>{column.label}</p>
        </HeaderCell>
      );
    },
    cell: ({
      row,
      column: tanstackColumn,
      table,
    }: {
      row: Row<FormattedTableRow>;
      column: Column<FormattedTableRow, unknown>;
      table: TanStackTable;
    }) => {
      return (
        <DataCell
          value={row.original[column.accessorKey]}
          column={column}
          meta={row.original[INTERNAL_COLUMN_ID.META]}
          isLastRow={row.index === table.getRowModel().rows.length - 1}
          density={density}
          tableOverflow={overflow}
          pinned={tanstackColumn.getIsPinned()}
        />
      );
    },
  };
}

function formatSelectColumn(
  disableRowSelection: boolean,
  allowMultiSelection: boolean,
  hasError: boolean,
  density: UI.Table.Density,
  toggleRowSelection: RowSelections.ToggleRowSelection
): TanStackTableColumn {
  return {
    id: INTERNAL_COLUMN_ID.SELECT,
    meta: {
      isDataColumn: false,
      format: undefined,
      label: undefined,
      tagColors: undefined,
    },
    enableGlobalFilter: false,
    header: ({ table }: { table: TanStackTable }) => {
      const hasOneRow = table.getRowModel().rows.length >= 1;

      if (!hasOneRow) {
        return <></>;
      }

      return (
        <HeaderCell density={density}>
          <CheckboxRaw
            enabled={table.getIsAllRowsSelected()}
            setEnabled={table.toggleAllRowsSelected}
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
          enabled={row.getIsSelected()}
          setEnabled={(enabled, event) => {
            const isShiftClick =
              event &&
              event.nativeEvent &&
              (event.nativeEvent as MouseEvent).shiftKey;

            toggleRowSelection(
              enabled,
              row.toggleSelected,
              row.original,
              isShiftClick,
              table,
              table.getState().rowSelection,
              table.setRowSelection
            );
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
    meta: {
      isDataColumn: false,
      format: undefined,
      label: undefined,
      tagColors: undefined,
    },
    enableGlobalFilter: false,
    header: ({ table }: { table: TanStackTable }) => {
      const hasOneRow = table.getRowModel().rows.length >= 1;

      if (!hasOneRow) {
        return <></>;
      }

      return (
        <HeaderCell density={density}>
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
          className={classNames("bg-brand-io group-hover:bg-brand-overlay", {
            "py-[11px]": density === "comfortable",
            "py-[7px]": density === "standard",
            "py-[5px]": density === "compact",
          })}
          isLastRow={row.index === table.getRowModel().rows.length - 1}
          density={density}
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
  actions: UI.Components.InputTable["model"]["properties"]["actions"],
  onTableRowActionHook: (rowIdx: number, actionIdx: number) => void,
  density: UI.Table.Density,
  overflow: UI.Table.OverflowBehavior,
  toggleRowSelection: RowSelections.ToggleRowSelection
) {
  const formattedColumns = useMemo(() => {
    const formatted: TanStackTableColumn[] = [];

    // Add the row selections column first
    if (enableRowSelection) {
      formatted.push(
        formatSelectColumn(
          disableRowSelection,
          allowMultiSelection,
          hasError,
          density,
          toggleRowSelection
        )
      );
    }

    // Then add all data columns
    columns.forEach((column) => {
      if (column.accessorKey === INTERNAL_COLUMN_ID.META) {
        return;
      }
      formatted.push(formatColumn(column, density, overflow));
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
    actions,
    onTableRowActionHook,
    density,
    overflow,
    toggleRowSelection,
  ]);

  return formattedColumns;
}

export { useFormattedColumns };
