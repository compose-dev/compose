import * as Page from "../../../page";
import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.PAGE_CONFIG_V2;
  config: Partial<Page.Config>;
}
