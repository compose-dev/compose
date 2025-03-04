import { type BaseData, TYPE } from "../eventType";
import { sdkPackage } from "../../../utils";

export interface Data extends BaseData {
  type: typeof TYPE.INITIALIZE;
  apps: {
    name: string;
    description: string | null;
    route: string;
    hidden?: boolean;
    parentAppRoute?: string;
  }[];
  theme: Partial<{
    textColor: `#${string}`;
    backgroundColor: `#${string}`;
    primaryColor: `#${string}`;
  }> | null;
  packageVersion: string | null;
  packageName: sdkPackage.Name;
}
