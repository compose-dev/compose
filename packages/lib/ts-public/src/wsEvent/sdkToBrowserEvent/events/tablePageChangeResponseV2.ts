import { type BaseData, TYPE } from "../eventType";
import * as UI from "../../../ui";

export interface Data extends BaseData {
  type: typeof TYPE.TABLE_PAGE_CHANGE_RESPONSE_V2;
  renderId: string;
  componentId: string;
  data: UI.Table.DataRow[];
  totalRecords: number;
  offset: number;
  searchQuery: string | null;
  stale: UI.Stale.Option;
}
