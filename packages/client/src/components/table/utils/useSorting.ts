import { UI } from "@composehq/ts-public";
import { SortingState, Updater } from "@tanstack/react-table";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { TableColumnProp } from "./constants";

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
  serverSortByRef: MutableRefObject<
    UI.Table.PageChangeParams<UI.Table.DataRow[]>["sortBy"]
  >,
  onSortChange: () => void
) {
  /**
   * Store the previous `initialSortBy` to detect changes to the value. If
   * a change is detected, the:
   * - current sorting state is overriden to the new initial value
   * - the initial sorting state is updated to the new value
   */
  const prevInitialSortBy = useRef(initialSortBy);

  /**
   * The active sorting state. We control this ourselves instead of having
   * tanstack table manage it.
   */
  const [sort, setSort] = useState<SortingState>(() => {
    const browserSortBy = formatSortByForBrowser(
      initialSortBy,
      columns,
      sortable
    );
    // hack: set the serverSortRef when we declare the sort state to keep
    // it synced up.
    serverSortByRef.current = formatSortByForServer(browserSortBy, columns);
    return browserSortBy;
  });

  useEffect(() => {
    /**
     * Listen for changes to the initial sorting state, and update the
     * necessary state to reflect the change.
     *
     * Note: there's no reason to call `onSortChange` here since we
     * expect the SDK to automatically refetch table data when the
     * `sortBy` prop changes.
     */
    if (
      JSON.stringify(prevInitialSortBy.current) !==
      JSON.stringify(initialSortBy)
    ) {
      prevInitialSortBy.current = initialSortBy;

      const browserSortBy = formatSortByForBrowser(
        initialSortBy,
        columns,
        sortable
      );

      setSort(browserSortBy);
      serverSortByRef.current = formatSortByForServer(browserSortBy, columns);
    }
  }, [initialSortBy, columns, sortable, serverSortByRef]);

  /**
   * Sorting state change handler that is passed to the tanstack table
   * instance.
   */
  function handleSortChange(sortBy: Updater<SortingState>) {
    if (sortable === UI.Table.SORT_OPTION.DISABLED) {
      return;
    }

    if (typeof sortBy === "function") {
      sortBy = sortBy(sort);
    }

    setSort(sortBy);
    serverSortByRef.current = formatSortByForServer(sortBy, columns);

    onSortChange();
  }

  /**
   * Reset the sorting state to the initial value.
   */
  function resetSortingStateToInitial() {
    handleSortChange(formatSortByForBrowser(initialSortBy, columns, sortable));
  }

  return {
    sort,
    setSort: handleSortChange,
    resetSortingStateToInitial,
  };
}

export { useSorting };
