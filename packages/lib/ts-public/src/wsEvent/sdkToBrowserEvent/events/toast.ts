import { type BaseData, TYPE } from "../eventType";
import * as Page from "../../../page";

export interface Data extends BaseData {
  type: typeof TYPE.TOAST;
  executionId: string;
  message: string;
  options: Omit<Page.toast.Base, "message"> | null;
}
