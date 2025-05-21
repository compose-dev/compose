import { useCallback, useEffect, useRef, useState } from 'react';
import { UI } from '@composehq/ts-public';
import { Views } from './views';

interface UseTableOverflowProps {
  overflow?: UI.Table.OverflowBehavior;
  activeView?: Views.ViewValidatedFormat;
}

// Using the correct values for UI.Table.OverflowBehavior based on user feedback.
type OverflowBehavior = 'Dynamic' | 'Clip' | 'Ellipsis';

const useTableOverflow = ({
  overflow: initialOverflowProp,
  activeView,
}: UseTableOverflowProps) => {
  const getInitialOverflow = useCallback((): OverflowBehavior => {
    // Prioritize active view's overflow, then the initial prop, then default to 'Ellipsis'.
    return (activeView?.overflow as OverflowBehavior) ?? (initialOverflowProp as OverflowBehavior) ?? 'Ellipsis';
  }, [activeView, initialOverflowProp]);

  const [tableOverflow, setTableOverflowState] = useState<OverflowBehavior>(getInitialOverflow());
  const initialOverflowRef = useRef<OverflowBehavior>(getInitialOverflow());
  const lastAppliedViewKey = useRef<string | undefined>(activeView?.key);

  const setTableOverflow = useCallback((newOverflow: OverflowBehavior) => {
    setTableOverflowState(newOverflow);
  }, []);

  const resetTableOverflow = useCallback(() => {
    setTableOverflowState(initialOverflowRef.current);
  }, []);

  useEffect(() => {
    const newInitialOverflow = getInitialOverflow();
    
    if (activeView?.key !== lastAppliedViewKey.current) {
      // View has changed
      initialOverflowRef.current = newInitialOverflow;
      setTableOverflowState(newInitialOverflow);
      lastAppliedViewKey.current = activeView?.key;
    } else if (activeView?.key === lastAppliedViewKey.current) {
      // View is the same, but its properties might have changed (e.g. view was edited)
      if (activeView?.overflow !== undefined && activeView.overflow !== tableOverflow) {
        setTableOverflowState(activeView.overflow as OverflowBehavior);
        // Update initialOverflowRef as well if the view's overflow is now the source of truth
        initialOverflowRef.current = activeView.overflow as OverflowBehavior;
      } else if (activeView?.overflow === undefined && tableOverflow !== newInitialOverflow) {
        // View is the same, view doesn't specify overflow, and current overflow is not the initial table prop
        // This means we should revert to the table's base prop or the default 'Ellipsis'
        setTableOverflowState(newInitialOverflow);
        initialOverflowRef.current = newInitialOverflow;
      }
    }
    // If initialOverflowProp itself changes, reflect that change.
    // This handles cases where the table's base overflow prop is updated.
    else if (initialOverflowProp && initialOverflowProp !== tableOverflow && activeView?.overflow === undefined) {
        setTableOverflowState(initialOverflowProp as OverflowBehavior);
        initialOverflowRef.current = initialOverflowProp as OverflowBehavior;
    }


  }, [activeView, initialOverflowProp, getInitialOverflow, tableOverflow]);


  return {
    tableOverflow,
    setTableOverflow,
    resetTableOverflow,
  };
};

export default useTableOverflow;
