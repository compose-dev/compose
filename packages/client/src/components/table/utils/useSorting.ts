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

function useSorting({
  columns,
  initialValueFromServer,
  sortable,
  onShouldRequestServerData,
}: {
  columns: TableColumnProp[];
  initialValueFromServer: UI.Components.InputTable["model"]["properties"]["sortBy"];
  sortable: UI.Table.SortOption;
  onShouldRequestServerData: (() => void) | null;
}) {
  const formatSortByForBrowser = useCallback(
    (sortBy: UI.Components.InputTable["model"]["properties"]["sortBy"]) =>
      formatForBrowser(sortBy, columns, sortable),
    [columns, sortable]
  );

  const formatSortByForServer = useCallback(
    (sortBy: SortingState) => formatForServer(sortBy, columns),
    [columns]
  );

  return useDataOperation({
    // Initial Values
    initialValueFromServer: initialValueFromServer ?? FALLBACK_INITIAL_SORT_BY,

    // Formatting
    formatServerToDisplay: formatSortByForBrowser,
    formatDisplayToValidated: formatSortByForServer,
    formatValidatedToServer: (validated) => validated,

    // Server value change detection
    serverValueDidChange: sortByDidChange,
    shouldManuallySyncServerValue: false,

    // Pagination Syncing
    onShouldRequestServerData,
    onShouldRequestBrowserData: null,

    // Feature Flag
    operationIsEnabled: sortable !== UI.Table.SORT_OPTION.DISABLED,
    operationDisabledValue: SORTING_DISABLED_VALUE,
  });
}

export { useSorting };
