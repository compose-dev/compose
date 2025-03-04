import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.EXECUTION_EXISTS_RESPONSE_V2;
  exists: boolean;
}
