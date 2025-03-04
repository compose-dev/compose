import { type BaseData, TYPE } from "../eventType";
import * as UI from "../../../ui";

export interface Data extends BaseData {
  type: typeof TYPE.STALE_STATE_UPDATE;
  executionId: string;
  renderId: string;
  componentId: string;
  stale: UI.Stale.Option;
}
