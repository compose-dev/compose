import * as UI from "../../../ui";
import { TYPE } from "../eventType";

export interface Data {
  type: typeof TYPE.ON_TABLE_ROW_ACTION_HOOK;
  componentId: string;
  renderId: string;
  executionId: string;
  actionIdx: number;
  value: UI.Table.DataRow | number;
}
