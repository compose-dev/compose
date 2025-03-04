import { AppRunnerBaseEvent } from "../../types/baseEvent";
import { APP_RUNNER_EVENT_TYPE } from "../../types/eventType";
import { type AppStore } from "../../../types";

interface RemoveAppErrorEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.REMOVE_APP_ERROR;
}

function removeAppError(): Partial<AppStore> {
  return {
    error: null,
  };
}

export { removeAppError, type RemoveAppErrorEvent };
