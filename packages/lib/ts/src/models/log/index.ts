import { u as uPublic } from "@composehq/ts-public";

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
  appRoute: string;
  message: string;
  data: Record<string, any> | null;
  severity: uPublic.log.Severity;
  type: uPublic.log.Type;
}

export { LogDB as DB };
