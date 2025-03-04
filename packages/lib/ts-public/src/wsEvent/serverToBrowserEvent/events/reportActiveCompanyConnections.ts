import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.REPORT_ACTIVE_COMPANY_CONNECTIONS;
  connections: Record<string, boolean>;
}
