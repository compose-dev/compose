import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  Updater,
  Cell,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { classNames } from "~/utils/classNames";
import { IOComponent } from "~/components/io-component";
import { UI } from "@composehq/ts-public";
import {
  useFormattedData,
  useFormattedColumns,
  type FormattedTableRow,
  type TableColumnProp,
  usePagination,
  TanStackTable,
  useColumnPinning,
  GlobalFiltering,
  RowSelections,
  INTERNAL_COLUMN_ID,
  Views,
  useColumnVisibility,
  Sorting,
  ServerView,
  useTableOverflow,
  useTableDensity,
} from "./utils";
import { ColumnHeaderRow, FooterRow, ToolbarRow } from "./components";
import { log } from "@compose/ts";
import { getNodeEnvironment } from "~/utils/nodeEnvironment";

const isDevelopment = getNodeEnvironment() === "development";

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
  serverView = UI.Table.DEFAULT_VIEW,
  paginated = UI.Table.DEFAULT_PAGINATED,
  loading = false,
  height,
  sortable = UI.Table.SORT_OPTION.MULTI,
  density = UI.Table.DENSITY.STANDARD,
  overflow = UI.Table.OVERFLOW_BEHAVIOR.ELLIPSIS,
  filterable = true,
  primaryKey = undefined,
  views = [],
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
    sortBy: UI.Table.PageChangeParams<UI.Table.DataRow[]>["sortBy"],
    filterBy: UI.Table.PageChangeParams<UI.Table.DataRow[]>["filterBy"],
    viewBy: string | undefined
  ) => void;
  onTableRowActionHook: (rowIdx: number, actionIdx: number) => void;
  pageSize?: number;
  offset?: number;
  tableClassName?: string;
  enableRowSelection?: boolean;
  rowSelections: Record<string, boolean>;
  setRowSelections: (
    rowSelections: Record<string, boolean>,
    primaryKeyMap: Record<string, string | number>
  ) => void;
  allowMultiSelection?: boolean;
  hasError?: boolean;
  errorMessage?: string | null;
  disableRowSelection?: boolean;
  searchable?: boolean;
  serverView?: ServerView;
  paginated?: boolean;
  loading?: UI.Stale.Option;
  height?: string;
  sortable?: UI.Table.SortOption;
  density?: UI.Table.Density;
  overflow?: UI.Table.OverflowBehavior;
  filterable?: boolean;
  primaryKey?: string | number | undefined;
  views?: UI.Table.ViewInternal<FormattedTableRow[]>[];
}) {
  const fixedHeight = paginated || totalRecords > 35;
  const { formattedRows: formattedData, primaryKeyMap } = useFormattedData(
    data,
    columns,
    offset,
    primaryKey
  );

  const handleRequestServerDataRef = useRef<(() => void) | null>(null);
  const handleRequestBrowserDataRef = useRef<(() => void) | null>(null);

  const viewsHook = Views.use({
    views,
    serverViewBy: serverView.viewBy,
    paginated,
  });

  const tableOverflowHook = useTableOverflow({
    overflow,
    appliedView: viewsHook.applied,
  });

  const tableDensityHook = useTableDensity({
    density,
    appliedView: viewsHook.applied,
  });

  const sortingHook = Sorting.use({
    columns,
    sortable,
    paginated,
    viewsHook,
    serverSortBy: serverView.sortBy,
  });

  const searchQueryHook = GlobalFiltering.useSearch({
    serverSearchQuery: serverView.searchQuery,
    searchable,
    paginated,
    viewsHook,
  });

  const advancedFilteringHook = GlobalFiltering.useAdvancedFiltering({
    serverFilterBy: serverView.filterBy,
    filterable,
    columns,
    paginated,
    viewsHook,
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
      !!actions && actions.length > 0,
      viewsHook.applied
    );

  const { columnVisibility, setColumnVisibility, resetColumnVisibility } =
    useColumnVisibility(columns, viewsHook.applied);

  const { toggleRowSelection } = RowSelections.use(
    formattedData,
    enableRowSelection ? (allowMultiSelection ? "multi" : "single") : false
  );

  const isViewDirty = useMemo(() => {
    if (searchable) {
      const searchQuery = paginated
        ? serverView.searchQuery
        : searchQueryHook.nextServer;
      if (viewsHook.applied.searchQuery !== searchQuery) {
        return true;
      }
    }

    if (filterable) {
      const filterBy = paginated
        ? serverView.filterBy
        : advancedFilteringHook.nextServer;
      if (
        !GlobalFiltering.advancedFilterModelValuesAreEqual(
          viewsHook.applied.filterBy,
          filterBy ?? null
        )
      ) {
        return true;
      }
    }

    if (sortable) {
      const sortBy = paginated ? serverView.sortBy : sortingHook.nextServer;
      if (!Sorting.sortByIsEqual(viewsHook.applied.sortBy, sortBy ?? [])) {
        return true;
      }
    }

    return false;
  }, [
    viewsHook.applied,
    serverView,
    searchable,
    filterable,
    sortable,
    paginated,
    searchQueryHook.nextServer,
    advancedFilteringHook.nextServer,
    sortingHook.nextServer,
  ]);

  const formattedColumns = useFormattedColumns(
    columns,
    enableRowSelection,
    allowMultiSelection,
    hasError,
    disableRowSelection,
    actions,
    onTableRowActionHook,
    tableDensityHook.applied,
    tableOverflowHook.applied,
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
      setRowSelections(newRowSelections, primaryKeyMap);
    },
    [rowSelections, setRowSelections, primaryKeyMap]
  );

  const updateSorting = useCallback(
    (sortBy: Updater<SortingState>) => {
      sortingHook.set(sortBy);

      if (
        handleRequestServerDataRef.current &&
        paginated &&
        !Sorting.sortByIsEqual(
          sortingHook.nextServerRef.current,
          serverView.sortBy ?? []
        )
      ) {
        handleRequestServerDataRef.current();
      }
    },
    [sortingHook, paginated, serverView.sortBy, handleRequestServerDataRef]
  );

  const table = useReactTable({
    // BASE SETUP
    data: formattedData,
    columns: formattedColumns,
    getCoreRowModel: getCoreRowModel(),

    // STATE
    state: {
      rowSelection: rowSelections,
      sorting: sortingHook.applied,
      columnPinning,
      pagination: paginationState,
      columnVisibility,
    },

    // COLUMN PINNING
    onColumnPinningChange: setColumnPinning,

    // COLUMN VISIBILITY
    onColumnVisibilityChange: setColumnVisibility,

    // GLOBAL FILTERING
    getFilteredRowModel: GlobalFiltering.getFilteredRowModel({
      getSearchQuery: () => searchQueryHook.appliedRef.current,
      getAdvancedFilter: () => advancedFilteringHook.appliedRef.current,
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
    onSortingChange: updateSorting,

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

    if (
      !searchable &&
      !sortable &&
      !filterable &&
      (newOffset ?? offset) === offset &&
      (newPageSize ?? pageSize) === pageSize
    ) {
      return;
    }

    if (isDevelopment) {
      log(
        "Page change requested",
        {
          searchQuery: searchQueryHook.nextServerRef.current,
          offset: newOffset ?? offset,
          pageSize: newPageSize ?? pageSize,
          sortBy: sortingHook.nextServerRef.current,
          filterBy: advancedFilteringHook.nextServerRef.current,
          viewBy: viewsHook.nextServerRef.current,
        },
        "green"
      );
    }

    onTablePageChangeHook(
      searchQueryHook.nextServerRef.current,
      newOffset ?? offset,
      newPageSize ?? pageSize,
      sortingHook.nextServerRef.current as UI.Table.ColumnSortRule<
        UI.Table.DataRow[]
      >[],
      advancedFilteringHook.nextServerRef.current as UI.Table.ColumnFilterModel<
        UI.Table.DataRow[]
      >,
      viewsHook.nextServerRef.current
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
            searchQueryHook={searchQueryHook}
            advancedFilteringHook={advancedFilteringHook}
            sortingHook={sortingHook}
            viewsHook={viewsHook}
            loading={loading}
            paginated={paginated}
            onTablePageChangeHook={handleRequestServerDataRef.current}
            table={table}
            searchable={searchable}
            sortable={sortable}
            resetColumnPinningToInitial={resetColumnPinningToInitial}
            filterable={filterable}
            resetColumnVisibility={resetColumnVisibility}
            views={views}
            setView={(view: Views.ViewDisplayFormat) => {
              // Set the active view
              viewsHook.set(view);

              // Sync the new view to the data operation values
              sortingHook.set(
                sortingHook.serverToDraft(viewsHook.appliedRef.current.sortBy)
              );
              searchQueryHook.set(
                searchQueryHook.serverToDraft(
                  viewsHook.appliedRef.current.searchQuery
                )
              );
              advancedFilteringHook.set(
                advancedFilteringHook.serverToDraft(
                  viewsHook.appliedRef.current.filterBy
                )
              );

              if (viewsHook.appliedRef.current.density) {
                tableDensityHook.set(viewsHook.appliedRef.current.density);
              }

              if (viewsHook.appliedRef.current.overflow) {
                tableOverflowHook.set(viewsHook.appliedRef.current.overflow);
              }

              // If paginated, request a new page of data from server
              if (paginated && handleRequestServerDataRef.current) {
                handleRequestServerDataRef.current();
              } else if (!paginated && handleRequestBrowserDataRef.current) {
                handleRequestBrowserDataRef.current();
              }
            }}
            resetView={() => {
              // Set the active view
              viewsHook.reset();

              // Sync the new view to the data operation values
              sortingHook.reset();
              searchQueryHook.reset();
              advancedFilteringHook.reset();

              if (viewsHook.appliedRef.current.density) {
                tableDensityHook.set(viewsHook.appliedRef.current.density);
              }

              if (viewsHook.appliedRef.current.overflow) {
                tableOverflowHook.set(viewsHook.appliedRef.current.overflow);
              }

              // If paginated, request a new page of data from server
              if (paginated && handleRequestServerDataRef.current) {
                handleRequestServerDataRef.current();
              } else if (!paginated && handleRequestBrowserDataRef.current) {
                handleRequestBrowserDataRef.current();
              }
            }}
            isViewDirty={isViewDirty}
            tableOverflowHook={tableOverflowHook}
            tableDensityHook={tableDensityHook}
          />
          <TableBody
            table={table}
            density={tableDensityHook.applied}
            loading={loading}
            overflow={tableOverflowHook.applied}
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
                  <div className="flex sticky left-0 border-r border-brand-neutral bg-brand-io group-hover:bg-brand-overlay z-10 contain-paint">
                    {leftVisibleCells.map((cell) => (
                      <TableRowsMemo
                        key={cell.id}
                        cell={cell}
                        // Since we memoize the table row, we need to directly pass the selection state
                        // so that the checkbox re-renders when the selection state changes!
                        isSelected={row.getIsSelected()}
                        isExpanded={false}
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
                    isExpanded={cell.column.getIsLastColumn("center")}
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
                        isExpanded={false}
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
  // These props are here purely to force a re-render when they are updated.
  isSelected: boolean;
  isExpanded: boolean;
}) {
  return flexRender(cell.column.columnDef.cell, cell.getContext());
}

const TableRowsMemo = React.memo(TableRows);

export default Table;
