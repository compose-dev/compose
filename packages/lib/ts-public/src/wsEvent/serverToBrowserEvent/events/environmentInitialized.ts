import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.ENVIRONMENT_INITIALIZED;
  environmentId: string;
}
