import { UI } from "@composehq/ts-public";
import * as Views from "./views";
import { useDataControl } from "./useDataControl";
import { useCallback } from "react";

function noop<T>(value: T) {
  return value;
}

const isEqual = <T>(a: T, b: T) => a === b;

function useTableOverflow({
  overflow,
  appliedView,
}: {
  overflow: UI.Table.OverflowBehavior;
  appliedView: Views.ViewValidatedFormat;
}) {
  const getCurrentServerValue = useCallback(() => {
    if (appliedView.overflow) {
      return appliedView.overflow;
    }

    return overflow;
  }, [appliedView, overflow]);

  return useDataControl<
    UI.Table.OverflowBehavior,
    UI.Table.OverflowBehavior,
    UI.Table.OverflowBehavior
  >({
    isEnabled: true,
    getCurrentServerValue,
    getResetValue: getCurrentServerValue,
    serverToDraft: noop,
    draftToApplied: noop,
    appliedToServer: noop,
    serverValuesAreEqual: isEqual,
    disabledValue: UI.Table.OVERFLOW_BEHAVIOR.ELLIPSIS,
    paginated: false,
  });
}

export { useTableOverflow };
