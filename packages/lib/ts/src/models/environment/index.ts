import { SdkToServerEvent } from "@composehq/ts-public";
import { u as uPublic } from "@composehq/ts-public";

const ENVIRONMENT_TYPE = {
  dev: "development",
  prod: "production",
} as const;

type EnvironmentType = (typeof ENVIRONMENT_TYPE)[keyof typeof ENVIRONMENT_TYPE];

type EnvironmentApp = SdkToServerEvent.Initialize.Data["apps"][number];

type EnvironmentTheme = SdkToServerEvent.Initialize.Data["theme"];

interface Data {
  packageName?: uPublic.sdkPackage.Name;
  packageVersion?: string;
}

interface EnvironmentBase {
  id: string;
  companyId: string;
  name: string;
  apiKey: string;
  type: EnvironmentType;
  apps: EnvironmentApp[];
  theme: EnvironmentTheme;
  createdAt: Date;
  updatedAt: Date;
  decryptableKey: string | null;
  data: Data;
}

interface EnvironmentProd extends EnvironmentBase {
  type: typeof ENVIRONMENT_TYPE.prod;
  decryptableKey: null;
}

interface EnvironmentDev extends EnvironmentBase {
  type: typeof ENVIRONMENT_TYPE.dev;
  decryptableKey: string;
}

type EnvironmentDB = EnvironmentProd | EnvironmentDev;

type ApiKeyOmittedDB = Omit<EnvironmentDB, "apiKey">;
type ApiAndDecryptableKeyOmittedDB = Omit<
  EnvironmentDB,
  "apiKey" | "decryptableKey"
>;

export {
  EnvironmentDB as DB,
  ApiKeyOmittedDB,
  ApiAndDecryptableKeyOmittedDB,
  ENVIRONMENT_TYPE as TYPE,
  type EnvironmentType as Type,
};
