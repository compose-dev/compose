import { UI } from "@composehq/ts-public";

import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";

interface RemoveFormRemoteErrorsEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.REMOVE_FORM_REMOTE_ERRORS;
  properties: {
    formId: string;
    renderId: string;
  };
}

function removeFormRemoteErrors(
  state: AppStore,
  event: RemoveFormRemoteErrorsEvent
): Partial<AppStore> {
  if (event.properties.renderId in state.flattenedOutput) {
    const outputsById = {
      ...state.flattenedOutput[event.properties.renderId],
    };

    const formComponent = outputsById[event.properties.formId];

    if (formComponent.type === UI.TYPE.LAYOUT_FORM) {
      outputsById[event.properties.formId] = {
        ...formComponent,
        validation: {
          ...formComponent.validation,
          remoteErrorMessage: null,
        },
      };
    }

    for (const componentId in outputsById) {
      const component = outputsById[componentId];

      const formId =
        state.flattenedModel[event.properties.renderId][componentId].formId;

      if (
        formId === event.properties.formId &&
        component.interactionType === UI.INTERACTION_TYPE.INPUT
      ) {
        outputsById[componentId] = {
          ...component,
          validation: {
            ...component.validation,
            remoteErrorMessage: null,
          },
        };
      }
    }

    return {
      flattenedOutput: {
        ...state.flattenedOutput,
        [event.properties.renderId]: outputsById,
      },
    };
  }

  return {};
}

export { removeFormRemoteErrors, type RemoveFormRemoteErrorsEvent };
