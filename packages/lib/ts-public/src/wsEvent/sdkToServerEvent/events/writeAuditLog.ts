import { type BaseData, TYPE } from "../eventType";
import { log } from "../../../utils";

export interface Data extends BaseData {
  type: typeof TYPE.WRITE_AUDIT_LOG;
  message: string;
  severity?: log.Severity;
  data?: Record<string, any>;
}
