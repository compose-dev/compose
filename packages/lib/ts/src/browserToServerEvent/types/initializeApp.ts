import { SdkToServerEvent, u as uPublic } from "@composehq/ts-public";
import { Environment } from "../../models";

export type RequestBody = {
  environmentId: string;
  appRoute: string;
  sessionId: string;
};

export interface SuccessResponseBody {
  app: SdkToServerEvent.Initialize.Data["apps"][number];
  user: {
    isExternal: boolean;
  };
  environment: {
    theme: Environment.DB["theme"];
    type: Environment.DB["type"];
    name: Environment.DB["name"];
    apps: Environment.DB["apps"];
    sdkPackageName: uPublic.sdkPackage.Name | undefined;
    sdkPackageVersion: string | undefined;
  };
}

export interface ErrorResponseBody {
  message: string;
}

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;

export const route = "api/v1/initialize-app";
export const method = "POST";
