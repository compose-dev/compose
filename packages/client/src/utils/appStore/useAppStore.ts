import { Page } from "@composehq/ts-public";
import { create } from "zustand";

import { type AppStore } from "./types";
import { appRunnerReducer } from "./dispatch";
import { getFormData } from "./utils";

const useAppStore = create<AppStore>()((set, get) => ({
  error: null,
  renders: [],
  renderToRootComponent: {},
  flattenedModel: {},
  flattenedOutput: {},
  config: Page.DEFAULT_CONFIG,
  wentOffline: false,
  executionId: null,
  route: null,
  pageConfirm: null,
  dispatch: (event) => set((state) => appRunnerReducer(state, event)),
  getFormData: (formId, renderId) => {
    const store = get();
    return getFormData(formId, renderId, store);
  },
  renderToMetadata: {},
  loading: {
    value: false,
  },
  stale: {},
}));

export { useAppStore };
