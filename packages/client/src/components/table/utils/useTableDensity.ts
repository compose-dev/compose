import { UI } from "@composehq/ts-public";
import * as Views from "./views";
import { useDataControl } from "./useDataControl";
import { useCallback } from "react";

function noop<T>(value: T) {
  return value;
}

const isEqual = <T>(a: T, b: T) => a === b;

function useTableDensity({
  density,
  appliedView,
}: {
  density: UI.Table.Density;
  appliedView: Views.ViewValidatedFormat;
}) {
  const getCurrentServerValue = useCallback(() => {
    if (appliedView.density) {
      return appliedView.density;
    }

    return density;
  }, [appliedView, density]);

  const data = useDataControl<
    UI.Table.Density,
    UI.Table.Density,
    UI.Table.Density
  >({
    isEnabled: true,
    getCurrentServerValue,
    getResetValue: getCurrentServerValue,
    serverToDraft: noop,
    draftToApplied: noop,
    appliedToServer: noop,
    serverValuesAreEqual: isEqual,
    disabledValue: UI.Table.DENSITY.STANDARD,
    paginated: false,
  });

  return data;
}

export { useTableDensity };
