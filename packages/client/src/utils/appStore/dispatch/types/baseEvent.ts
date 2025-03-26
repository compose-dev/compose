import { UI } from "@composehq/ts-public";
import { APP_RUNNER_EVENT_TYPE, AppRunnerEventType } from "./eventType";

interface AppRunnerBaseEvent {
  type: AppRunnerEventType;
}

interface UpdateInputValueEvent extends AppRunnerBaseEvent {
  type:
    | typeof APP_RUNNER_EVENT_TYPE.UPDATE_TEXT_INPUT_VALUE
    | typeof APP_RUNNER_EVENT_TYPE.UPDATE_NUMBER_INPUT_VALUE
    | typeof APP_RUNNER_EVENT_TYPE.UPDATE_SELECT_SINGLE_INPUT_VALUE
    | typeof APP_RUNNER_EVENT_TYPE.UPDATE_SELECT_MULTI_INPUT_VALUE
    | typeof APP_RUNNER_EVENT_TYPE.UPDATE_TABLE_INPUT_VALUE
    | typeof APP_RUNNER_EVENT_TYPE.UPDATE_FILE_UPLOAD_INPUT_VALUE
    | typeof APP_RUNNER_EVENT_TYPE.UPDATE_DATE_INPUT_VALUE
    | typeof APP_RUNNER_EVENT_TYPE.UPDATE_TIME_INPUT_VALUE
    | typeof APP_RUNNER_EVENT_TYPE.UPDATE_DATE_TIME_INPUT_VALUE
    | typeof APP_RUNNER_EVENT_TYPE.UPDATE_CHECKBOX_INPUT_VALUE
    | typeof APP_RUNNER_EVENT_TYPE.UPDATE_JSON_INPUT_VALUE;
  properties: {
    renderId: string;
    componentId: string;
    internalValue: UI.Components.AllWithInputInteraction["output"]["internalValue"];
  };
}

export { type AppRunnerBaseEvent, type UpdateInputValueEvent };
