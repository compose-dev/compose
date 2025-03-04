import { type BaseData, TYPE } from "../eventType";
import * as Page from "../../../page";

export interface Data extends BaseData {
  type: typeof TYPE.LINK_V2;
  appRouteOrUrl: string;
  newTab?: boolean;
  params?: Page.Params;
}
