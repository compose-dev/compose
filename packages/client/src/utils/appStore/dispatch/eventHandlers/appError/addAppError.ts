import { type AppStore } from "../../../types";
import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";

interface AddAppErrorEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.ADD_APP_ERROR;
  properties: {
    severity: NonNullable<AppStore["error"]>["severity"];
    message: NonNullable<AppStore["error"]>["message"];
  };
}

function addAppError(event: AddAppErrorEvent): Partial<AppStore> {
  return {
    error: {
      severity: event.properties.severity,
      message: event.properties.message,
    },
  };
}

export { addAppError, type AddAppErrorEvent };
