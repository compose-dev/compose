import { UI } from "@composehq/ts-public";

import { UpdateInputValueEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";
import { getComponentLocalErrorMessage } from "../.utils";

interface UpdateNumberInputValueEvent extends UpdateInputValueEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.UPDATE_NUMBER_INPUT_VALUE;
  properties: {
    renderId: string;
    componentId: string;
    internalValue: UI.Components.InputNumber["output"]["internalValue"];
  };
}

function getNetworkTransferValue(
  internalValue: UI.Components.InputNumber["output"]["internalValue"]
) {
  if (internalValue === null) {
    return null;
  }

  const networkTransferValue = Number.parseFloat(internalValue);

  if (Number.isNaN(networkTransferValue)) {
    return null;
  }

  return networkTransferValue;
}

function updateNumberInputValue(
  appState: AppStore,
  event: UpdateNumberInputValueEvent
) {
  const componentModel =
    appState.flattenedModel[event.properties.renderId][
      event.properties.componentId
    ];

  const componentOutput =
    appState.flattenedOutput[event.properties.renderId][
      event.properties.componentId
    ];

  if (componentOutput.type === UI.TYPE.INPUT_NUMBER) {
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
              networkTransferValue: getNetworkTransferValue(
                event.properties.internalValue
              ),
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

export { updateNumberInputValue, type UpdateNumberInputValueEvent };
