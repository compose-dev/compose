import { useCallback, useEffect, useRef, useState } from "react";
import { VisibilityState } from "@tanstack/react-table";
import { TableColumnProp } from "./constants";
import * as Views from "./views";

function getColumnVisibilityState(
  columns: TableColumnProp[],
  activeView: Views.ViewValidatedFormat
) {
  const visibilityState: Record<string, boolean> = columns.reduce(
    (acc, column) => {
      acc[column.id] = !column.hidden;
      return acc;
    },
    {} as Record<string, boolean>
  );

  if (activeView.columns) {
    const activeViewKeys = Object.keys(activeView.columns);
    for (const key of activeViewKeys) {
      if ("hidden" in activeView.columns[key]!) {
        visibilityState[key] = !activeView.columns[key].hidden;
      }
    }
  }

  return visibilityState;
}

function columnVisibilityEquals(a: VisibilityState, b: VisibilityState) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function useColumnVisibility(
  columns: TableColumnProp[],
  activeView: Views.ViewValidatedFormat
) {
  const initialColumnVisibility = useRef<VisibilityState>(
    getColumnVisibilityState(columns, activeView)
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility.current
  );

  const lastAppliedViewKey = useRef<string>(activeView.key);

  useEffect(() => {
    const newColumnVisibility = getColumnVisibilityState(columns, activeView);

    if (activeView.key !== lastAppliedViewKey.current) {
      lastAppliedViewKey.current = activeView.key;
      initialColumnVisibility.current = newColumnVisibility;
      setColumnVisibility(newColumnVisibility);
    } else if (
      !columnVisibilityEquals(
        newColumnVisibility,
        initialColumnVisibility.current
      )
    ) {
      initialColumnVisibility.current = newColumnVisibility;
      setColumnVisibility(newColumnVisibility);
    }
  }, [columns, activeView]);

  const resetColumnVisibility = useCallback(() => {
    setColumnVisibility(initialColumnVisibility.current);
  }, []);

  return {
    columnVisibility,
    setColumnVisibility,
    resetColumnVisibility,
  };
}

export { useColumnVisibility };
