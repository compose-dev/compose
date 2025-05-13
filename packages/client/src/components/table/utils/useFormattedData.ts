import {
  TableColumnProp,
  INTERNAL_COLUMN_ID,
  FormattedTableRow,
} from "./constants";

import { u } from "@compose/ts";
import { UI } from "@composehq/ts-public";

import { useEffect, useMemo, useState } from "react";

function useFormattedData(
  data: UI.Components.InputTable["model"]["properties"]["data"],
  columns: TableColumnProp[],
  offset: number,
  primaryKey: string | number | undefined
) {
  const result = useMemo(() => {
    const metaColumns = columns.filter(
      (col) =>
        col.format === UI.Table.COLUMN_FORMAT.date ||
        col.format === UI.Table.COLUMN_FORMAT.datetime
    );

    const primaryKeyMap: Record<string, string | number> = {};
    const formattedRows: FormattedTableRow[] = [];

    data.forEach((row, rowIdx) => {
      let rowId: string;

      try {
        if (primaryKey) {
          rowId = row[primaryKey].toString();
          primaryKeyMap[rowId] = row[primaryKey];
        } else {
          rowId = (rowIdx + offset).toString();
          primaryKeyMap[rowId] = rowIdx + offset;
        }
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

      formattedRows.push({
        ...row,
        [INTERNAL_COLUMN_ID.META]: meta,
      });
    });

    return { formattedRows, primaryKeyMap };
  }, [data, columns, offset, primaryKey]);

  const [primaryKeyMap, setPrimaryKeyMap] = useState<
    Record<string, string | number>
  >(result.primaryKeyMap);

  useEffect(() => {
    setPrimaryKeyMap((oldMap) => {
      return { ...oldMap, ...result.primaryKeyMap };
    });
  }, [result.primaryKeyMap]);

  return { formattedRows: result.formattedRows, primaryKeyMap };
}

export { useFormattedData };
