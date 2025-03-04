import { AppRunnerBaseEvent } from "../types/baseEvent";
import { APP_RUNNER_EVENT_TYPE } from "../types/eventType";
import { type AppStore } from "../../types";

interface WentOfflineEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.WENT_OFFLINE;
}

function wentOffline(): Partial<AppStore> {
  return {
    wentOffline: true,
  };
}

export { wentOffline, type WentOfflineEvent };
