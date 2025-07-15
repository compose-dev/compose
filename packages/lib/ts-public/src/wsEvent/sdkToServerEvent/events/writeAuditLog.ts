import { type BaseData, TYPE } from "../eventType";
import { log } from "../../../utils";

export interface Data extends BaseData {
  type: typeof TYPE.WRITE_AUDIT_LOG;
  message: string;
  severity?: log.Severity;
  data?: Record<string, any>;
  // Added in 0.27.8 of Node SDK and 0.27.7 of Python SDK
  appRoute?: string;
}
