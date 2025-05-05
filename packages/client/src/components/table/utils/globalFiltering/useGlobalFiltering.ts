import {
  TableColumnProp,
  FormattedTableRow,
  PaginationOperators,
} from "../constants";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UI } from "@composehq/ts-public";
import { useThrottledCallback } from "~/utils/useThrottledCallback";
import {
  EditableAdvancedFilterModel,
  getValidFilterModel,
  serverToBrowserFilterModel,
} from "./filterModel";
import { filterTableRow } from "./filterTableRow";
import { searchTableRow } from "./searchTableRow";
import { useDataOperation } from "../useDataOperation";

function filterTable(
  rows: FormattedTableRow[],
  columns: TableColumnProp[],
  searchQuery: string | null,
  filterBy: UI.Table.AdvancedFilterModel<FormattedTableRow[]>,
  columnFormatMap: Record<string, UI.Table.ColumnFormat | undefined>
) {
  try {
    if (!searchQuery && !filterBy) {
      return rows;
    }

    const formattedSearchQuery = searchQuery ? searchQuery.toLowerCase() : null;

    return rows.filter((row) => {
      if (formattedSearchQuery) {
        if (!searchTableRow(row, columns, formattedSearchQuery)) {
          return false;
        }
      }

      if (filterBy) {
        if (!filterTableRow(row, filterBy, columnFormatMap)) {
          return false;
        }
      }

      return true;
    });
  } catch (error) {
    return rows;
  }
}

function useGlobalFiltering(
  rows: FormattedTableRow[],
  columns: TableColumnProp[],
  paginated: boolean,
  searchable: boolean,
  searchBy: string | null,
  filterable: boolean,
  filterBy: UI.Table.AdvancedFilterModel<FormattedTableRow[]>,
  paginationOperatorsRef: MutableRefObject<PaginationOperators>,
  handleTablePageChange: () => void
) {
  const { value: searchQuery, setValue: setSearchQuery } = useDataOperation<
    string | null,
    string | null
  >({
    // Initial Values
    initialValue: searchBy,
    serverValueDidChange: (oldValue, newValue) => oldValue !== newValue,

    // Operation enabled state
    operationIsEnabled: searchable,
    operationDisabledValue: null,

    // Formatting
    formatServerToBrowser: (serverValue) => serverValue,
    formatBrowserToServer: (browserValue) => browserValue,

    // Pagination Syncing
    getCurrentServerValue: () => paginationOperatorsRef.current.searchQuery,
    onSyncServerValue: (serverValue) => {
      paginationOperatorsRef.current.searchQuery = serverValue;
    },
    // Search query changes are triggered directly via the toolbar when
    // the user presses enter.
    onShouldRequestPageChange: null,
  });

  const {
    value: filters,
    setValue: setFilters,
    resetValue: resetFilters,
  } = useDataOperation({
    // Initial Values
    initialValue: filterBy,
    serverValueDidChange: (oldValue, newValue) =>
      JSON.stringify(oldValue) !== JSON.stringify(newValue),

    // Operation enabled state
    operationIsEnabled: filterable,
    operationDisabledValue: null,

    // Formatting
    formatServerToBrowser: serverToBrowserFilterModel,
    formatBrowserToServer: getValidFilterModel,

    // Pagination Syncing
    getCurrentServerValue: () => paginationOperatorsRef.current.filterBy,
    onSyncServerValue: (serverValue) => {
      paginationOperatorsRef.current.filterBy = serverValue;
    },
    onShouldRequestPageChange: handleTablePageChange,
  });

  const columnFormatMap = useMemo(() => {
    return columns.reduce(
      (acc, col) => {
        acc[col.id] = col.format;
        return acc;
      },
      {} as Record<string, UI.Table.ColumnFormat | undefined>
    );
  }, [columns]);

  const [filteredFormattedRows, setFilteredFormattedRows] = useState<
    FormattedTableRow[]
  >(
    paginated
      ? rows
      : filterTable(
          rows,
          columns,
          paginationOperatorsRef.current.searchQuery,
          paginationOperatorsRef.current.filterBy,
          columnFormatMap
        )
  );

  const filterRows = useCallback(
    (
      newRows: FormattedTableRow[],
      newColumns: TableColumnProp[],
      newSearchQuery: string | null,
      newFilters: UI.Table.AdvancedFilterModel<FormattedTableRow[]>,
      newColumnFormatMap: Record<string, UI.Table.ColumnFormat | undefined>
    ) => {
      setFilteredFormattedRows(
        filterTable(
          newRows,
          newColumns,
          newSearchQuery,
          newFilters,
          newColumnFormatMap
        )
      );
    },
    []
  );

  const { throttledCallback: filterRowsThrottled } = useThrottledCallback(
    (
      newRows: FormattedTableRow[],
      newColumns: TableColumnProp[],
      newSearchQuery: string | null,
      newFilters: UI.Table.AdvancedFilterModel<FormattedTableRow[]>,
      newColumnFormatMap: Record<string, UI.Table.ColumnFormat | undefined>
    ) => {
      filterRows(
        newRows,
        newColumns,
        newSearchQuery,
        newFilters,
        newColumnFormatMap
      );
    },
    300
  );

  // Recompute the filtered rows when the rows or columns change.
  useEffect(() => {
    // If paginated, assume the rows are already filtered. Or,
    // if the table is neither searchable nor filterable, then
    // also just return early.
    if (paginated || (!searchable && !filterable)) {
      setFilteredFormattedRows(rows);
      return;
    }

    filterRows(
      rows,
      columns,
      paginationOperatorsRef.current.searchQuery,
      paginationOperatorsRef.current.filterBy,
      columnFormatMap
    );
  }, [
    rows,
    columns,
    filterRows,
    paginated,
    searchable,
    filterable,
    paginationOperatorsRef,
    columnFormatMap,
  ]);

  const handleSearchQueryChange = useCallback(
    (value: string | null) => {
      setSearchQuery(value);

      if (!paginated) {
        filterRowsThrottled(
          rows,
          columns,
          value,
          paginationOperatorsRef.current.filterBy,
          columnFormatMap
        );
      }
    },
    [
      filterRowsThrottled,
      rows,
      columns,
      setSearchQuery,
      paginated,
      paginationOperatorsRef,
      columnFormatMap,
    ]
  );

  const handleFilterChange = useCallback(
    (value: EditableAdvancedFilterModel) => {
      setFilters(value);

      if (!paginated) {
        filterRows(
          rows,
          columns,
          paginationOperatorsRef.current.searchQuery,
          paginationOperatorsRef.current.filterBy,
          columnFormatMap
        );
      }
    },
    [
      filterRows,
      paginated,
      rows,
      columns,
      setFilters,
      paginationOperatorsRef,
      columnFormatMap,
    ]
  );

  return {
    searchQuery,
    setSearchQuery: handleSearchQueryChange,
    filters,
    setFilters: handleFilterChange,
    resetFilters,
    filteredFormattedData: filteredFormattedRows,
  };
}

export { useGlobalFiltering };
