import { UI } from "@composehq/ts-public";

import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";

interface ShowFormLocalErrorsEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.SHOW_FORM_LOCAL_ERRORS;
  properties: {
    formId: string;
    renderId: string;
  };
}

function showFormLocalErrors(
  state: AppStore,
  event: ShowFormLocalErrorsEvent
): Partial<AppStore> {
  if (event.properties.renderId in state.flattenedOutput) {
    const outputsById = { ...state.flattenedOutput[event.properties.renderId] };

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
            showLocalErrorIfExists: true,
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

export { showFormLocalErrors, type ShowFormLocalErrorsEvent };
