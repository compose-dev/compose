import { useCallback, useMemo } from "react";
import {
  FormattedTableRow,
  INTERNAL_COLUMN_ID,
  TableColumnProp,
} from "./constants";
import { Row } from "@tanstack/react-table";
import { UI } from "@composehq/ts-public";

function useSearch(columns: TableColumnProp[]) {
  const keyToFormat = useMemo(() => {
    return columns.reduce<Record<string, string | undefined>>((acc, column) => {
      acc[column.accessorKey] = column.format;
      return acc;
    }, {});
  }, [columns]);

  const searchTable = useCallback(
    (row: Row<FormattedTableRow>, columnId: string, filterValue: string) => {
      if (keyToFormat[columnId] === UI.Table.COLUMN_FORMAT.date) {
        return row.original[INTERNAL_COLUMN_ID.META][columnId]
          ?.toLowerCase()
          ?.includes(filterValue.toLowerCase());
      }

      if (keyToFormat[columnId] === UI.Table.COLUMN_FORMAT.datetime) {
        return row.original[INTERNAL_COLUMN_ID.META][columnId]
          ?.toLowerCase()
          ?.includes(filterValue.toLowerCase());
      }

      if (keyToFormat[columnId] === UI.Table.COLUMN_FORMAT.json) {
        return JSON.stringify(row.original[columnId])
          ?.toLowerCase()
          ?.includes(filterValue.toLowerCase());
      }

      if (row.original[columnId]) {
        return row.original[columnId]
          ?.toString()
          ?.toLowerCase()
          ?.includes(filterValue.toLowerCase());
      }

      return false;
    },
    [keyToFormat]
  );

  return searchTable;
}

export { useSearch };
