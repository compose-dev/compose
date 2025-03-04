import { type BaseData, TYPE } from "../eventType";
import * as Page from "../../../page";

export interface Data extends BaseData {
  type: typeof TYPE.TOAST_V2;
  message: string;
  options: Omit<Page.toast.Base, "message"> | null;
}
