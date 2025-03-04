import { UI } from "@composehq/ts-public";

import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";

interface ShowInputLocalErrorsEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.SHOW_INPUT_LOCAL_ERRORS;
  properties: {
    componentId: string;
    renderId: string;
  };
}

function showInputLocalErrors(
  state: AppStore,
  event: ShowInputLocalErrorsEvent
): Partial<AppStore> {
  if (event.properties.renderId in state.flattenedOutput) {
    const component =
      state.flattenedOutput[event.properties.renderId][
        event.properties.componentId
      ];

    if (!component || component.interactionType !== UI.INTERACTION_TYPE.INPUT) {
      return {};
    }

    return {
      flattenedOutput: {
        ...state.flattenedOutput,
        [event.properties.renderId]: {
          ...state.flattenedOutput[event.properties.renderId],
          [event.properties.componentId]: {
            ...component,
            validation: {
              ...component.validation,
              showLocalErrorIfExists: true,
            },
          },
        },
      },
    };
  }

  return {};
}

export { showInputLocalErrors, type ShowInputLocalErrorsEvent };
