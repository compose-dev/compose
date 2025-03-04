import { UI } from "@composehq/ts-public";

import { UpdateInputValueEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";
import { getComponentLocalErrorMessage } from "../.utils";

interface UpdateDateTimeInputValueEvent extends UpdateInputValueEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.UPDATE_DATE_TIME_INPUT_VALUE;
  properties: {
    renderId: string;
    componentId: string;
    internalValue: UI.Components.InputDateTime["output"]["internalValue"];
  };
}

function updateDateTimeInputValue(
  appState: AppStore,
  event: UpdateDateTimeInputValueEvent
) {
  const componentModel =
    appState.flattenedModel[event.properties.renderId][
      event.properties.componentId
    ];

  const componentOutput =
    appState.flattenedOutput[event.properties.renderId][
      event.properties.componentId
    ];

  if (componentOutput.type === UI.TYPE.INPUT_DATE_TIME) {
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
                type: UI.TYPE.INPUT_DATE_TIME,
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

export { updateDateTimeInputValue, type UpdateDateTimeInputValueEvent };
