import { AppRunnerBaseEvent } from "../types/baseEvent";
import { APP_RUNNER_EVENT_TYPE } from "../types/eventType";
import { type AppStore } from "../../types";

interface SetPageConfigEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.SET_PAGE_CONFIG;
  properties: {
    config: Partial<AppStore["config"]>;
  };
}

function setPageConfig(
  state: AppStore,
  event: SetPageConfigEvent
): Partial<AppStore> {
  const newConfig = {
    ...state.config,
    ...event.properties.config,
  };

  return {
    config: newConfig,
  };
}

export { setPageConfig, type SetPageConfigEvent };
