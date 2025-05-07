import { FormattedTableRow, INTERNAL_COLUMN_ID } from "../constants";

function getRowSelectionId(row: FormattedTableRow) {
  return row[INTERNAL_COLUMN_ID.META][INTERNAL_COLUMN_ID.ROW_SELECTION];
}

function getIsSelected(
  rowSelections: Record<string, boolean>,
  row: FormattedTableRow
) {
  return !!rowSelections[getRowSelectionId(row)];
}

function getSelectedRows(
  rowSelections: Record<string, boolean>,
  preFilteredRows: FormattedTableRow[]
) {
  return preFilteredRows.filter((row) => getIsSelected(rowSelections, row));
}

export { getRowSelectionId, getIsSelected, getSelectedRows };
