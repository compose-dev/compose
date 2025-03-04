import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.CLOSE_MODAL_V2;
  renderId: string;
}
