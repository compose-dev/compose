import { TYPE } from "../eventType";

export interface Data {
  type: typeof TYPE.ON_CONFIRM_RESPONSE_HOOK;
  componentId: string;
  response: boolean;
  executionId: string;
}
