import { TYPE } from "../eventType";

export interface Data {
  type: typeof TYPE.ON_CLOSE_MODAL;
  renderId: string;
  executionId: string;
}
