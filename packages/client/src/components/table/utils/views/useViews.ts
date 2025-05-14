import { UI } from "@composehq/ts-public";
import { useCallback } from "react";
import {
  ViewServerFormat,
  ViewDisplayFormat,
  ViewValidatedFormat,
  NO_VIEW_APPLIED_KEY,
} from "./constants";
import { FormattedTableRow } from "../constants";
import { useDataControl } from "../useDataControl";

const BASE_VIEW = {
  searchQuery: null,
  columns: {},
  sortBy: [],
  filterBy: null,
  label: "Default",
  description: undefined,
};

function getView(
  view: UI.Table.ViewInternal<FormattedTableRow[]>
): ViewValidatedFormat {
  return { ...BASE_VIEW, ...view };
}

function serverValuesAreEqual(
  oldValue: ViewServerFormat,
  newValue: ViewServerFormat
) {
  return oldValue === newValue;
}

function appliedToServer(applied: ViewValidatedFormat): ViewServerFormat {
  if (applied.key === NO_VIEW_APPLIED_KEY) {
    return undefined;
  }

  return applied.key;
}

function useViews({
  views,
  serverViewBy,
  paginated,
}: {
  views: UI.Table.ViewInternal<FormattedTableRow[]>[];
  serverViewBy?: string;
  paginated: boolean;
}) {
  const getCurrentServerValue = useCallback(() => {
    if (paginated) {
      return serverViewBy;
    }

    if (!views || views.length === 0) {
      return undefined;
    }

    const defaultView = views.find((view) => view.isDefault);

    if (defaultView === undefined) {
      return undefined;
    }

    return defaultView.key;
  }, [paginated, serverViewBy, views]);

  const getResetValue = useCallback(() => {
    if (!views || views.length === 0) {
      return undefined;
    }

    const defaultView = views.find((view) => view.isDefault);

    if (defaultView === undefined) {
      return undefined;
    }

    return defaultView.key;
  }, [views]);

  const serverToDraft = useCallback(
    (server: ViewServerFormat) => {
      if (!server) {
        return NO_VIEW_APPLIED_KEY;
      }

      if (!views || views.length === 0) {
        return NO_VIEW_APPLIED_KEY;
      }

      const view = views.find((view) => view.key === server);

      if (view === undefined) {
        return NO_VIEW_APPLIED_KEY;
      }

      return view.key;
    },
    [views]
  );

  const draftToApplied = useCallback(
    (draft: ViewDisplayFormat) => {
      if (draft === NO_VIEW_APPLIED_KEY) {
        return getView({
          key: NO_VIEW_APPLIED_KEY,
          label: NO_VIEW_APPLIED_KEY,
        });
      }

      const view = views.find((view) => view.key === draft);

      if (view === undefined) {
        return getView({
          key: NO_VIEW_APPLIED_KEY,
          label: NO_VIEW_APPLIED_KEY,
        });
      }

      return getView(view);
    },
    [views]
  );

  const data = useDataControl<
    ViewDisplayFormat,
    ViewValidatedFormat,
    ViewServerFormat
  >({
    getCurrentServerValue,
    getResetValue,
    serverValuesAreEqual,

    draftToApplied,
    appliedToServer,
    serverToDraft,

    isEnabled: true,
    disabledValue: undefined,
    paginated,
  });

  return data;
}

export { useViews };
