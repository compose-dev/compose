import { TYPE } from "../eventType";

export interface Data {
  type: typeof TYPE.ON_CLICK_HOOK;
  componentId: string;
  renderId: string;
  executionId: string;
}
