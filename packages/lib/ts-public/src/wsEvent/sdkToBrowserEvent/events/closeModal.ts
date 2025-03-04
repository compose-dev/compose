import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.CLOSE_MODAL;
  executionId: string;
  renderId: string;
}
