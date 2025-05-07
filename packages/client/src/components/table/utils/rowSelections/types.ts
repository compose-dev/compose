import { FormattedTableRow, TanStackTable } from "../constants";

type ToggleRowSelection = (
  enabled: boolean,
  toggleCurrentRow: () => void,
  row: FormattedTableRow,
  isShiftClick: boolean,
  table: TanStackTable,
  rowSelections: Record<string, boolean>,
  setRowSelections: (rowSelections: Record<string, boolean>) => void
) => void;

export type { ToggleRowSelection };
