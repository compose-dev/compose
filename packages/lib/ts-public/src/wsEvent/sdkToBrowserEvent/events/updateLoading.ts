import { type BaseData, TYPE } from "../eventType";
import * as Page from "../../../page";

export interface Data extends BaseData {
  type: typeof TYPE.UPDATE_LOADING;
  executionId: string;
  value: Page.loading.Value;
  properties?: Page.loading.Properties;
}
