import { UI } from "@composehq/ts-public";

import { UpdateInputValueEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";
import { getComponentLocalErrorMessage } from "../.utils";

interface updateTableInputValueEvent extends UpdateInputValueEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.UPDATE_TABLE_INPUT_VALUE;
  properties: {
    renderId: string;
    componentId: string;
    internalValue: UI.Components.InputTable["output"]["internalValue"];
  };
}

function updateTableInputValue(
  appState: AppStore,
  event: updateTableInputValueEvent
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
    componentOutput.type === UI.TYPE.INPUT_TABLE &&
    componentModel.type === UI.TYPE.INPUT_TABLE
  ) {
    const localErrorMessage = getComponentLocalErrorMessage(
      componentModel,
      event.properties.internalValue
    );

    const tableVersion = componentModel.model.properties.v || 1;

    let networkTransferValue: UI.Components.InputTable["output"]["networkTransferValue"] =
      [];

    if (tableVersion > 1) {
      networkTransferValue = {
        value: Object.keys(event.properties.internalValue).map((idx) =>
          parseInt(idx)
        ),
        type: UI.TYPE.INPUT_TABLE,
      };
    } else {
      networkTransferValue = componentModel.model.properties.data.filter(
        (_, idx) => {
          return Object.keys(event.properties.internalValue).includes(
            idx.toString()
          );
        }
      );
    }

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
              networkTransferValue,
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

export { updateTableInputValue, type updateTableInputValueEvent };
