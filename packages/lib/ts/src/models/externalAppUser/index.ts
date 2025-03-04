import { Environment } from "..";

/**
 * The value of the email field when the app is public.
 */
const EMAIL_FIELD_VALUE_FOR_PUBLIC_APP = "ALL";

/**
 * The prefix of the email field when the app inherits permissions from another
 * app. The prefix is followed by the parent app route from which the permissions
 * are inherited.
 */
const INHERIT_PERMISSIONS_FROM_APP_PREFIX = "INHERIT_PERMISSIONS_FROM_APP:::";

interface ExternalAppUserDB {
  id: string;
  companyId: string;

  /**
   * One of either:
   * - email address
   * - domain (e.g. app is shared with anyone with a composehq.com email)
   * - EMAIL_FIELD_VALUE_FOR_PUBLIC_APP
   * - INHERIT_PERMISSIONS_FROM_APP_PREFIX + appRoute
   */
  email: string;
  environmentId: string;
  createdByUserId: string | null;
  createdBySdk: boolean;
  appRoute: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ExternalAppUserWithDetails extends ExternalAppUserDB {
  environment: Environment.ApiAndDecryptableKeyOmittedDB;
  companyName: string;
}

export {
  ExternalAppUserDB as DB,
  ExternalAppUserWithDetails as WithDetails,
  EMAIL_FIELD_VALUE_FOR_PUBLIC_APP,
  INHERIT_PERMISSIONS_FROM_APP_PREFIX,
};
