import { Page } from "@composehq/ts-public";

import { AppRunnerBaseEvent } from "../types/baseEvent";
import { APP_RUNNER_EVENT_TYPE } from "../types/eventType";
import { type AppStore } from "../../types";

interface RestartAppEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.RESTART_APP;
  properties: {
    executionId: string | null;
    route: string | null;
  };
}

function restartApp(event: RestartAppEvent): Partial<AppStore> {
  return {
    error: null,
    renders: [],
    renderToRootComponent: {},
    flattenedModel: {},
    flattenedOutput: {},
    config: Page.DEFAULT_CONFIG,
    wentOffline: false,
    executionId: event.properties.executionId,
    route: event.properties.route,
    pageConfirm: null,
    loading: {
      value: false,
    },
    stale: {},
  };
}

export { restartApp, type RestartAppEvent };
