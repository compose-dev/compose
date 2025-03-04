import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.EXECUTION_EXISTS_RESPONSE;
  executionId: string;
  exists: boolean;
}
