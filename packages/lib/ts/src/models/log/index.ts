import { u as uPublic } from "@composehq/ts-public";
import * as Environment from "../environment";

const APP_INITIALIZED_MESSAGE = "App initialized";

interface LogDB {
  id: number;
  createdAt: Date;
  companyId: string;
  /**
   * May be null if the environment was deleted.
   */
  environmentId: string | null;
  /**
   * May be null if the user was deleted or the log was created by an
   * external user (e.g. a public app).
   */
  userId: string | null;
  /**
   * A denormalized field that stores the email of the user who created the
   * log, and preserves the email even if the user is deleted. May be null
   * if the log was created by an external user (e.g. a public app).
   */
  userEmail: string | null;
  /**
   * A denormalized field that stores the type of the environment that the
   * log was created in, and preserves the type even if the environment is
   * deleted.
   */
  environmentType: Environment.Type;
  appRoute: string;
  message: string;
  data: Record<string, any> | null;
  severity: uPublic.log.Severity;
  type: uPublic.log.Type;
}

export { LogDB as DB, APP_INITIALIZED_MESSAGE };
