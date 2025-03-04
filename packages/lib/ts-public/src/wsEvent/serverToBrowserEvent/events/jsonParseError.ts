import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.JSON_PARSE_ERROR;
  errorMessage: string;
  severity: "warning" | "error";
}
