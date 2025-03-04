import { type BaseData, TYPE } from "../eventType";
import * as UI from "../../../ui";

export interface Data extends BaseData {
  type: typeof TYPE.TABLE_PAGE_CHANGE_RESPONSE;
  executionId: string;
  renderId: string;
  componentId: string;
  data: UI.Table.DataRow[];
  totalRecords: number;
  offset: number;
  searchQuery: string | null;
  stale: UI.Stale.Option;
}
