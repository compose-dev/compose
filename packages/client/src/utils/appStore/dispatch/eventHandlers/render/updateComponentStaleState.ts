import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";
import { UI } from "@composehq/ts-public";
import { getStaleStateKey } from "../../../utils";

interface UpdateComponentStaleStateEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.UPDATE_COMPONENT_STALE_STATE;
  properties: {
    renderId: string;
    componentId: string;
    stale: UI.Stale.Option;
  };
}

function updateComponentStaleState(
  state: AppStore,
  event: UpdateComponentStaleStateEvent
): Partial<AppStore> {
  const staleStateKey = getStaleStateKey({
    renderId: event.properties.renderId,
    componentId: event.properties.componentId,
  });

  return {
    stale: {
      ...state.stale,
      [staleStateKey]: event.properties.stale,
    },
  };
}

export { updateComponentStaleState, type UpdateComponentStaleStateEvent };
