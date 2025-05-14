import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { INTERNAL_COLUMN_ID } from "./constants";
import { ColumnPinningState, Updater } from "@tanstack/react-table";
import { TableColumnProp } from "./constants";
import { UI } from "@composehq/ts-public";
import * as Views from "./views";

function getColumnPinningState(
  enableRowSelection: boolean,
  columns: TableColumnProp[],
  hasActions: boolean,
  activeView: Views.ViewValidatedFormat,
  columnNameToIdMap: Record<string, string>
) {
  let left = columns
    .filter((column) => column.pinned === UI.Table.PINNED_SIDE.LEFT)
    .map((column) => column.id);
  let right = columns
    .filter((column) => column.pinned === UI.Table.PINNED_SIDE.RIGHT)
    .map((column) => column.id);

  if (activeView.columns) {
    const activeViewKeys = Object.keys(activeView.columns);
    for (const key of activeViewKeys) {
      const pinnedValue = activeView.columns[key]?.pinned;
      if (pinnedValue === UI.Table.PINNED_SIDE.LEFT && !left.includes(key)) {
        left.push(columnNameToIdMap[key]);
      }

      if (pinnedValue === UI.Table.PINNED_SIDE.RIGHT && !right.includes(key)) {
        right.push(columnNameToIdMap[key]);
      }

      if (pinnedValue === UI.Table.PINNED_SIDE.NONE) {
        left = left.filter((column) => column !== columnNameToIdMap[key]);
        right = right.filter((column) => column !== columnNameToIdMap[key]);
      }
    }
  }

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
  hasActions: boolean,
  activeView: Views.ViewValidatedFormat
) {
  const columnNameToIdMap = useMemo(() => {
    return columns.reduce(
      (acc, column) => {
        acc[column.original ?? column.id] = column.id;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [columns]);

  const initialColumnPinning = useRef<ColumnPinningState>(
    getColumnPinningState(
      enableRowSelection,
      columns,
      hasActions,
      activeView,
      columnNameToIdMap
    )
  );

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
    initialColumnPinning.current
  );

  const lastAppliedViewKey = useRef<string>(activeView.key);

  useEffect(() => {
    const newColumnPinning = getColumnPinningState(
      enableRowSelection,
      columns,
      hasActions,
      activeView,
      columnNameToIdMap
    );

    if (activeView.key !== lastAppliedViewKey.current) {
      initialColumnPinning.current = newColumnPinning;
      setColumnPinning(newColumnPinning);
    }

    // Else, only update the column pinning if it's different than the previous
    // initial state.
    else if (
      !columnPinningEquals(newColumnPinning, initialColumnPinning.current)
    ) {
      initialColumnPinning.current = newColumnPinning;
      setColumnPinning(newColumnPinning);
    }

    lastAppliedViewKey.current = activeView.key;
  }, [enableRowSelection, columns, hasActions, activeView, columnNameToIdMap]);

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

  // Account for case where row selection is enabled after the table is
  // initially rendered.
  useEffect(() => {
    setColumnPinning((prev) => {
      return {
        left: correctColumnPinningState(enableRowSelection, prev, true).left,
        right: prev.right,
      };
    });
  }, [enableRowSelection]);

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
