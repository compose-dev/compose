import { type BaseData, TYPE } from "../eventType";
import { sdkPackage, navigation } from "../../../utils";

export interface Data extends BaseData {
  type: typeof TYPE.INITIALIZE;
  apps: {
    name: string;
    description: string | null;
    route: string;
    hidden?: boolean;
    parentAppRoute?: string;
    navId?: string;
  }[];
  theme: Partial<{
    textColor: `#${string}`;
    backgroundColor: `#${string}`;
    primaryColor: `#${string}`;
  }> | null;
  packageVersion: string | null;
  packageName: sdkPackage.Name;
  /**
   * Navigation bars that have been configured by the user.
   */
  navs?: navigation.UserProvidedInterface[];
}
