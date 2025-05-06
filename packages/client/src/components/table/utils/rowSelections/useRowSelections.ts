import { useCallback, useEffect, useRef } from "react";
import { FormattedTableRow, TanStackTable } from "../constants";
import { getRowSelectionId } from "./utils";
import { Row } from "@tanstack/react-table";

function getRowSelectionRange(
  anchorId: string | number,
  targetId: string | number,
  tableRows: Row<FormattedTableRow>[]
) {
  let anchorIndex = -1;
  let targetIndex = -1;

  for (let i = 0; i < tableRows.length; i++) {
    const currentRowId = tableRows[i].id;
    if (currentRowId === anchorId) {
      anchorIndex = i;
    }
    if (currentRowId === targetId) {
      targetIndex = i;
    }
    // If both indices are found, no need to continue iterating
    if (anchorIndex !== -1 && targetIndex !== -1) {
      break;
    }
  }

  return { anchorIndex, targetIndex };
}

function useRowSelections(
  preFilteredRows: FormattedTableRow[],
  selectable: "single" | "multi" | false
) {
  const anchorRowId = useRef<string | number | null>(null);

  // If the anchor row is no longer in the table, reset the anchor!
  useEffect(() => {
    if (selectable === "single" || selectable === false) {
      anchorRowId.current = null;
      return;
    }

    if (anchorRowId.current !== null) {
      const tableIncludesAnchor = preFilteredRows.some(
        (row) => getRowSelectionId(row) === anchorRowId.current
      );
      if (!tableIncludesAnchor) {
        anchorRowId.current = null;
      }
    }
  }, [preFilteredRows, selectable]);

  const toggleRowSelection = useCallback(
    (
      enabled: boolean,
      toggleCurrentRow: () => void,
      row: FormattedTableRow,
      isShiftClick: boolean,
      table: TanStackTable,
      rowSelections: Record<string, boolean>,
      setRowSelections: (rowSelections: Record<string, boolean>) => void
    ) => {
      console.log(row);
      const targetRowId = getRowSelectionId(row);

      function toggleSingleRow() {
        if (enabled) {
          anchorRowId.current = targetRowId;
        }
        console.log("toggling...");
        toggleCurrentRow();
      }

      if (isShiftClick && selectable === "multi") {
        const newRowSelections = { ...rowSelections };

        if (anchorRowId.current === null) {
          toggleSingleRow();
          return;
        }

        const tableRows = table.getRowModel().rows;
        const { anchorIndex, targetIndex } = getRowSelectionRange(
          anchorRowId.current,
          targetRowId,
          tableRows
        );

        if (anchorIndex === -1) {
          toggleSingleRow();
          return;
        }

        // We should never get here! If we do, exit without doing anything.
        if (targetIndex === -1) {
          return;
        }

        const startIndex = Math.min(anchorIndex, targetIndex);
        const endIndex = Math.max(anchorIndex, targetIndex);

        for (let i = startIndex; i <= endIndex; i++) {
          newRowSelections[getRowSelectionId(tableRows[i].original)] = true;
        }

        setRowSelections(newRowSelections);
        anchorRowId.current = targetRowId;
      } else {
        toggleSingleRow();
      }
    },
    [selectable]
  );

  return {
    toggleRowSelection,
  };
}

export { useRowSelections };
