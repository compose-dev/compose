import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.SET_INPUTS_V2;
  inputs: Record<string, unknown>;
}
