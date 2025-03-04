import { UI } from "@composehq/ts-public";

import { UpdateInputValueEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";
import { getComponentLocalErrorMessage } from "../.utils";

interface UpdateDateInputValueEvent extends UpdateInputValueEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.UPDATE_DATE_INPUT_VALUE;
  properties: {
    renderId: string;
    componentId: string;
    internalValue: UI.Components.InputDate["output"]["internalValue"];
  };
}

function updateDateInputValue(
  appState: AppStore,
  event: UpdateDateInputValueEvent
) {
  const componentModel =
    appState.flattenedModel[event.properties.renderId][
      event.properties.componentId
    ];

  const componentOutput =
    appState.flattenedOutput[event.properties.renderId][
      event.properties.componentId
    ];

  if (componentOutput.type === UI.TYPE.INPUT_DATE) {
    const localErrorMessage = getComponentLocalErrorMessage(
      componentModel,
      event.properties.internalValue
    );

    return {
      flattenedOutput: {
        ...appState.flattenedOutput,
        [event.properties.renderId]: {
          ...appState.flattenedOutput[event.properties.renderId],
          [event.properties.componentId]: {
            ...componentOutput,
            output: {
              ...componentOutput.output,
              internalValue: event.properties.internalValue,
              networkTransferValue: {
                value: event.properties.internalValue,
                type: UI.TYPE.INPUT_DATE,
              },
            },
            validation: {
              ...componentOutput.validation,
              localErrorMessage,
              showLocalErrorIfExists: true,
            },
          },
        },
      },
    };
  }

  return {};
}

export { updateDateInputValue, type UpdateDateInputValueEvent };
