import { UI } from "@composehq/ts-public";
import { SortingState } from "@tanstack/react-table";
import { useCallback, useEffect } from "react";
import { FormattedTableRow, TableColumnProp } from "../constants";
import { ServerSortModel, ValidatedSortModel } from "./sortModel";
import { DisplaySortModel } from "./sortModel";
import { useDataControl } from "../useDataControl";
import * as Views from "../views";
import { sortByIsEqual } from "./utils";

function formatServerToDraft(
  sortBy: ServerSortModel,
  columns: TableColumnProp[],
  sortable: UI.Table.SortOption
): DisplaySortModel {
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

function formatAppliedToServer(
  sortBy: SortingState,
  columns: TableColumnProp[]
): ServerSortModel {
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

function noop<T>(value: T) {
  return value;
}

const SORTING_DISABLED_VALUE: ServerSortModel = [];

function useSorting({
  columns,
  sortable,
  paginated,
  viewsHook,
  serverSortBy,
}: {
  columns: TableColumnProp[];
  sortable: UI.Table.SortOption;
  paginated: boolean;
  viewsHook: ReturnType<typeof Views.use>;
  serverSortBy?: ServerSortModel;
}) {
  const getCurrentServerValue = useCallback(() => {
    if (paginated) {
      return serverSortBy ?? [];
    }

    return viewsHook.appliedRef.current.sortBy;
  }, [paginated, serverSortBy, viewsHook.appliedRef]);

  const serverToDraft = useCallback(
    (sortBy: UI.Table.ColumnSortRule<FormattedTableRow[]>[]) =>
      formatServerToDraft(sortBy, columns, sortable),
    [columns, sortable]
  );

  const appliedToServer = useCallback(
    (sortBy: SortingState) => formatAppliedToServer(sortBy, columns),
    [columns]
  );

  const getResetValue = useCallback(() => {
    return viewsHook.appliedRef.current.sortBy;
  }, [viewsHook.appliedRef]);

  const dataControl = useDataControl<
    DisplaySortModel,
    ValidatedSortModel,
    ServerSortModel
  >({
    getCurrentServerValue,
    draftToApplied: noop,
    appliedToServer: appliedToServer,
    serverToDraft: serverToDraft,
    serverValuesAreEqual: sortByIsEqual,
    isEnabled: sortable !== UI.Table.SORT_OPTION.DISABLED,
    disabledValue: SORTING_DISABLED_VALUE,
    getResetValue: getResetValue,
    paginated,
  });

  useEffect(() => {
    dataControl.setIsEnabled(sortable !== UI.Table.SORT_OPTION.DISABLED);
  }, [sortable, dataControl]);

  return dataControl;
}

export { useSorting };
