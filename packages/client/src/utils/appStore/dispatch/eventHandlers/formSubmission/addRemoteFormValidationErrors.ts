import { ServerToBrowserEvent } from "@compose/ts";
import { UI } from "@composehq/ts-public";

import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";

interface AddRemoteFormValidationErrorsEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.ADD_REMOTE_FORM_VALIDATION_ERRORS;
  properties: {
    formComponentId: string;
    renderId: string;
    inputComponentErrors: ServerToBrowserEvent.FormValidationError.Data["inputComponentErrors"];
    formError: ServerToBrowserEvent.FormValidationError.Data["formError"];
  };
}

function addRemoteFormValidationErrors(
  state: AppStore,
  event: AddRemoteFormValidationErrorsEvent
): Partial<AppStore> {
  const { formComponentId, renderId, inputComponentErrors, formError } =
    event.properties;

  const outputsById: AppStore["flattenedOutput"][string] = {
    ...state.flattenedOutput[renderId],
  };

  const formComponent = outputsById[formComponentId];

  if (formComponent.type !== UI.TYPE.LAYOUT_FORM) {
    return {};
  }

  if (inputComponentErrors !== null) {
    for (const inputComponentId in inputComponentErrors) {
      const inputComponent = outputsById[inputComponentId];

      if (inputComponent.interactionType !== UI.INTERACTION_TYPE.INPUT) {
        continue;
      }

      outputsById[inputComponentId] = {
        ...inputComponent,
        validation: {
          ...inputComponent.validation,
          remoteErrorMessage: inputComponentErrors[inputComponentId],
        },
      };
    }
  }

  if (formError !== null) {
    outputsById[formComponentId] = {
      ...formComponent,
      validation: {
        ...formComponent.validation,
        remoteErrorMessage: formError,
      },
    };
  }

  return {
    flattenedOutput: {
      ...state.flattenedOutput,
      [renderId]: outputsById,
    },
  };
}

export {
  type AddRemoteFormValidationErrorsEvent,
  addRemoteFormValidationErrors,
};
