import { type BaseData, TYPE } from "../eventType";
import { sdkPackage } from "../../../utils";

export interface Data extends BaseData {
  type: typeof TYPE.SDK_CONNECTION_STATUS_CHANGED;
  environmentId: string;
  isOnline: boolean;
  packageName: sdkPackage.Name | undefined;
  packageVersion: string | undefined;
  message: string | null;
}
