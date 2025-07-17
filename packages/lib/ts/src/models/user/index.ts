const ACCOUNT_TYPE = {
  DEVELOPER: "developer",
  USER_ONLY: "user-only",
} as const;

type AccountType = (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE];

const PERMISSION = {
  OWNER: "owner",
  ADMIN: "admin",
  APP_MANAGER: "app-manager",
  MEMBER: "member",
  GUEST: "guest",
} as const;

type Permission = (typeof PERMISSION)[keyof typeof PERMISSION];

const PERMISSION_TO_LABEL = {
  [PERMISSION.OWNER]: "Owner",
  [PERMISSION.ADMIN]: "Admin",
  [PERMISSION.APP_MANAGER]: "App Manager",
  [PERMISSION.MEMBER]: "Member",
  [PERMISSION.GUEST]: "Guest",
} as const;

const PERMISSION_ORDER_DESCENDING = [
  PERMISSION.OWNER,
  PERMISSION.ADMIN,
  PERMISSION.APP_MANAGER,
  PERMISSION.MEMBER,
  PERMISSION.GUEST,
] as const;

const PERMISSION_TO_SUMMARY = {
  [PERMISSION.OWNER]:
    "Full control over your team's account, including billing.",
  [PERMISSION.ADMIN]:
    "App manager permissions, plus the ability to view audit logs and add/remove users within your team.",
  [PERMISSION.APP_MANAGER]:
    "Member permissions, plus the ability to manage app permissions and sharing.",
  [PERMISSION.MEMBER]: "Can use and build apps.",
  [PERMISSION.GUEST]:
    "Access to use specific apps that've been shared with them.",
} as const;

interface UserMetadata {
  // Whether to show the onboarding tab to the user.
  "show-onboarding"?: boolean;
  // Whether the user has ever opened an app. This is worded in the
  // negative case so that the undefined case matches with the default
  // value.
  "has-never-opened-app"?: boolean;
  // Whether to show the success callout on app open.
  "show-success-callout-on-app-open"?: boolean;
}

const DEFAULT_USER_METADATA: Required<UserMetadata> = {
  "show-onboarding": false,
  "has-never-opened-app": false,
  "show-success-callout-on-app-open": false,
};

interface UserDB {
  id: string;
  companyId: string;
  developmentEnvironmentId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  permission: Permission;
  metadata: UserMetadata;
}

const FAKE_USER_ID = "00000000-0000-0000-0000-000000000000";

export {
  UserDB as DB,
  FAKE_USER_ID as FAKE_ID,
  ACCOUNT_TYPE,
  type AccountType,
  PERMISSION,
  type Permission,
  PERMISSION_TO_LABEL,
  PERMISSION_TO_SUMMARY,
  PERMISSION_ORDER_DESCENDING,
  DEFAULT_USER_METADATA as DEFAULT_METADATA,
  type UserMetadata as Metadata,
};
