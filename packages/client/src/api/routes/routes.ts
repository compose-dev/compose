import { request, BrowserToServerEvent } from "@compose/ts";
import { logIfDevelopment } from "~/utils/nodeEnvironment";

async function initialize() {
  const body: BrowserToServerEvent.Initialize.RequestBody = null;

  return await request<
    BrowserToServerEvent.Initialize.SuccessResponseBody,
    BrowserToServerEvent.Initialize.ErrorResponseBody
  >({
    route: `/${BrowserToServerEvent.Initialize.route}`,
    forwardLog: logIfDevelopment,
    body,
  });
}

async function getSettings() {
  const body: BrowserToServerEvent.GetSettings.RequestBody = null;

  const response = await request<
    BrowserToServerEvent.GetSettings.Response,
    BrowserToServerEvent.GetSettings.ErrorData
  >({
    route: `/${BrowserToServerEvent.GetSettings.route}`,
    forwardLog: logIfDevelopment,
    body,
  });

  if (response.didError) {
    return response;
  }

  const users = response.data.users.map((user) => ({
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  }));

  const pendingInvites = response.data.pendingInvites.map((invite) => ({
    ...invite,
    createdAt: new Date(invite.createdAt),
    expiresAt: new Date(invite.expiresAt),
  }));

  const company = {
    ...response.data.company,
    createdAt: new Date(response.data.company.createdAt),
    updatedAt: new Date(response.data.company.updatedAt),
  };

  return {
    ...response,
    data: {
      ...response.data,
      users,
      pendingInvites,
      company,
    },
  };
}

async function initializeEnvironmentAndAuthorizeApp(
  body: BrowserToServerEvent.InitializeEnvironmentAndAuthorizeApp.RequestBody
) {
  return await request<
    BrowserToServerEvent.InitializeEnvironmentAndAuthorizeApp.SuccessResponseBody,
    BrowserToServerEvent.InitializeEnvironmentAndAuthorizeApp.ErrorResponseBody
  >({
    route: `/${BrowserToServerEvent.InitializeEnvironmentAndAuthorizeApp.route}`,
    forwardLog: logIfDevelopment,
    body,
    method: BrowserToServerEvent.InitializeEnvironmentAndAuthorizeApp.method,
  });
}

async function googleOAuth2Callback(
  accessToken: string,
  newAccount: boolean,
  environmentId: string | null,
  appRoute: string | null
) {
  return await request<
    BrowserToServerEvent.GoogleOauthCallback.ResponseBody,
    BrowserToServerEvent.GoogleOauthCallback.ErrorData
  >({
    route: `/${BrowserToServerEvent.GoogleOauthCallback.route}`,
    method: "POST",
    forwardLog: logIfDevelopment,
    headers: {
      "x-compose-goog-oauth2-access-token": accessToken,
    },
    body: {
      newAccount,
      environmentId,
      appRoute,
    },
  });
}

async function completeSignUp(
  accessToken: string,
  body: BrowserToServerEvent.CompleteSignUp.RequestBody
) {
  return await request<
    BrowserToServerEvent.CompleteSignUp.ResponseBody,
    BrowserToServerEvent.CompleteSignUp.ErrorData
  >({
    route: `/${BrowserToServerEvent.CompleteSignUp.route}`,
    method: "POST",
    forwardLog: logIfDevelopment,
    headers: {
      "x-compose-goog-oauth2-access-token": accessToken,
    },
    body,
  });
}

async function completeSignUpToOrg(
  accessToken: string,
  body: BrowserToServerEvent.CompleteSignUpToOrg.RequestBody
) {
  return await request<
    BrowserToServerEvent.CompleteSignUpToOrg.SuccessResponseBody,
    BrowserToServerEvent.CompleteSignUpToOrg.ErrorResponseBody
  >({
    route: `/${BrowserToServerEvent.CompleteSignUpToOrg.route}`,
    method: "POST",
    forwardLog: logIfDevelopment,
    headers: {
      "x-compose-goog-oauth2-access-token": accessToken,
    },
    body,
  });
}

async function checkAuth() {
  return await request<null, { message: string }>({
    route: `/${BrowserToServerEvent.CheckAuth.route}`,
    method: "GET",
    forwardLog: logIfDevelopment,
  });
}

async function logout() {
  return await request<null, { message: string }>({
    route: `/${BrowserToServerEvent.Logout.route}`,
    method: "GET",
    forwardLog: logIfDevelopment,
  });
}

async function insertExternalAppUser(
  body: BrowserToServerEvent.InsertExternalAppUser.RequestBody
) {
  return await request<
    null,
    BrowserToServerEvent.InsertExternalAppUser.ErrorData
  >({
    route: `/${BrowserToServerEvent.InsertExternalAppUser.route}`,
    method: BrowserToServerEvent.InsertExternalAppUser.method,
    forwardLog: logIfDevelopment,
    body,
  });
}

async function getExternalAppUsers(
  body: BrowserToServerEvent.GetExternalAppUsers.RequestBody
) {
  return await request<
    BrowserToServerEvent.GetExternalAppUsers.Response,
    BrowserToServerEvent.GetExternalAppUsers.ErrorData
  >({
    route: `/${BrowserToServerEvent.GetExternalAppUsers.route}`,
    method: BrowserToServerEvent.GetExternalAppUsers.method,
    forwardLog: logIfDevelopment,
    body,
  });
}

async function deleteExternalAppUser(id: string) {
  return await request<
    BrowserToServerEvent.DeleteExternalAppUser.Response,
    BrowserToServerEvent.DeleteExternalAppUser.ErrorData
  >({
    route: `/${BrowserToServerEvent.DeleteExternalAppUser.route}`,
    method: BrowserToServerEvent.DeleteExternalAppUser.method,
    forwardLog: logIfDevelopment,
    params: {
      id,
    },
    body: {},
  });
}

async function deleteUser(userId: string) {
  return await request<
    BrowserToServerEvent.DeleteUser.Response,
    BrowserToServerEvent.DeleteUser.ErrorData
  >({
    route: `/${BrowserToServerEvent.DeleteUser.route}`,
    method: BrowserToServerEvent.DeleteUser.method,
    forwardLog: logIfDevelopment,
    params: {
      userId,
    },
    body: {},
  });
}

async function changeUserPermission(
  userId: string,
  body: BrowserToServerEvent.ChangeUserPermission.RequestBody
) {
  return await request<
    BrowserToServerEvent.ChangeUserPermission.Response,
    BrowserToServerEvent.ChangeUserPermission.ErrorData
  >({
    route: `/${BrowserToServerEvent.ChangeUserPermission.route}`,
    method: BrowserToServerEvent.ChangeUserPermission.method,
    forwardLog: logIfDevelopment,
    params: {
      userId,
    },
    body,
  });
}

async function getUserDevEnvironment() {
  return await request<
    BrowserToServerEvent.GetDevEnvironment.Response,
    BrowserToServerEvent.GetDevEnvironment.ErrorData
  >({
    route: `/${BrowserToServerEvent.GetDevEnvironment.route}`,
    method: BrowserToServerEvent.GetDevEnvironment.method,
    forwardLog: logIfDevelopment,
  });
}

async function loginToApp(body: BrowserToServerEvent.LoginToApp.RequestBody) {
  return await request<
    BrowserToServerEvent.LoginToApp.Response,
    { message: string }
  >({
    route: `/${BrowserToServerEvent.LoginToApp.route}`,
    method: "POST",
    forwardLog: logIfDevelopment,
    body,
  });
}

async function getInviteCode(id: string) {
  const body: BrowserToServerEvent.GetInviteCode.RequestBody = null;

  const response = await request<
    BrowserToServerEvent.GetInviteCode.Response,
    BrowserToServerEvent.GetInviteCode.ErrorData
  >({
    route: `/${BrowserToServerEvent.GetInviteCode.route}`,
    method: BrowserToServerEvent.GetInviteCode.method,
    forwardLog: logIfDevelopment,
    params: {
      id,
    },
    body,
  });

  if (response.didError) {
    return response;
  }

  return {
    ...response,
    data: {
      ...response.data,
      expiresAt: new Date(response.data.expiresAt),
      createdAt: new Date(response.data.createdAt),
    },
  };
}

async function generateInviteCode(
  body: BrowserToServerEvent.GenerateInviteCode.RequestBody
) {
  const response = await request<
    BrowserToServerEvent.GenerateInviteCode.Response,
    BrowserToServerEvent.GenerateInviteCode.ErrorData
  >({
    route: `/${BrowserToServerEvent.GenerateInviteCode.route}`,
    method: BrowserToServerEvent.GenerateInviteCode.method,
    forwardLog: logIfDevelopment,
    body,
  });

  if (response.didError) {
    return response;
  }

  const data = {
    ...response.data,
    expiresAt: new Date(response.data.expiresAt),
    createdAt: new Date(response.data.createdAt),
  };

  return {
    ...response,
    data,
  };
}

async function deleteInviteCode(id: string) {
  return await request<
    BrowserToServerEvent.DeleteInviteCode.Response,
    BrowserToServerEvent.DeleteInviteCode.ErrorData
  >({
    route: `/${BrowserToServerEvent.DeleteInviteCode.route}`,
    method: BrowserToServerEvent.DeleteInviteCode.method,
    forwardLog: logIfDevelopment,
    params: {
      id,
    },
    body: {},
  });
}

async function createCheckoutSession(
  body: BrowserToServerEvent.CreateCheckoutSession.RequestBody
) {
  const response = await request<
    BrowserToServerEvent.CreateCheckoutSession.Response,
    BrowserToServerEvent.CreateCheckoutSession.ErrorData
  >({
    route: `/${BrowserToServerEvent.CreateCheckoutSession.route}`,
    method: BrowserToServerEvent.CreateCheckoutSession.method,
    forwardLog: logIfDevelopment,
    body,
  });

  return response;
}

async function getBillingData() {
  return await request<
    BrowserToServerEvent.BillingDetails.Response,
    BrowserToServerEvent.BillingDetails.ErrorData
  >({
    route: `/${BrowserToServerEvent.BillingDetails.route}`,
    method: BrowserToServerEvent.BillingDetails.method,
    forwardLog: logIfDevelopment,
    body: null,
  });
}

async function logEvent(body: BrowserToServerEvent.Log.RequestBody) {
  return await request<BrowserToServerEvent.Log.Response, { message: string }>({
    route: `/${BrowserToServerEvent.Log.route}`,
    method: BrowserToServerEvent.Log.method,
    forwardLog: logIfDevelopment,
    body,
  });
}

async function oauthLogin(body: BrowserToServerEvent.OauthLogin.RequestBody) {
  return await request<
    BrowserToServerEvent.OauthLogin.SuccessResponseBody,
    BrowserToServerEvent.OauthLogin.ErrorResponseBody
  >({
    route: `/${BrowserToServerEvent.OauthLogin.route}`,
    method: BrowserToServerEvent.OauthLogin.method,
    forwardLog: logIfDevelopment,
    body,
  });
}

async function logError(body: BrowserToServerEvent.LogError.RequestBody) {
  return await request<
    BrowserToServerEvent.LogError.SuccessResponseBody,
    BrowserToServerEvent.LogError.ErrorResponseBody
  >({
    route: `/${BrowserToServerEvent.LogError.route}`,
    method: BrowserToServerEvent.LogError.method,
    forwardLog: logIfDevelopment,
    body,
  });
}

async function updateUserMetadata(
  body: BrowserToServerEvent.UpdateUserMetadata.RequestBody
) {
  return await request<
    BrowserToServerEvent.UpdateUserMetadata.SuccessResponseBody,
    BrowserToServerEvent.UpdateUserMetadata.ErrorResponseBody
  >({
    route: `/${BrowserToServerEvent.UpdateUserMetadata.route}`,
    method: BrowserToServerEvent.UpdateUserMetadata.method,
    forwardLog: logIfDevelopment,
    body,
  });
}

export {
  initialize,
  initializeEnvironmentAndAuthorizeApp,
  googleOAuth2Callback,
  checkAuth,
  logout,
  completeSignUp,
  completeSignUpToOrg,
  insertExternalAppUser,
  getExternalAppUsers,
  deleteExternalAppUser,
  loginToApp,
  generateInviteCode,
  deleteInviteCode,
  getInviteCode,
  getSettings,
  createCheckoutSession,
  getBillingData,
  changeUserPermission,
  deleteUser,
  getUserDevEnvironment,
  logEvent,
  oauthLogin,
  logError,
  updateUserMetadata,
};
