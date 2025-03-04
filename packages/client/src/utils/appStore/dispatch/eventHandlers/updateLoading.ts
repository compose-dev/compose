import { AppRunnerBaseEvent } from "../types/baseEvent";
import { APP_RUNNER_EVENT_TYPE } from "../types/eventType";
import { type AppStore } from "../../types";
import { Page } from "@composehq/ts-public";

interface UpdateLoadingEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.UPDATE_LOADING;
  properties: {
    value: Page.loading.Value;
    properties?: Page.loading.Properties;
  };
}

function getProperties(
  wasLoading: boolean,
  isLoading: boolean,
  oldProperties?: Page.loading.Properties,
  newProperties?: Page.loading.Properties
) {
  // If it's no longer loading, keep the old properties for animation purposes.
  // As long as loading is set to false, this shouldn't interfere with anything
  if (isLoading === false) {
    return oldProperties;
  }

  // If it's newly loading, then set the properties to whatever was passed in.
  if (wasLoading === false) {
    return newProperties;
  }

  // Else, we'll merge the new properties into the old ones.
  const oldObj = oldProperties || {};
  const newObj = newProperties || {};

  return {
    ...oldObj,
    ...newObj,
  };
}

function updateLoading(
  state: AppStore,
  event: UpdateLoadingEvent
): Partial<AppStore> {
  const newProperties = getProperties(
    state.loading.value,
    event.properties.value,
    state.loading.properties,
    event.properties.properties
  );

  return {
    loading: {
      value: event.properties.value,
      properties: newProperties,
    },
  };
}

export { updateLoading, type UpdateLoadingEvent };
