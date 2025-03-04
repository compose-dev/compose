import { APP_RUNNER_EVENT_TYPE } from "../../types/eventType";
import { AppRunnerBaseEvent } from "../../types/baseEvent";
import { type AppStore } from "../../../types";

interface RemovePageConfirmEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.REMOVE_PAGE_CONFIRM;
}

function removePageConfirm(): Partial<AppStore> {
  return {
    pageConfirm: null,
  };
}

export { removePageConfirm, type RemovePageConfirmEvent };
