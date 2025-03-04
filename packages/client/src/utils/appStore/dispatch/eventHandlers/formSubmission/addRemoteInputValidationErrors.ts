import { ServerToBrowserEvent } from "@compose/ts";
import { UI } from "@composehq/ts-public";

import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";

interface AddRemoteInputValidationErrorsEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.ADD_REMOTE_INPUT_VALIDATION_ERRORS;
  properties: {
    componentId: string;
    renderId: string;
    error: ServerToBrowserEvent.InputValidationError.Data["error"];
  };
}

function addRemoteInputValidationErrors(
  state: AppStore,
  event: AddRemoteInputValidationErrorsEvent
): Partial<AppStore> {
  const outputsById = { ...state.flattenedOutput[event.properties.renderId] };

  const inputComponent = outputsById[event.properties.componentId];

  if (inputComponent.interactionType !== UI.INTERACTION_TYPE.INPUT) {
    return {};
  }

  outputsById[event.properties.componentId] = {
    ...inputComponent,
    validation: {
      ...inputComponent.validation,
      remoteErrorMessage: event.properties.error,
    },
  };

  return {
    flattenedOutput: {
      ...state.flattenedOutput,
      [event.properties.renderId]: outputsById,
    },
  };
}

export {
  type AddRemoteInputValidationErrorsEvent,
  addRemoteInputValidationErrors,
};
