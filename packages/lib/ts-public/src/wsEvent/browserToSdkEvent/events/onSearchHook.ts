import { TYPE } from "../eventType";

export interface Data {
  type: typeof TYPE.ON_SEARCH_HOOK;
  componentId: string;
  renderId: string;
  executionId: string;
  value: string | null;
}
