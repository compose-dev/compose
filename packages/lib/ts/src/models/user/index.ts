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

const PERMISSION_TO_SUMMARY = {
  [PERMISSION.OWNER]:
    "Full control over your team's account, including billing.",
  [PERMISSION.ADMIN]:
    "App manager permissions, plus the ability to view audit logs and add/remove users within your team.",
  [PERMISSION.APP_MANAGER]:
    "Member permissions, plus the ability to manage how apps are shared with external users.",
  [PERMISSION.MEMBER]: "Access to use and build apps.",
  [PERMISSION.GUEST]:
    "Access to use specific apps that've been shared with them.",
} as const;

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
};
