import { UI } from "@composehq/ts-public";

import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";

interface RemoveInputRemoteErrorsEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.REMOVE_INPUT_REMOTE_ERRORS;
  properties: {
    componentId: string;
    renderId: string;
  };
}

function removeInputRemoteErrors(
  state: AppStore,
  event: RemoveInputRemoteErrorsEvent
): Partial<AppStore> {
  if (event.properties.renderId in state.flattenedOutput) {
    const outputsById = { ...state.flattenedOutput[event.properties.renderId] };

    const inputComponent = outputsById[event.properties.componentId];

    if (
      !inputComponent ||
      inputComponent.interactionType !== UI.INTERACTION_TYPE.INPUT
    ) {
      return {};
    }

    outputsById[event.properties.componentId] = {
      ...inputComponent,
      validation: {
        ...inputComponent.validation,
        remoteErrorMessage: null,
      },
    };

    return {
      flattenedOutput: {
        ...state.flattenedOutput,
        [event.properties.renderId]: outputsById,
      },
    };
  }

  return {};
}

export { removeInputRemoteErrors, type RemoveInputRemoteErrorsEvent };
