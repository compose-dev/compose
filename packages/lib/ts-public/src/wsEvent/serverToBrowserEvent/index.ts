import { TYPE, Type } from "./eventType";
import { Data as SdkToBrowserData } from "../sdkToBrowserEvent";
import {
  ConnectionStatus,
  ReportActiveCompanyConnections,
  JsonParseError,
  EnvironmentInitialized,
} from "./events";

type Data =
  | SdkToBrowserData
  | ConnectionStatus.Data
  | ReportActiveCompanyConnections.Data
  | JsonParseError.Data
  | EnvironmentInitialized.Data;

export * from "../sdkToBrowserEvent/events";
export {
  TYPE,
  Type,
  Data,
  ConnectionStatus,
  ReportActiveCompanyConnections,
  JsonParseError,
  EnvironmentInitialized,
};
