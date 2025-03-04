import { UI } from "@composehq/ts-public";

import { UpdateInputValueEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";
import { getComponentLocalErrorMessage } from "../.utils";

interface UpdateTextInputValueEvent extends UpdateInputValueEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.UPDATE_TEXT_INPUT_VALUE;
  properties: {
    renderId: string;
    componentId: string;
    internalValue:
      | UI.Components.InputText["output"]["internalValue"]
      | UI.Components.InputEmail["output"]["internalValue"]
      | UI.Components.InputUrl["output"]["internalValue"]
      | UI.Components.InputPassword["output"]["internalValue"]
      | UI.Components.InputTextArea["output"]["internalValue"];
  };
}

function updateTextInputValue(
  appState: AppStore,
  event: UpdateTextInputValueEvent
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
    componentOutput.type === UI.TYPE.INPUT_TEXT ||
    componentOutput.type === UI.TYPE.INPUT_EMAIL ||
    componentOutput.type === UI.TYPE.INPUT_URL ||
    componentOutput.type === UI.TYPE.INPUT_PASSWORD ||
    componentOutput.type === UI.TYPE.INPUT_TEXT_AREA
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

export { updateTextInputValue, type UpdateTextInputValueEvent };
