import { UI } from "@composehq/ts-public";
import { SortingState } from "@tanstack/react-table";
import { MutableRefObject, useCallback } from "react";
import { PaginationOperators, TableColumnProp } from "./constants";
import { useDataOperation } from "./useDataOperation";

function formatForBrowser(
  sortBy: UI.Components.InputTable["model"]["properties"]["sortBy"],
  columns: TableColumnProp[],
  sortable: UI.Table.SortOption
): SortingState {
  if (!sortBy || sortable === UI.Table.SORT_OPTION.DISABLED) {
    return [];
  }

  const mapped = sortBy
    .map((sort) => ({
      id: columns.find((column) => (column.original ?? column.id) === sort.key)
        ?.id,
      desc: sort.direction === "desc",
    }))
    .filter((sort) => sort.id !== undefined) as SortingState;

  if (sortable === UI.Table.SORT_OPTION.SINGLE && mapped.length > 1) {
    return mapped.slice(0, 1);
  }

  return mapped;
}

function formatForServer(
  sortBy: SortingState,
  columns: TableColumnProp[]
): UI.Table.PageChangeParams<UI.Table.DataRow[]>["sortBy"] {
  return sortBy
    .map((sort) => {
      const column = columns.find((column) => column.id === sort.id);

      if (column === undefined) {
        return undefined;
      }

      return {
        key: column.original ?? column.id,
        direction: sort.desc ? "desc" : "asc",
      };
    })
    .filter((sort) => sort !== undefined) as UI.Table.PageChangeParams<
    UI.Table.DataRow[]
  >["sortBy"];
}

const SORTING_DISABLED_VALUE: SortingState = [];
const FALLBACK_INITIAL_SORT_BY: NonNullable<
  UI.Components.InputTable["model"]["properties"]["sortBy"]
> = [];

function sortByDidChange(
  a: UI.Components.InputTable["model"]["properties"]["sortBy"],
  b: UI.Components.InputTable["model"]["properties"]["sortBy"]
) {
  return JSON.stringify(a) !== JSON.stringify(b);
}

function useSorting(
  columns: TableColumnProp[],
  initialSortBy: UI.Components.InputTable["model"]["properties"]["sortBy"],
  sortable: UI.Table.SortOption,
  onSortChange: () => void,
  paginationOperatorsRef: MutableRefObject<PaginationOperators>
) {
  const formatSortByForBrowser = useCallback(
    (sortBy: UI.Components.InputTable["model"]["properties"]["sortBy"]) =>
      formatForBrowser(sortBy, columns, sortable),
    [columns, sortable]
  );

  const formatSortByForServer = useCallback(
    (sortBy: SortingState) => formatForServer(sortBy, columns),
    [columns]
  );

  const syncServerValue = useCallback(
    (serverValue: UI.Table.ColumnSort<UI.Table.DataRow[]>[]) => {
      paginationOperatorsRef.current.sortBy = serverValue;
    },
    [paginationOperatorsRef]
  );

  const getCurrentServerValue = useCallback(
    () => paginationOperatorsRef.current.sortBy,
    [paginationOperatorsRef]
  );

  const {
    value: sort,
    setValue: setSort,
    resetValue: resetSort,
  } = useDataOperation({
    // Initial Values
    initialValue: initialSortBy ?? FALLBACK_INITIAL_SORT_BY,

    // Formatting
    formatServerToBrowser: formatSortByForBrowser,
    formatBrowserToServer: formatSortByForServer,

    // Server value change detection
    getCurrentServerValue,
    serverValueDidChange: sortByDidChange,

    // Pagination Syncing
    onSyncServerValue: syncServerValue,
    onShouldRequestPageChange: onSortChange,

    // Feature Flag
    operationIsEnabled: sortable !== UI.Table.SORT_OPTION.DISABLED,
    operationDisabledValue: SORTING_DISABLED_VALUE,
  });

  return {
    sort,
    setSort,
    resetSort,
  };
}

export { useSorting };
