const NEW_USER_STAGE = {
  userInfo: "userInfo",
  workspaceInfo: "workspaceInfo",
};

type NewUserStage = (typeof NEW_USER_STAGE)[keyof typeof NEW_USER_STAGE];

export { NEW_USER_STAGE, type NewUserStage };
