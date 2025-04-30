import * as UI from "../../../ui";
import { TYPE } from "../eventType";

export interface Data {
  type: typeof TYPE.ON_TABLE_PAGE_CHANGE_HOOK;
  componentId: string;
  renderId: string;
  executionId: string;
  offset: number;
  pageSize: number;
  searchQuery: string | null;
  sortBy: UI.Table.ColumnSort<UI.Table.DataRow[]>[];
}
