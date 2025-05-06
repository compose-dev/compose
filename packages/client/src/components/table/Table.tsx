import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  Updater,
  Cell,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useCallback, useEffect, useRef } from "react";
import { classNames } from "~/utils/classNames";
import { IOComponent } from "~/components/io-component";
import { UI } from "@composehq/ts-public";
import {
  useFormattedData,
  useFormattedColumns,
  type FormattedTableRow,
  type TableColumnProp,
  useSorting,
  usePagination,
  TanStackTable,
  useColumnPinning,
  GlobalFiltering,
  RowSelections,
  INTERNAL_COLUMN_ID,
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
  searchable = true,
  searchBy = null,
  serverSearchQuery = UI.Table.DEFAULT_SEARCH_QUERY,
  paginated = UI.Table.DEFAULT_PAGINATED,
  loading = false,
  height,
  sortBy,
  sortable = UI.Table.SORT_OPTION.MULTI,
  density = UI.Table.DENSITY.STANDARD,
  overflow = "ellipsis",
  filterable = true,
  filterBy = null,
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
  searchable?: boolean;
  searchBy?: string | null;
  serverSearchQuery?: string | null;
  paginated?: boolean;
  loading?: UI.Stale.Option;
  height?: string;
  sortBy?: UI.Components.InputTable["model"]["properties"]["sortBy"];
  sortable?: UI.Table.SortOption;
  density?: UI.Table.Density;
  overflow?: UI.Table.OverflowBehavior;
  filterable?: boolean;
  filterBy?: UI.Table.AdvancedFilterModel<FormattedTableRow[]>;
}) {
  const fixedHeight = paginated || totalRecords > 35;
  const formattedData = useFormattedData(data, columns, offset);

  const handleRequestServerDataRef = useRef<(() => void) | null>(null);
  const handleRequestBrowserDataRef = useRef<(() => void) | null>(null);

  const {
    displayValue: sort,
    setDisplayValue: setSort,
    resetValue: resetSort,
    serverValueRef: serverSortRef,
  } = useSorting({
    columns,
    initialValueFromServer: sortBy,
    sortable,
    onShouldRequestServerData: handleRequestServerDataRef.current,
  });

  const {
    displayValue: searchQuery,
    setDisplayValue: setSearchQuery,
    validatedValueRef: validatedSearchQueryRef,
    serverValueRef: serverSearchQueryRef,
  } = GlobalFiltering.useSearch({
    initialValue: searchBy,
    searchable,
    onShouldRequestBrowserData: handleRequestBrowserDataRef.current,
  });

  const {
    displayValue: filters,
    setDisplayValue: setFilters,
    resetValue: resetFilters,
    validatedValueRef: validatedFiltersRef,
  } = GlobalFiltering.useAdvancedFiltering({
    initialValue: filterBy,
    filterable,
    onShouldRequestBrowserData: handleRequestBrowserDataRef.current,
    onShouldRequestServerData: handleRequestServerDataRef.current,
  });

  const { paginationState, setPaginationState } = usePagination(
    offset,
    pageSize,
    paginated,
    handleRequestServerDataRef.current
  );

  const { columnPinning, setColumnPinning, resetColumnPinningToInitial } =
    useColumnPinning(
      enableRowSelection,
      columns,
      !!actions && actions.length > 0
    );

  const { toggleRowSelection } = RowSelections.use(
    formattedData,
    enableRowSelection ? (allowMultiSelection ? "multi" : "single") : false
  );

  const formattedColumns = useFormattedColumns(
    columns,
    enableRowSelection,
    allowMultiSelection,
    hasError,
    disableRowSelection,
    actions,
    onTableRowActionHook,
    density,
    toggleRowSelection
  );

  const scrollToTopRef = useRef<() => void>(() => {});
  const setScrollToTopHandler = useCallback((scrollFn: () => void) => {
    scrollToTopRef.current = scrollFn;
  }, []);

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
      pagination: paginationState,
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

    // GLOBAL FILTERING
    getFilteredRowModel: GlobalFiltering.getFilteredRowModel({
      getSearchQuery: () => validatedSearchQueryRef.current,
      getAdvancedFilter: () => validatedFiltersRef.current,
    }),
    manualFiltering: paginated,

    // ROW SELECTION
    enableMultiRowSelection: allowMultiSelection,
    enableRowSelection,
    onRowSelectionChange: handleRowSelectionChange,
    getRowId: (row) =>
      row[INTERNAL_COLUMN_ID.META][INTERNAL_COLUMN_ID.ROW_SELECTION],

    // SORTING
    enableSorting:
      sortable === UI.Table.SORT_OPTION.SINGLE ||
      sortable === UI.Table.SORT_OPTION.MULTI,
    enableMultiSort: sortable === UI.Table.SORT_OPTION.MULTI,
    getSortedRowModel: getSortedRowModel(),
    manualSorting: paginated,
    onSortingChange: setSort,

    // PAGINATION
    manualPagination: paginated,
    rowCount: totalRecords,
    onPaginationChange: setPaginationState,
  });

  /**
   * Request a new page of data from the server based on the newest dependencies.
   */
  handleRequestServerDataRef.current = (
    newOffset?: number,
    newPageSize?: number
  ) => {
    if (!paginated) {
      return;
    }

    onTablePageChangeHook(
      serverSearchQueryRef.current,
      newOffset ?? offset,
      newPageSize ?? pageSize,
      serverSortRef.current
    );
  };

  /**
   * Force a recomputation of the tanstack table instance
   */
  handleRequestBrowserDataRef.current = () => {
    table.setOptions({ ...table.options });
  };

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
            serverSearchQuery={serverSearchQuery}
            filters={filters}
            setFilters={setFilters}
            loading={loading}
            paginated={paginated}
            onTablePageChangeHook={handleRequestServerDataRef.current}
            table={table}
            searchable={searchable}
            sortable={sortable}
            resetSort={resetSort}
            resetColumnPinningToInitial={resetColumnPinningToInitial}
            filterable={filterable}
            resetFilters={resetFilters}
          />
          <TableBody
            table={table}
            density={density}
            loading={loading}
            overflow={overflow}
            setScrollToTopHandler={setScrollToTopHandler}
          />
          <FooterRow
            table={table}
            paginated={paginated}
            loading={loading}
            scrollToTop={scrollToTopRef.current}
            offset={offset}
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

function TableBody({
  table,
  density,
  loading,
  overflow,
  setScrollToTopHandler,
}: {
  table: TanStackTable;
  density: UI.Table.Density;
  loading: UI.Stale.Option;
  overflow: UI.Table.OverflowBehavior;
  setScrollToTopHandler: (scrollFn: () => void) => void;
}) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => {
      if (density === "comfortable") {
        return 49;
      }

      if (density === "standard") {
        return 41;
      }

      return 33;
    },
    measureElement:
      overflow === UI.Table.OVERFLOW_BEHAVIOR.DYNAMIC &&
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element: HTMLDivElement) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 8,
  });

  useEffect(() => {
    setScrollToTopHandler(() => {
      rowVirtualizer.scrollToIndex(0);
    });
  }, [rowVirtualizer, setScrollToTopHandler]);

  return (
    <div
      className={classNames(
        "flex flex-col overflow-auto w-full h-full border-t border-brand-neutral",
        {
          "text-xs": density === UI.Table.DENSITY.COMPACT,
          "text-sm": density === UI.Table.DENSITY.STANDARD,
        }
      )}
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

            const leftVisibleCells = row.getLeftVisibleCells();
            const centerVisibleCells = row.getCenterVisibleCells();
            const rightVisibleCells = row.getRightVisibleCells();

            return (
              <div
                key={row.id}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className="w-full flex border-b-brand border-brand-neutral bg-brand-io absolute hover:bg-brand-overlay group"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {leftVisibleCells.length > 0 && (
                  // without z-10, json columns were rendering on top of the pinned columns when scrolled underneath.
                  <div className="flex sticky left-0 border-r border-brand-neutral bg-brand-io group-hover:bg-brand-overlay z-10">
                    {leftVisibleCells.map((cell) => (
                      <TableRowsMemo
                        key={cell.id}
                        cell={cell}
                        // Since we memoize the table row, we need to directly pass the selection state
                        // so that the checkbox re-renders when the selection state changes!
                        isSelected={row.getIsSelected()}
                      />
                    ))}
                  </div>
                )}
                {centerVisibleCells.map((cell) => (
                  <TableRowsMemo
                    key={cell.id}
                    cell={cell}
                    // Since we memoize the table row, we need to directly pass the selection state
                    // so that the checkbox re-renders when the selection state changes!
                    isSelected={row.getIsSelected()}
                  />
                ))}
                {rightVisibleCells.length > 0 && (
                  <div
                    className="flex sticky right-0 border-l border-brand-neutral bg-brand-io group-hover:bg-brand-overlay"
                    style={{ boxShadow: "1px 0 0 var(--brand-bg-overlay)" }}
                  >
                    {rightVisibleCells.map((cell) => (
                      <TableRowsMemo
                        key={cell.id}
                        cell={cell}
                        // Since we memoize the table row, we need to directly pass the selection state
                        // so that the checkbox re-renders when the selection state changes!
                        isSelected={row.getIsSelected()}
                      />
                    ))}
                  </div>
                )}
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
