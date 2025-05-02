import { useCallback, useEffect, useRef, useState } from "react";
import { INTERNAL_COLUMN_ID } from "./constants";
import { ColumnPinningState, Updater } from "@tanstack/react-table";
import { TableColumnProp } from "./constants";
import { UI } from "@composehq/ts-public";

function getColumnPinningState(
  enableRowSelection: boolean,
  columns: TableColumnProp[],
  hasActions: boolean
) {
  const left = columns
    .filter((column) => column.pinned === UI.Table.PINNED_SIDE.LEFT)
    .map((column) => column.id);
  const right = columns
    .filter((column) => column.pinned === UI.Table.PINNED_SIDE.RIGHT)
    .map((column) => column.id);

  return correctColumnPinningState(
    enableRowSelection,
    { left, right },
    hasActions
  );
}

function correctColumnPinningState(
  enableRowSelection: boolean,
  columnPinning: ColumnPinningState,
  hasActions: boolean
) {
  function getLeft() {
    if (!enableRowSelection || !columnPinning.left) {
      return columnPinning.left;
    }

    const nonSelectColumns = columnPinning.left.filter(
      (column) => column !== INTERNAL_COLUMN_ID.SELECT
    );

    if (nonSelectColumns.length > 0) {
      return [INTERNAL_COLUMN_ID.SELECT, ...nonSelectColumns];
    }

    return [];
  }

  function getRight() {
    if (!hasActions) {
      return columnPinning.right;
    }

    if (!columnPinning.right) {
      return [INTERNAL_COLUMN_ID.ACTION];
    }

    const nonActionColumns = columnPinning.right.filter(
      (column) => column !== INTERNAL_COLUMN_ID.ACTION
    );

    if (nonActionColumns.length > 0) {
      return [...nonActionColumns, INTERNAL_COLUMN_ID.ACTION];
    }

    return [INTERNAL_COLUMN_ID.ACTION];
  }

  return {
    left: getLeft(),
    right: getRight(),
  };
}

function columnPinningEquals(a: ColumnPinningState, b: ColumnPinningState) {
  // Compare left arrays
  const leftA = a.left || [];
  const leftB = b.left || [];

  if (leftA.length !== leftB.length) {
    return false;
  }

  for (let i = 0; i < leftA.length; i++) {
    if (leftA[i] !== leftB[i]) {
      return false;
    }
  }

  // Compare right arrays
  const rightA = a.right || [];
  const rightB = b.right || [];

  if (rightA.length !== rightB.length) {
    return false;
  }

  for (let i = 0; i < rightA.length; i++) {
    if (rightA[i] !== rightB[i]) {
      return false;
    }
  }

  return true;
}

function useColumnPinning(
  enableRowSelection: boolean,
  columns: TableColumnProp[],
  hasActions: boolean
) {
  const initialColumnPinning = useRef<ColumnPinningState>(
    getColumnPinningState(enableRowSelection, columns, hasActions)
  );

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
    initialColumnPinning.current
  );

  useEffect(() => {
    const newColumnPinning = getColumnPinningState(
      enableRowSelection,
      columns,
      hasActions
    );

    if (!columnPinningEquals(newColumnPinning, initialColumnPinning.current)) {
      initialColumnPinning.current = newColumnPinning;
      setColumnPinning(newColumnPinning);
    }
  }, [enableRowSelection, columns, hasActions]);

  const handleColumnPinningChange = useCallback(
    (newValue: Updater<ColumnPinningState>) => {
      const newColumnPinning =
        typeof newValue === "function"
          ? newValue(columnPinning)
          : columnPinning;

      setColumnPinning(
        correctColumnPinningState(
          enableRowSelection,
          newColumnPinning,
          hasActions
        )
      );
    },
    [enableRowSelection, hasActions, columnPinning]
  );

  const resetColumnPinning = useCallback(() => {
    setColumnPinning(initialColumnPinning.current);
  }, []);

  return {
    columnPinning,
    setColumnPinning: handleColumnPinningChange,
    resetColumnPinningToInitial: resetColumnPinning,
  };
}

export { useColumnPinning };
