import { FormattedTableRow, TableColumn } from "../constants";

import { u } from "@compose/ts";
import { UI } from "@composehq/ts-public";

import { INTERNAL_COLUMN_ID } from "../constants";
import { useMemo } from "react";

function useFormattedData(
  data: UI.Components.InputTable["model"]["properties"]["data"],
  columns: TableColumn[]
) {
  const formattedRows: FormattedTableRow[] = useMemo(() => {
    const metaColumns = columns.filter(
      (col) =>
        col.format === UI.Table.COLUMN_FORMAT.date ||
        col.format === UI.Table.COLUMN_FORMAT.datetime
    );

    const result = data.map((row) => {
      const meta: Record<string, string> = {};

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
  }, [data, columns]);

  return formattedRows;
}

export { useFormattedData };
