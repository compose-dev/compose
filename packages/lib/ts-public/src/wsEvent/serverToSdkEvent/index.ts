import { TYPE, Type } from "./eventType";
import { Data as BrowserToSdkData } from "../browserToSdkEvent";

type Data = BrowserToSdkData;

export * from "../browserToSdkEvent/events";
export { TYPE, Type, Data };
