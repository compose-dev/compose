import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  Updater,
  Cell,
  getSortedRowModel,
  ColumnPinningState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useCallback, useRef, useState } from "react";
import { classNames } from "~/utils/classNames";
import { useThrottledCallback } from "~/utils/useThrottledCallback";
import { IOComponent } from "~/components/io-component";
import { UI } from "@composehq/ts-public";
import {
  useSearch,
  useFormattedData,
  useFormattedColumns,
  type FormattedTableRow,
  type TableColumnProp,
  INTERNAL_COLUMN_ID,
  useSortingState,
} from "./utils";
import { ColumnHeaderRow, FooterRow, ToolbarRow } from "./components";

function Table({
  id,
  data,
  columns,
  actions,
  totalRecords,
  onTablePageChangeHook,
  onTableRowActionHook,
  pageSize = UI.Table.DEFAULT_PAGE_SIZE,
  offset = UI.Table.DEFAULT_OFFSET,
  enableRowSelection = false,
  rowSelections = {},
  setRowSelections = () => {},
  tableClassName = "",
  allowMultiSelection = false,
  hasError = false,
  errorMessage = null,
  disableRowSelection = false,
  disableSearch = false,
  serverSearchQuery = UI.Table.DEFAULT_SEARCH_QUERY,
  paginated = UI.Table.DEFAULT_PAGINATED,
  loading = false,
  height,
  sortBy,
  sortable = UI.Table.SORT_OPTION.MULTI,
}: {
  id: string;
  data: UI.Components.InputTable["model"]["properties"]["data"];
  columns: TableColumnProp[];
  actions: UI.Components.InputTable["model"]["properties"]["actions"];
  totalRecords: number;
  onTablePageChangeHook: (
    searchQuery: string | null,
    offset: number,
    pageSize: number,
    sortBy: UI.Table.PageChangeParams<UI.Table.DataRow[]>["sortBy"]
  ) => void;
  onTableRowActionHook: (rowIdx: number, actionIdx: number) => void;
  pageSize?: number;
  offset?: number;
  tableClassName?: string;
  enableRowSelection?: boolean;
  rowSelections: Record<string, boolean>;
  setRowSelections: (rowSelections: Record<string, boolean>) => void;
  allowMultiSelection?: boolean;
  hasError?: boolean;
  errorMessage?: string | null;
  disableRowSelection?: boolean;
  disableSearch?: boolean;
  serverSearchQuery?: string | null;
  paginated?: boolean;
  loading?: UI.Stale.Option;
  height?: string;
  sortBy?: UI.Components.InputTable["model"]["properties"]["sortBy"];
  sortable?: UI.Table.SortOption;
}) {
  const fixedHeight = paginated || totalRecords > 35;

  const [searchQuery, setSearchQuery] = useState(serverSearchQuery);
  const { throttledCallback: setGlobalFilter } = useThrottledCallback(
    (value: string) => {
      table.setGlobalFilter(value);
    },
    300
  );

  const customFilterFn = useSearch(columns);
  const formattedData = useFormattedData(data, columns);
  const { sort, setSort, sortByForServer, resetSortingStateToInitial } =
    useSortingState(columns, sortBy, sortable, (sortBy) => {
      if (paginated) {
        // Always reset offset to 0 when sorting changes.
        onTablePageChangeHook(searchQuery, 0, pageSize, sortBy);
      }
    });
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: enableRowSelection ? [INTERNAL_COLUMN_ID.SELECT] : [],
    right: [],
  });
  const formattedColumns = useFormattedColumns(
    columns,
    enableRowSelection,
    allowMultiSelection,
    hasError,
    disableRowSelection,
    totalRecords,
    offset,
    actions,
    onTableRowActionHook
  );

  const handleRowSelectionChange = useCallback(
    (newRowSelections: Updater<Record<string, boolean>>) => {
      if (typeof newRowSelections === "function") {
        newRowSelections = newRowSelections(rowSelections);
      }
      setRowSelections(newRowSelections);
    },
    [rowSelections, setRowSelections]
  );

  const table = useReactTable({
    // BASE SETUP
    data: formattedData,
    columns: formattedColumns,
    getCoreRowModel: getCoreRowModel(),

    // STATE
    state: {
      rowSelection: rowSelections,
      sorting: sort,
      columnPinning,
    },
    initialState: {
      // Set initial state to properly leverage tanstack table's "resetColumnVisibility"
      // function, which will reset back to this initial state.
      columnVisibility: columns.reduce(
        (acc, column) => {
          acc[column.id] = !column.hidden;
          return acc;
        },
        {} as Record<string, boolean>
      ),
    },

    // COLUMN PINNING
    onColumnPinningChange: setColumnPinning,

    // SEARCH
    filterFns: {
      fuzzy: customFilterFn,
    },
    globalFilterFn: "fuzzy",
    getFilteredRowModel: getFilteredRowModel(),

    // ROW SELECTION
    enableMultiRowSelection: allowMultiSelection,
    enableRowSelection,
    onRowSelectionChange: handleRowSelectionChange,

    // SORTING
    enableSorting:
      sortable === UI.Table.SORT_OPTION.SINGLE ||
      sortable === UI.Table.SORT_OPTION.MULTI,
    enableMultiSort: sortable === UI.Table.SORT_OPTION.MULTI,
    getSortedRowModel: getSortedRowModel(),
    manualSorting: paginated,
    onSortingChange: setSort,
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 41, // Adjust this value based on your row height
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 15,
  });

  const scrollToTop = useCallback(() => {
    rowVirtualizer.scrollToOffset(0, {
      behavior: "auto",
    });
  }, [rowVirtualizer]);

  return (
    <div className="w-full">
      <div
        className="flex flex-col overflow-x-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        <div
          className={classNames(
            "flex flex-col justify-between w-full rounded-brand bg-brand-io relative overflow-clip border border-brand-neutral border-b-0",
            {
              "table-fixed-height": fixedHeight,
              "table-dynamic-height": !fixedHeight,
            },
            tableClassName
          )}
          style={{ height }}
        >
          <ToolbarRow
            tableId={id}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setTableFilter={(val) => {
              setGlobalFilter(val || "");
            }}
            serverSearchQuery={serverSearchQuery}
            loading={loading}
            paginated={paginated}
            onTablePageChangeHook={() => {
              onTablePageChangeHook(
                searchQuery,
                0, // reset to first page
                pageSize,
                sortByForServer.current
              );
            }}
            table={table}
            columns={columns}
            disableSearch={disableSearch}
            sortable={sortable}
            offset={offset}
            rowCount={rows.length}
            totalRecords={totalRecords}
            resetSortingStateToInitial={resetSortingStateToInitial}
          />
          <div
            className="flex flex-col overflow-auto w-full h-full border-t border-brand-neutral"
            style={{
              scrollbarWidth: "thin",
            }}
            ref={tableContainerRef}
          >
            {/* 
            - min-w-full: allows the table to expand to fill the full width
            there aren't enough rows to naturally fill the width.
            - w-max: allows the table row container to expand to fill the width
            of the row when there is horizontal scroll and thus the row stretches
            beyond the visible content area.
            */}
            <div className="border-brand-neutral w-max min-w-full">
              <ColumnHeaderRow table={table} />
              <div
                className="w-full flex flex-col"
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <div
                      key={row.id}
                      data-index={virtualRow.index}
                      ref={(node) => rowVirtualizer.measureElement(node)}
                      className="w-full flex border-b-brand border-brand-neutral bg-brand-io absolute hover:bg-brand-overlay group"
                      style={{
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableRowsMemo
                          key={cell.id}
                          cell={cell}
                          // Since we memoize the table row, we need to directly pass the selection state
                          // so that the checkbox re-renders when the selection state changes!
                          isSelected={
                            table.getState().rowSelection[row.index + offset]
                          }
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
            {rows.length === 0 && (
              <p className="p-2 bg-brand-io text-brand-neutral-2">
                {loading ? "Loading..." : "No data to display"}
              </p>
            )}
          </div>
          <FooterRow
            paginated={paginated}
            loading={loading}
            offset={offset}
            pageSize={pageSize}
            totalRecords={totalRecords}
            onTablePageChangeHook={(offset, pageSize) => {
              onTablePageChangeHook(
                searchQuery,
                offset,
                pageSize,
                sortByForServer.current
              );
            }}
            scrollToTop={scrollToTop}
            rowCount={rows.length}
          />
          <div className="absolute bottom-0 left-0 w-full border-b border-brand-neutral rounded-brand pointer-events-none " />
        </div>
        {hasError && errorMessage !== null && (
          <IOComponent.Error>{errorMessage}</IOComponent.Error>
        )}
      </div>
    </div>
  );
}

function TableRows({
  cell,
}: {
  cell: Cell<FormattedTableRow, unknown>;
  // This is a prop purely to force a re-render when the selection state
  // changes.
  isSelected: boolean;
}) {
  return flexRender(cell.column.columnDef.cell, cell.getContext());
}

const TableRowsMemo = React.memo(TableRows);

export default Table;
