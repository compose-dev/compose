import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  Table as TanStackTable,
  Row,
  getFilteredRowModel,
  Updater,
  FilterFn,
  Cell,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckboxRaw } from "~/components/checkbox";
import { classNames } from "~/utils/classNames";
import { useThrottledCallback } from "~/utils/useThrottledCallback";
import {
  INTERNAL_COLUMN_ID,
  type FormattedTableRow,
  type TableColumn,
} from "./constants";
import { IOComponent } from "~/components/io-component";
import TableActionCell from "./components/TableActionCell";
import HeaderCell from "./components/HeaderCell";
import RowCell from "./components/RowCell";
import { TextInput } from "../input";
import DataCell from "./components/DataCell";
import { UI } from "@composehq/ts-public";
import PageSelectorRow from "./components/PageSelectorRow";
import TableLoading from "./components/TableLoading";
import { Spinner } from "../spinner";
import { u } from "@compose/ts";
import { useSearch, useFormattedData } from "./utils";

type InternalTableColumn<T> =
  | (TableColumn & { header: string })
  | {
      id: string;
      header:
        | string
        | (({ table }: { table: TanStackTable<T> }) => JSX.Element);
      cell: ({
        row,
        table,
      }: {
        row: Row<T>;
        table: TanStackTable<T>;
      }) => JSX.Element;
    }
  | (TableColumn & {
      header: string;
      cell: ({ row }: { row: Row<T> }) => JSX.Element;
    });

// Add our custom search function to the table type
// https://tanstack.com/table/v8/docs/framework/react/examples/filters-fuzzy
declare module "@tanstack/react-table" {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
}

function Table({
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
}: {
  data: UI.Components.InputTable["model"]["properties"]["data"];
  columns: TableColumn[];
  actions: UI.Components.InputTable["model"]["properties"]["actions"];
  totalRecords: number;
  onTablePageChangeHook: (
    searchQuery: string | null,
    offset: number,
    pageSize: number
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
}) {
  const fixedHeight = paginated || totalRecords > 35;

  const searchTable = useSearch(columns);
  const formattedData = useFormattedData(data, columns);

  const formattedColumns = useMemo(() => {
    function formatColumn(column: TableColumn) {
      return {
        ...column,
        header: () => {
          return (
            <HeaderCell
              className={classNames({
                "min-w-48 flex-1": !column.width,
              })}
              style={
                column.width
                  ? { width: column.width, minWidth: column.width }
                  : {}
              }
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

    const formatted: InternalTableColumn<FormattedTableRow>[] = [];

    if (enableRowSelection) {
      formatted.push({
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
                  Object.keys(table.getState().rowSelection).length >=
                  totalRecords
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
          >
            <CheckboxRaw
              enabled={
                table.getState().rowSelection[row.index + offset] === true
              }
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
      });
    }

    columns.forEach((column) => {
      if (column.accessorKey === INTERNAL_COLUMN_ID.META) {
        return;
      }
      formatted.push(formatColumn(column));
    });

    if (actions && actions.length > 0) {
      formatted.push({
        id: INTERNAL_COLUMN_ID.ACTION,
        header: ({ table }: { table: TanStackTable<FormattedTableRow> }) => {
          const hasOneRow = table.getRowModel().rows.length >= 1;

          if (!hasOneRow) {
            return <></>;
          }

          return (
            <HeaderCell className="sticky z-10 right-0 bg-brand-io border-l border-brand-neutral w-fit">
              <TableActionCell
                actions={actions}
                hidden={true}
                onClick={() => {}}
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
        }) => {
          return (
            <RowCell
              className="z-10 sticky right-0 bg-brand-io border-l border-brand-neutral group-hover:bg-brand-overlay !py-[7px]"
              isLastRow={row.index === table.getRowModel().rows.length - 1}
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
      });
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
    data: formattedData,
    columns: formattedColumns,
    state: {
      rowSelection: rowSelections,
    },
    onRowSelectionChange: handleRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection,
    enableMultiRowSelection: allowMultiSelection,
    filterFns: {
      fuzzy: searchTable,
    },
    globalFilterFn: "fuzzy",
    getFilteredRowModel: getFilteredRowModel(),
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

  const [search, setSearch] = useState(serverSearchQuery);
  const { throttledCallback: setGlobalFilter } = useThrottledCallback(
    (value: string) => {
      table.setGlobalFilter(value);
    },
    300
  );
  const prevLoadingRef = useRef(loading);

  useEffect(() => {
    if (
      prevLoadingRef.current !== loading &&
      loading === UI.Stale.OPTION.FALSE
    ) {
      rowVirtualizer.scrollToOffset(0, {
        behavior: "auto",
      });
    }

    if (
      loading === UI.Stale.OPTION.UPDATE_DISABLED ||
      loading === UI.Stale.OPTION.FALSE
    ) {
      prevLoadingRef.current = loading;
    }
  }, [rowVirtualizer, loading]);

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
          <div
            className={classNames(
              "flex justify-between p-2 w-full border-b border-brand-neutral",
              {
                "flex-col sm:flex-row items-start sm:items-center": paginated,
                "items-center": !paginated,
              }
            )}
          >
            {disableSearch ? (
              <div />
            ) : paginated ? (
              <form
                className="flex flex-row space-x-2 items-center mb-2 sm:mb-0 sm:mr-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Changing the search query should always reset the offset
                  onTablePageChangeHook(search, 0, pageSize);
                }}
              >
                <TextInput
                  value={search}
                  setValue={(value) => {
                    setSearch(value);
                  }}
                  placeholder="Search"
                  label={null}
                  rootClassName="!w-40 sm:!w-60 md:!w-72"
                />
                {search !== serverSearchQuery &&
                  loading !== UI.Stale.OPTION.UPDATE_DISABLED && (
                    <p className="text-brand-neutral-2 text-sm min-w-fit">
                      <span className="hidden sm:block">
                        Press Enter to search
                      </span>
                      <span className="block sm:hidden">Enter to search</span>
                    </p>
                  )}
                {loading === UI.Stale.OPTION.UPDATE_DISABLED && (
                  <Spinner size="sm" variant="neutral" />
                )}
              </form>
            ) : (
              <TextInput
                value={search}
                setValue={(value) => {
                  setSearch(value);
                  setGlobalFilter(value || "");
                }}
                placeholder="Search"
                label={null}
                rootClassName="!w-40 sm:!w-72"
              />
            )}
            <p className="text-brand-neutral-2 text-sm">
              {paginated
                ? `${u.string.formatNumber(offset + 1)} - ${u.string.formatNumber(offset + rows.length)} of ${u.string.formatNumber(totalRecords)} results`
                : `${u.string.formatNumber(rows.length)} results`}
            </p>
          </div>
          <div
            className="flex flex-col overflow-y-auto w-full h-full"
            style={{
              scrollbarWidth: "thin",
            }}
            ref={tableContainerRef}
          >
            <div className="border-brand-neutral">
              <div className="flex flex-col sticky top-0 z-10 bg-brand-io">
                <div className="w-full flex">
                  {table
                    .getHeaderGroups()
                    .map((group) =>
                      group.headers.map((header) => (
                        <React.Fragment key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </React.Fragment>
                      ))
                    )}
                </div>
              </div>
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
                      className="w-full min-w-fit flex border-b-brand border-brand-neutral bg-brand-io absolute hover:bg-brand-overlay group"
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
          {paginated && (
            <div className="flex flex-row justify-between space-x-2 items-center p-2 w-full border-t border-brand-neutral bg-brand-io">
              <TableLoading loading={loading} />
              <PageSelectorRow
                offset={offset}
                pageSize={pageSize}
                totalRecords={totalRecords}
                onPageChange={(offset) => {
                  onTablePageChangeHook(search, offset, pageSize);
                }}
                disabled={loading === UI.Stale.OPTION.UPDATE_DISABLED}
              />
            </div>
          )}
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
