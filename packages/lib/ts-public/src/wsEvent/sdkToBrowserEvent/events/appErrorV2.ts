import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.APP_ERROR_V2;
  errorMessage: string;
  severity?: "error" | "warning";
}
