import { type BaseData, TYPE } from "../eventType";
import * as Page from "../../../page";

export interface Data extends BaseData {
  type: typeof TYPE.UPDATE_LOADING_V2;
  value: Page.loading.Value;
  properties?: Page.loading.Properties;
}
