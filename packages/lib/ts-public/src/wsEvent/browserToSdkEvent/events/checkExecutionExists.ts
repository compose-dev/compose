import { TYPE } from "../eventType";

export interface Data {
  type: typeof TYPE.CHECK_EXECUTION_EXISTS;
  executionId: string;
  sessionId: string;
}
