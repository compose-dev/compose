import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.SET_INPUTS;
  inputs: Record<string, unknown>;
  executionId: string;
}
