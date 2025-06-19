import { request, log as logFunction, BrowserToServerEvent } from "@compose/ts";
import { getNodeEnvironment } from "~/utils/nodeEnvironment";

const isDev = getNodeEnvironment() === "development";

const log = isDev ? logFunction : null;

async function fetchEnvironmentWithDetails(environmentId: string) {
  const body: BrowserToServerEvent.FetchEnvironmentWithDetails.RequestBody =
    null;

  return await request<
    BrowserToServerEvent.FetchEnvironmentWithDetails.Response,
    { message: string }
  >({
    route: `/${BrowserToServerEvent.FetchEnvironmentWithDetails.route}`,
    forwardLog: log,
    body,
    params: {
      environmentId,
    },
  });
}

async function createEnvironment(
  body: BrowserToServerEvent.CreateEnvironment.RequestBody
) {
  return await request<
    BrowserToServerEvent.CreateEnvironment.Response,
    BrowserToServerEvent.CreateEnvironment.ErrorData
  >({
    route: `/${BrowserToServerEvent.CreateEnvironment.route}`,
    method: BrowserToServerEvent.CreateEnvironment.method,
    forwardLog: log,
    body,
  });
}

async function refreshEnvironmentApiKey(environmentId: string) {
  return await request<
    BrowserToServerEvent.RefreshEnvironmentApiKey.SuccessResponseBody,
    BrowserToServerEvent.RefreshEnvironmentApiKey.ErrorResponseBody
  >({
    route: `/${BrowserToServerEvent.RefreshEnvironmentApiKey.route}`,
    method: BrowserToServerEvent.RefreshEnvironmentApiKey.method,
    forwardLog: log,
    params: {
      environmentId,
    },
    body: {},
  });
}

async function deleteEnvironment(environmentId: string) {
  return await request<
    BrowserToServerEvent.DeleteEnvironment.SuccessResponseBody,
    BrowserToServerEvent.DeleteEnvironment.ErrorResponseBody
  >({
    route: `/${BrowserToServerEvent.DeleteEnvironment.route}`,
    method: BrowserToServerEvent.DeleteEnvironment.method,
    forwardLog: log,
    params: {
      environmentId,
    },
    body: {},
  });
}

export {
  fetchEnvironmentWithDetails,
  createEnvironment,
  refreshEnvironmentApiKey,
  deleteEnvironment,
};
