import * as Page from "../../../page";
import { TYPE } from "../eventType";

export interface Data {
  type: typeof TYPE.START_EXECUTION;
  appRoute: string;
  executionId: string;
  sessionId: string;
  params?: Page.Params;
}
