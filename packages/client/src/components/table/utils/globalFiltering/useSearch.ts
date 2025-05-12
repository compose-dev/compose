import { useCallback, useEffect } from "react";
import {
  DisplaySearchModel,
  ValidatedSearchModel,
  ServerSearchModel,
} from "./searchModel";
import { useDataControl } from "../useDataControl";
import * as Views from "../views";

function serverValuesAreEqual(
  oldValue: string | null,
  newValue: string | null
) {
  return oldValue === newValue;
}

function noop<T>(value: T) {
  return value;
}

function useSearch({
  serverSearchQuery,
  searchable,
  paginated,
  viewsHook,
}: {
  serverSearchQuery: ServerSearchModel | undefined;
  searchable: boolean;
  paginated: boolean;
  viewsHook: ReturnType<typeof Views.use>;
}) {
  const getCurrentServerValue = useCallback(() => {
    if (paginated) {
      return serverSearchQuery ?? null;
    }

    return viewsHook.appliedRef.current.searchQuery;
  }, [paginated, serverSearchQuery, viewsHook.appliedRef]);

  const getResetValue = useCallback(() => {
    return viewsHook.appliedRef.current.searchQuery;
  }, [viewsHook.appliedRef]);

  const dataControl = useDataControl<
    DisplaySearchModel,
    ValidatedSearchModel,
    ServerSearchModel
  >({
    getCurrentServerValue,
    draftToApplied: noop,
    appliedToServer: noop,
    serverToDraft: noop,
    serverValuesAreEqual,
    isEnabled: searchable,
    disabledValue: null,
    paginated,
    getResetValue,
  });

  useEffect(() => {
    dataControl.setIsEnabled(searchable);
  }, [searchable, dataControl]);

  return dataControl;
}

export { useSearch };
