import { UI } from "@composehq/ts-public";
import { SortingState } from "@tanstack/react-table";
import { MutableRefObject } from "react";
import { PaginationOperators, TableColumnProp } from "./constants";
import { useDataOperation } from "./useDataOperation";

function formatSortByForBrowser(
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

function formatSortByForServer(
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

function useSorting(
  columns: TableColumnProp[],
  initialSortBy: UI.Components.InputTable["model"]["properties"]["sortBy"],
  sortable: UI.Table.SortOption,
  onSortChange: () => void,
  paginationOperatorsRef: MutableRefObject<PaginationOperators>
) {
  const {
    value: sort,
    setValue: setSort,
    resetValue: resetSort,
  } = useDataOperation({
    // Initial Values
    initialValue: initialSortBy ?? [],
    serverValueDidChange: (oldValue, newValue) =>
      JSON.stringify(oldValue) !== JSON.stringify(newValue),

    // Feature Flag
    operationIsEnabled: sortable !== UI.Table.SORT_OPTION.DISABLED,
    operationDisabledValue: [],

    // Formatting
    formatServerToBrowser: (sortBy) =>
      formatSortByForBrowser(sortBy, columns, sortable),
    formatBrowserToServer: (sortBy) => formatSortByForServer(sortBy, columns),

    // Pagination Syncing
    getCurrentServerValue: () => paginationOperatorsRef.current.sortBy,
    onSyncServerValue: (serverValue) => {
      paginationOperatorsRef.current.sortBy = serverValue;
    },
    onShouldRequestPageChange: onSortChange,
  });

  return {
    sort,
    setSort,
    resetSort,
  };
}

export { useSorting };
