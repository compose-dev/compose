import {
  FormattedTableRow,
  TableColumnProp,
  INTERNAL_COLUMN_ID,
} from "../constants";
import { UI } from "@composehq/ts-public";

function searchTableRow(
  row: FormattedTableRow,
  columns: TableColumnProp[],
  formattedSearchQuery: string
) {
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    const columnId = column.id;

    if (column.format === UI.Table.COLUMN_FORMAT.date) {
      if (
        row[INTERNAL_COLUMN_ID.META][columnId]
          ?.toLowerCase()
          ?.includes(formattedSearchQuery)
      ) {
        return true;
      }
    }

    if (column.format === UI.Table.COLUMN_FORMAT.datetime) {
      if (
        row[INTERNAL_COLUMN_ID.META][columnId]
          ?.toLowerCase()
          ?.includes(formattedSearchQuery)
      ) {
        return true;
      }
    }

    if (column.format === UI.Table.COLUMN_FORMAT.json) {
      if (
        JSON.stringify(row[columnId])
          ?.toLowerCase()
          ?.includes(formattedSearchQuery)
      ) {
        return true;
      }
    }

    if (row[columnId]) {
      if (
        row[columnId]?.toString()?.toLowerCase()?.includes(formattedSearchQuery)
      ) {
        return true;
      }
    }
  }

  return false;
}

export { searchTableRow };
