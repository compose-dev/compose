import * as Page from "../../../page";
import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.PAGE_CONFIG;
  executionId: string;
  config: Partial<Page.Config>;
}
