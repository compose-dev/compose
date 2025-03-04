import { UI } from "@composehq/ts-public";

import { UpdateInputValueEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";
import { getComponentLocalErrorMessage } from "../.utils";

interface UpdateSelectSingleInputValueEvent extends UpdateInputValueEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.UPDATE_SELECT_SINGLE_INPUT_VALUE;
  properties: {
    renderId: string;
    componentId: string;
    internalValue:
      | UI.Components.InputSelectDropdown["output"]["internalValue"]
      | UI.Components.InputRadioGroup["output"]["internalValue"];
  };
}

function updateSelectSingleInputValue(
  appState: AppStore,
  event: UpdateSelectSingleInputValueEvent
) {
  const componentModel =
    appState.flattenedModel[event.properties.renderId][
      event.properties.componentId
    ];

  const componentOutput =
    appState.flattenedOutput[event.properties.renderId][
      event.properties.componentId
    ];

  if (
    componentOutput.type === UI.TYPE.INPUT_SELECT_DROPDOWN_SINGLE ||
    componentOutput.type === UI.TYPE.INPUT_RADIO_GROUP
  ) {
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
              networkTransferValue: event.properties.internalValue,
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

export { updateSelectSingleInputValue, type UpdateSelectSingleInputValueEvent };
