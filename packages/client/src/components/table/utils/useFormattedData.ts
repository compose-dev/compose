import {
  FormattedTableRow,
  TableColumnProp,
  INTERNAL_COLUMN_ID,
} from "./constants";

import { u } from "@compose/ts";
import { UI } from "@composehq/ts-public";

import { useMemo } from "react";

function useFormattedData(
  data: UI.Components.InputTable["model"]["properties"]["data"],
  columns: TableColumnProp[],
  offset: number,
  primaryKey: string | number | undefined
) {
  const formattedRows: FormattedTableRow[] = useMemo(() => {
    const metaColumns = columns.filter(
      (col) =>
        col.format === UI.Table.COLUMN_FORMAT.date ||
        col.format === UI.Table.COLUMN_FORMAT.datetime
    );

    const result = data.map((row, rowIdx) => {
      let rowId: string;

      try {
        rowId = primaryKey
          ? row[primaryKey].toString()
          : (rowIdx + offset).toString();
      } catch (e) {
        alert(
          `Error assigning a row ID to table row. Received error: ${e}. Returning a fallback row ID.`
        );

        rowId = (rowIdx + offset).toString();
      }

      const meta: Record<string, string> = {
        [INTERNAL_COLUMN_ID.ROW_SELECTION]: rowId,
      };

      for (const col of metaColumns) {
        if (col.format === UI.Table.COLUMN_FORMAT.date) {
          meta[col.accessorKey] = u.date.toString(
            u.date.fromISOString(row[col.accessorKey] as string),
            u.date.SerializedFormat["LLL d, yyyy"]
          );
        } else if (col.format === UI.Table.COLUMN_FORMAT.datetime) {
          const date = u.date.toString(
            u.date.fromISOString(row[col.accessorKey] as string),
            u.date.SerializedFormat["LLL d, yyyy"]
          );

          const time = u.date.toString(
            u.date.fromISOString(row[col.accessorKey] as string),
            u.date.SerializedFormat["h:mm a"]
          );

          meta[col.accessorKey] = `${date}, ${time}`;
        }
      }

      return {
        ...row,
        [INTERNAL_COLUMN_ID.META]: meta,
      };
    });

    return result;
  }, [data, columns, offset, primaryKey]);

  return formattedRows;
}

export { useFormattedData };
