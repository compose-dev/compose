import { TableColumnProp, FormattedTableRow } from "../constants";
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
} from "./filterModel";
import { filterTableRow } from "./filterTableRow";
import { searchTableRow } from "./searchTableRow";

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
  disableSearch: boolean,
  searchQueryRef: MutableRefObject<string | null>,
  filterByRef: MutableRefObject<
    UI.Table.AdvancedFilterModel<FormattedTableRow[]>
  >
) {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [filters, setFilters] = useState<EditableAdvancedFilterModel>(null);

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
          searchQueryRef.current,
          filterByRef.current,
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
    if (paginated || disableSearch) {
      setFilteredFormattedRows(rows);
    }

    filterRows(
      rows,
      columns,
      searchQueryRef.current,
      filterByRef.current,
      columnFormatMap
    );
  }, [
    rows,
    columns,
    filterRows,
    paginated,
    disableSearch,
    searchQueryRef,
    filterByRef,
    columnFormatMap,
  ]);

  const handleSearchQueryChange = useCallback(
    (value: string | null) => {
      if (disableSearch) {
        return;
      }

      setSearchQuery(value);
      searchQueryRef.current = value;

      if (!paginated) {
        filterRowsThrottled(
          rows,
          columns,
          value,
          filterByRef.current,
          columnFormatMap
        );
      }
    },
    [
      filterRowsThrottled,
      rows,
      columns,
      disableSearch,
      paginated,
      searchQueryRef,
      filterByRef,
      columnFormatMap,
    ]
  );

  const handleFilterChange = useCallback(
    (value: EditableAdvancedFilterModel) => {
      setFilters(value);

      const validFilterModel = getValidFilterModel(value);
      filterByRef.current = validFilterModel;

      if (!paginated) {
        filterRows(
          rows,
          columns,
          searchQueryRef.current,
          validFilterModel,
          columnFormatMap
        );
      }
    },
    [
      filterByRef,
      filterRows,
      paginated,
      rows,
      columns,
      searchQueryRef,
      columnFormatMap,
    ]
  );

  return {
    searchQuery,
    setSearchQuery: handleSearchQueryChange,
    filters,
    setFilters: handleFilterChange,
    filteredFormattedData: filteredFormattedRows,
  };
}

export { useGlobalFiltering };
