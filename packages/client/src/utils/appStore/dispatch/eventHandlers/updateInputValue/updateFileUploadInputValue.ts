import { v4 as uuid } from "uuid";
import { UI } from "@composehq/ts-public";

import { UpdateInputValueEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";
import { getComponentLocalErrorMessage } from "../.utils";

interface UpdateFileUploadInputValueEvent extends UpdateInputValueEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.UPDATE_FILE_UPLOAD_INPUT_VALUE;
  properties: {
    renderId: string;
    componentId: string;
    internalValue: UI.Components.InputFileDrop["output"]["internalValue"];
  };
}

function updateFileUploadInputValue(
  appState: AppStore,
  event: UpdateFileUploadInputValueEvent
): Partial<AppStore> {
  const componentModel =
    appState.flattenedModel[event.properties.renderId][
      event.properties.componentId
    ];

  const componentOutput =
    appState.flattenedOutput[event.properties.renderId][
      event.properties.componentId
    ];

  if (componentOutput.type === UI.TYPE.INPUT_FILE_DROP) {
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
              networkTransferValue: event.properties.internalValue.map(
                (file) => ({
                  fileId: uuid(),
                  fileName: file.name,
                  fileSize: file.size,
                  fileType: file.type,
                })
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

export { updateFileUploadInputValue, type UpdateFileUploadInputValueEvent };
