import * as m from "../../models";

const FEATURE = {
  /********************
   * OWNER ONLY
   ********************/
  DELETE_ORGANIZATION: "delete-organization",
  CHANGE_BILLING: "change-billing",
  ADD_OWNER_PERMISSION: "add-owner-permission",
  REMOVE_OWNER_PERMISSION: "remove-owner-permission",
  DELETE_OWNER: "delete-owner",

  /********************
   * ADMIN+ ONLY
   ********************/
  VIEW_BILLING: "view-billing",
  ADD_USER: "add-user",
  DELETE_ADMIN: "delete-admin",
  DELETE_APP_MANAGER: "delete-app-manager",
  DELETE_MEMBER: "delete-member",
  REMOVE_PENDING_INVITE: "remove-pending-invite",
  ADD_ADMIN_PERMISSION: "add-admin-permission",
  REMOVE_ADMIN_PERMISSION: "remove-admin-permission",
  ADD_APP_MANAGER_PERMISSION: "add-app-manager-permission",
  REMOVE_APP_MANAGER_PERMISSION: "remove-app-manager-permission",
  ADD_MEMBER_PERMISSION: "add-member-permission",
  REMOVE_MEMBER_PERMISSION: "remove-member-permission",
  VIEW_AUDIT_LOGS: "view-audit-logs",
  CREATE_REPORT: "create-report",
  UPDATE_REPORT: "update-report",
  DELETE_REPORT: "delete-report",
  VIEW_REPORT: "view-report",
  VIEW_LIST_OF_REPORTS: "view-list-of-reports",
  VIEW_REPORT_SHARED_WITH: "view-report-shared-with",
  SHARE_REPORT_WITH_USER: "share-report-with-user",
  SHARE_REPORT_WITH_EXTERNAL_USER: "share-report-with-external-user",
  SHARE_REPORT_PUBLICLY: "share-report-publicly",
  UNSHARE_REPORT_WITH_USER: "unshare-report-with-user",
  UNSHARE_REPORT_WITH_EXTERNAL_USER: "unshare-report-with-external-user",
  UNSHARE_REPORT_PUBLICLY: "unshare-report-publicly",

  /********************
   * APP MANAGER+ ONLY
   ********************/
  SHARE_APP_PUBLICLY: "share-app-publicly",
  UNSHARE_APP_PUBLICLY: "unshare-app-publicly",
  SHARE_APP_EXTERNAL_EMAIL: "share-app-external-email",
  UNSHARE_APP_EXTERNAL_EMAIL: "unshare-app-external-email",
  CREATE_PRODUCTION_ENVIRONMENT: "create-production-environment",
  DELETE_PRODUCTION_ENVIRONMENT: "delete-production-environment",
  REFRESH_PRODUCTION_ENVIRONMENT_API_KEY:
    "refresh-production-environment-api-key",
  // These two aren't relevant right now, but theoretically we may allow
  // organization users to have a "guest" permission in the future. In
  // that case, we'd want app manager+ to be able to control that, not just
  // admins.
  ADD_GUEST_PERMISSION: "add-guest-permission",
  REMOVE_GUEST_PERMISSION: "remove-guest-permission",

  /********************
   * MEMBER+ ONLY
   ********************/
  VIEW_ORGANIZATION_USERS: "view-organization-users",
  VIEW_EXTERNAL_USERS: "view-external-users",
  CREATE_DEVELOPMENT_ENVIRONMENT: "create-development-environment",
  DELETE_DEVELOPMENT_ENVIRONMENT: "delete-development-environment",
} as const;

type Feature = (typeof FEATURE)[keyof typeof FEATURE];

function isOwnerOrAbove(permission: m.User.DB["permission"]) {
  return permission === m.User.PERMISSION.OWNER;
}

function isAdminOrAbove(permission: m.User.DB["permission"]) {
  return permission === m.User.PERMISSION.ADMIN || isOwnerOrAbove(permission);
}

function isAppManagerOrAbove(permission: m.User.DB["permission"]) {
  return (
    permission === m.User.PERMISSION.APP_MANAGER || isAdminOrAbove(permission)
  );
}

function isMemberOrAbove(permission: m.User.DB["permission"]) {
  return (
    permission === m.User.PERMISSION.MEMBER || isAppManagerOrAbove(permission)
  );
}

function isAllowed(
  feature: Feature,
  permission: m.User.DB["permission"] | undefined
) {
  if (!permission) {
    return false;
  }

  if (
    feature === FEATURE.DELETE_ORGANIZATION ||
    feature === FEATURE.CHANGE_BILLING ||
    feature === FEATURE.ADD_OWNER_PERMISSION ||
    feature === FEATURE.REMOVE_OWNER_PERMISSION ||
    feature === FEATURE.DELETE_OWNER
  ) {
    return isOwnerOrAbove(permission);
  }

  if (
    feature === FEATURE.VIEW_BILLING ||
    feature === FEATURE.ADD_USER ||
    feature === FEATURE.DELETE_ADMIN ||
    feature === FEATURE.DELETE_APP_MANAGER ||
    feature === FEATURE.DELETE_MEMBER ||
    feature === FEATURE.REMOVE_PENDING_INVITE ||
    feature === FEATURE.ADD_ADMIN_PERMISSION ||
    feature === FEATURE.REMOVE_ADMIN_PERMISSION ||
    feature === FEATURE.ADD_APP_MANAGER_PERMISSION ||
    feature === FEATURE.REMOVE_APP_MANAGER_PERMISSION ||
    feature === FEATURE.ADD_MEMBER_PERMISSION ||
    feature === FEATURE.REMOVE_MEMBER_PERMISSION ||
    feature === FEATURE.VIEW_AUDIT_LOGS ||
    feature === FEATURE.CREATE_REPORT ||
    feature === FEATURE.UPDATE_REPORT ||
    feature === FEATURE.DELETE_REPORT ||
    feature === FEATURE.VIEW_REPORT ||
    feature === FEATURE.VIEW_LIST_OF_REPORTS ||
    feature === FEATURE.SHARE_REPORT_WITH_USER ||
    feature === FEATURE.SHARE_REPORT_WITH_EXTERNAL_USER ||
    feature === FEATURE.SHARE_REPORT_PUBLICLY ||
    feature === FEATURE.UNSHARE_REPORT_WITH_USER ||
    feature === FEATURE.UNSHARE_REPORT_WITH_EXTERNAL_USER ||
    feature === FEATURE.UNSHARE_REPORT_PUBLICLY ||
    feature === FEATURE.VIEW_REPORT_SHARED_WITH
  ) {
    return isAdminOrAbove(permission);
  }

  if (
    feature === FEATURE.SHARE_APP_PUBLICLY ||
    feature === FEATURE.UNSHARE_APP_PUBLICLY ||
    feature === FEATURE.SHARE_APP_EXTERNAL_EMAIL ||
    feature === FEATURE.UNSHARE_APP_EXTERNAL_EMAIL ||
    feature === FEATURE.CREATE_PRODUCTION_ENVIRONMENT ||
    feature === FEATURE.DELETE_PRODUCTION_ENVIRONMENT ||
    feature === FEATURE.REFRESH_PRODUCTION_ENVIRONMENT_API_KEY
  ) {
    return isAppManagerOrAbove(permission);
  }

  if (
    feature === FEATURE.VIEW_ORGANIZATION_USERS ||
    feature === FEATURE.VIEW_EXTERNAL_USERS ||
    feature === FEATURE.CREATE_DEVELOPMENT_ENVIRONMENT ||
    feature === FEATURE.DELETE_DEVELOPMENT_ENVIRONMENT
  ) {
    return isMemberOrAbove(permission);
  }

  if (isOwnerOrAbove(permission)) {
    return true;
  }

  return false;
}

function isAllowedToChangePermission({
  actingUserPermission,
  oldPermission,
  newPermission,
}: {
  actingUserPermission: m.User.DB["permission"];
  oldPermission: m.User.DB["permission"];
  newPermission: m.User.DB["permission"];
}) {
  let newPermissionFeature: Feature;
  switch (newPermission) {
    case m.User.PERMISSION.OWNER:
      newPermissionFeature = FEATURE.ADD_OWNER_PERMISSION;
      break;
    case m.User.PERMISSION.ADMIN:
      newPermissionFeature = FEATURE.ADD_ADMIN_PERMISSION;
      break;
    case m.User.PERMISSION.APP_MANAGER:
      newPermissionFeature = FEATURE.ADD_APP_MANAGER_PERMISSION;
      break;
    case m.User.PERMISSION.MEMBER:
      newPermissionFeature = FEATURE.ADD_MEMBER_PERMISSION;
      break;
    case m.User.PERMISSION.GUEST:
      newPermissionFeature = FEATURE.ADD_GUEST_PERMISSION;
      break;
    default:
      throw new Error(`Cannot assign invalid permission: ${newPermission}`);
  }

  let oldPermissionFeature: Feature;
  switch (oldPermission) {
    case m.User.PERMISSION.OWNER:
      oldPermissionFeature = FEATURE.REMOVE_OWNER_PERMISSION;
      break;
    case m.User.PERMISSION.ADMIN:
      oldPermissionFeature = FEATURE.REMOVE_ADMIN_PERMISSION;
      break;
    case m.User.PERMISSION.APP_MANAGER:
      oldPermissionFeature = FEATURE.REMOVE_APP_MANAGER_PERMISSION;
      break;
    case m.User.PERMISSION.MEMBER:
      oldPermissionFeature = FEATURE.REMOVE_MEMBER_PERMISSION;
      break;
    case m.User.PERMISSION.GUEST:
      oldPermissionFeature = FEATURE.REMOVE_GUEST_PERMISSION;
      break;
    default:
      throw new Error(`Cannot remove invalid permission: ${oldPermission}`);
  }

  const canAdd = isAllowed(newPermissionFeature, actingUserPermission);
  const canRemove = isAllowed(oldPermissionFeature, actingUserPermission);

  return {
    add: canAdd,
    remove: canRemove,
    addAndRemove: canAdd && canRemove,
  };
}

function isAllowedToDeleteUser({
  actingUserPermission,
  targetUserPermission,
}: {
  actingUserPermission: m.User.DB["permission"];
  targetUserPermission: m.User.DB["permission"];
}) {
  let feature: Feature;

  switch (targetUserPermission) {
    case m.User.PERMISSION.OWNER:
      feature = FEATURE.DELETE_OWNER;
      break;
    case m.User.PERMISSION.ADMIN:
      feature = FEATURE.DELETE_ADMIN;
      break;
    case m.User.PERMISSION.APP_MANAGER:
      feature = FEATURE.DELETE_APP_MANAGER;
      break;
    case m.User.PERMISSION.MEMBER:
      feature = FEATURE.DELETE_MEMBER;
      break;
    default:
      throw new Error(
        `Cannot delete invalid permission: ${targetUserPermission}`
      );
  }

  return isAllowed(feature, actingUserPermission);
}

export {
  isAllowed,
  FEATURE,
  type Feature,
  isOwnerOrAbove,
  isAdminOrAbove,
  isAppManagerOrAbove,
  isMemberOrAbove,
  isAllowedToChangePermission,
  isAllowedToDeleteUser,
};
