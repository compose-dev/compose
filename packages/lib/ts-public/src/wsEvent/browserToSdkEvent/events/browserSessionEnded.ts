import { TYPE } from "../eventType";

export interface Data {
  type: typeof TYPE.BROWSER_SESSION_ENDED;
  sessionId: string;
  executionId: string;
}
