import {
  BrowserToServerEvent,
  log,
  m,
  ServerToBrowserEvent,
  u,
} from "@compose/ts";
import { u as uPub } from "@composehq/ts-public";
import { v4 as uuid } from "uuid";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { appStore } from "~/utils/appStore";
import { ConnectionStatus, useWSContext } from "~/utils/wsContext";
import { getNodeEnvironment } from "~/utils/nodeEnvironment";
import { theme } from "~/utils/theme";
import { api } from "~/api";

import { toast } from "~/utils/toast";
import { useShallow } from "zustand/react/shallow";
import { WebsocketListener } from "~/api/ws";

const isDev = getNodeEnvironment() === "development";

const routeApi = getRouteApi("/app/$environmentId/$appRoute");

function downloadFile(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function useAppRunner() {
  const { addToast } = toast.useStore();
  const navigate = useNavigate({ from: "/app/$environmentId/$appRoute" });
  const { environmentId, appRoute: currentRoute } = routeApi.useParams();

  const queryParams = routeApi.useSearch();

  const [isExternalUser, setIsExternalUser] = useState(false);

  const {
    addWSListener,
    addConnectionStatusListener,
    removeConnectionStatusListener,
    sendWSJsonMessage,
    sessionId,
    setEnvironmentOnline,
    connectionStatusRef,
    connectionStatus: connectionStatusMap,
    updateEnvironmentPackage,
  } = useWSContext();

  const connectionStatus = useMemo(() => {
    return connectionStatusMap[environmentId];
  }, [connectionStatusMap, environmentId]);

  const executionId = appStore.use((state) => state.executionId);
  const dispatch = appStore.use((state) => state.dispatch);
  const appRoute = appStore.use((state) => state.route);
  const wentOffline = appStore.use((state) => state.wentOffline);
  const pageConfirm = appStore.use((state) => state.pageConfirm);
  const error = appStore.use((state) => state.error);
  const config = appStore.use((state) => state.config);
  const renders = appStore.use((state) => state.renders);
  const renderToRootComponent = appStore.use(
    useShallow((state) => state.renderToRootComponent)
  );
  const pageLoading = appStore.use((state) => state.loading);
  const setNavs = appStore.useNavigation((state) => state.setNavs);

  const [loadingAuthorization, setLoadingAuthorization] = useState(true);

  const isInitialized = useRef(false);
  const isAuthorized = useRef(false);

  const [environmentApps, setEnvironmentApps] = useState<
    m.Environment.DB["apps"]
  >([]);

  const { rendersRef, addRender, resetRenders } = appStore.useRenders();

  const { updateManualTheme, updatePreference } = theme.use();

  const resetApp = useCallback(
    (id: string | null = null, route: string | null = null) => {
      resetRenders();

      dispatch({
        type: appStore.EVENT_TYPE.RESTART_APP,
        properties: {
          executionId: id,
          route,
        },
      });
    },
    [dispatch, resetRenders]
  );

  const sendStartExecutionMessage = useCallback(
    async (route: string, envId: string) => {
      const id = uuid();

      // If the connection is offline, we should reset the app to a fresh state.
      // We listen elsewhere in the hook for when the connection comes back online
      // to start the app.
      if (connectionStatusRef.current[envId] !== ConnectionStatus.TYPE.ONLINE) {
        resetApp();
        return;
      }

      resetApp(id, route);
      sendWSJsonMessage(
        {
          type: BrowserToServerEvent.WS.TYPE.START_EXECUTION,
          appRoute: route,
          executionId: id,
          sessionId,
          params: queryParams,
        },
        envId
      );
    },
    [resetApp, sessionId, sendWSJsonMessage, queryParams, connectionStatusRef]
  );

  const initializeApp = useCallback(
    async (envId: string, route: string) => {
      const response = await api.routes.initializeEnvironmentAndAuthorizeApp({
        environmentId: envId,
        appRoute: route,
        sessionId,
      });

      if (response.didError) {
        if (response.statusCode === 400 || response.statusCode === 500) {
          window.alert(response.data.message);
        } else {
          navigate({
            to: "/auth/login-to-app",
            search: {
              environmentId: envId,
              appRoute: route,
              paramsString: window.location.search,
            },
          });
        }

        setLoadingAuthorization(false);
        return;
      }

      document.title = response.data.app.name;

      const theme = response.data.environment.theme;

      updateManualTheme(theme);
      setEnvironmentApps(response.data.environment.apps);
      isAuthorized.current = true;
      setLoadingAuthorization(false);
      setIsExternalUser(response.data.user.isExternal);
      setNavs(
        response.data.environment.navs,
        response.data.environment.apps,
        envId,
        response.data.companyName
      );

      updateEnvironmentPackage(
        envId,
        response.data.environment.sdkPackageName,
        response.data.environment.sdkPackageVersion
      );

      sendStartExecutionMessage(route, envId);
    },
    [
      navigate,
      sendStartExecutionMessage,
      updateManualTheme,
      updateEnvironmentPackage,
      sessionId,
      setNavs,
    ]
  );

  const restartApp = useCallback(() => {
    if (isAuthorized.current) {
      sendStartExecutionMessage(currentRoute, environmentId);
    } else {
      resetApp();
    }
  }, [sendStartExecutionMessage, resetApp, currentRoute, environmentId]);

  // Route listener
  useEffect(() => {
    // If the user has switched apps, we need to re-initialize the app
    if (appRoute !== null && currentRoute !== appRoute) {
      isInitialized.current = true;

      initializeApp(environmentId, currentRoute);
    }

    // Initialize the app on page load
    if (currentRoute !== null && !isInitialized.current) {
      isInitialized.current = true;
      setEnvironmentOnline(environmentId, false);
      initializeApp(environmentId, currentRoute);
    }
  }, [
    currentRoute,
    appRoute,
    environmentId,
    initializeApp,
    setEnvironmentOnline,
  ]);

  // Connection status listener
  useEffect(() => {
    function connectionStatusListener(
      map: Record<string, ConnectionStatus.Type>
    ) {
      connectionStatusRef.current = map;

      const newConnectionStatus =
        map[environmentId] || ConnectionStatus.TYPE.BROWSER_OFFLINE;

      if (newConnectionStatus === ConnectionStatus.TYPE.ONLINE) {
        // If the connection comes online and the app hasn't yet started, start
        // it.
        if (executionId === null && isAuthorized.current) {
          sendStartExecutionMessage(currentRoute, environmentId);
        }

        // If the app goes back online after being offline, check if the execution
        // context still exists on the SDK side. If it doesn't, we'll restart the
        // app client side.
        if (executionId !== null && wentOffline) {
          sendWSJsonMessage(
            {
              type: BrowserToServerEvent.WS.TYPE.CHECK_EXECUTION_EXISTS,
              executionId,
              sessionId,
            },
            environmentId
          );
        }
      }

      if (newConnectionStatus !== ConnectionStatus.TYPE.ONLINE) {
        // If the app is running and it goes offline, mark that it went offline.
        if (executionId) {
          dispatch({
            type: appStore.EVENT_TYPE.WENT_OFFLINE,
          });
        }
      }
    }

    const id = uuid();
    addConnectionStatusListener(id, connectionStatusListener);

    return () => {
      removeConnectionStatusListener(id);
    };
  }, [
    environmentId,
    addConnectionStatusListener,
    removeConnectionStatusListener,
    currentRoute,
    dispatch,
    executionId,
    sendStartExecutionMessage,
    sendWSJsonMessage,
    sessionId,
    wentOffline,
    connectionStatusRef,
  ]);

  // WS event listener
  useEffect(() => {
    function listener(
      data: Parameters<WebsocketListener>[0],
      args: Parameters<WebsocketListener>[1]
    ) {
      if (isDev) {
        const prettyType = Object.keys(ServerToBrowserEvent.TYPE).find(
          (key) =>
            ServerToBrowserEvent.TYPE[
              key as keyof typeof ServerToBrowserEvent.TYPE
            ] === data.type
        );

        log(`Received WS Message: ${prettyType}`, data, "red");
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.SDK_CONNECTION_STATUS_CHANGED
      ) {
        updateEnvironmentPackage(
          environmentId,
          data.packageName,
          data.packageVersion
        );

        setEnvironmentOnline(environmentId, data.isOnline);
        return;
      }

      if (data.type === ServerToBrowserEvent.TYPE.JSON_PARSE_ERROR) {
        dispatch({
          type: appStore.EVENT_TYPE.ADD_APP_ERROR,
          properties: {
            severity: data.severity,
            message: data.errorMessage,
          },
        });

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.EXECUTION_EXISTS_RESPONSE ||
        data.type === ServerToBrowserEvent.TYPE.EXECUTION_EXISTS_RESPONSE_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        if (!data.exists) {
          restartApp();
        }

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.PAGE_CONFIG ||
        data.type === ServerToBrowserEvent.TYPE.PAGE_CONFIG_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        dispatch({
          type: appStore.EVENT_TYPE.SET_PAGE_CONFIG,
          properties: {
            config: data.config,
          },
        });

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.RENDER_UI ||
        data.type === ServerToBrowserEvent.TYPE.RENDER_UI_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        addRender(data["renderId"], data["idx"]);

        dispatch({
          type: appStore.EVENT_TYPE.ADD_RENDER,
          properties: {
            renderId: data["renderId"],
            ui: data["ui"],
            renders: rendersRef.current,
            appearance: data["appearance"],
            modalHeader: data["modalHeader"],
            modalWidth: data["modalWidth"],
          },
        });

        return;
      }

      if (data["type"] === ServerToBrowserEvent.TYPE.RERENDER_UI) {
        if (data.executionId !== executionId) {
          return;
        }

        dispatch({
          type: appStore.EVENT_TYPE.UPDATE_RENDERS,
          properties: {
            diff: data["diff"],
          },
        });

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.RERENDER_UI_V2 ||
        data.type === ServerToBrowserEvent.TYPE.RERENDER_UI_V3
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        dispatch({
          type: appStore.EVENT_TYPE.UPDATE_RENDERS_V2,
          properties: {
            diff: data["diff"],
            version: data["v"],
          },
        });

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.FORM_VALIDATION_ERROR ||
        data.type === ServerToBrowserEvent.TYPE.FORM_VALIDATION_ERROR_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        dispatch({
          type: appStore.EVENT_TYPE.ADD_REMOTE_FORM_VALIDATION_ERRORS,
          properties: {
            formComponentId: data["formComponentId"],
            renderId: data["renderId"],
            inputComponentErrors: data["inputComponentErrors"],
            formError: data["formError"],
          },
        });

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.INPUT_VALIDATION_ERROR ||
        data.type === ServerToBrowserEvent.TYPE.INPUT_VALIDATION_ERROR_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        dispatch({
          type: appStore.EVENT_TYPE.ADD_REMOTE_INPUT_VALIDATION_ERRORS,
          properties: {
            componentId: data["componentId"],
            renderId: data["renderId"],
            error: data["error"],
          },
        });

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.TABLE_PAGE_CHANGE_RESPONSE ||
        data.type === ServerToBrowserEvent.TYPE.TABLE_PAGE_CHANGE_RESPONSE_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        dispatch({
          type: appStore.EVENT_TYPE.TABLE_PAGE_CHANGE_RESPONSE,
          properties: data,
        });

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.STALE_STATE_UPDATE ||
        data.type === ServerToBrowserEvent.TYPE.STALE_STATE_UPDATE_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        dispatch({
          type: appStore.EVENT_TYPE.UPDATE_COMPONENT_STALE_STATE,
          properties: data,
        });

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.APP_ERROR ||
        data.type === ServerToBrowserEvent.TYPE.APP_ERROR_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        if (data.severity === "info") {
          addToast({
            message: data.errorMessage,
            appearance: "warning",
          });
          return;
        }

        dispatch({
          type: appStore.EVENT_TYPE.ADD_APP_ERROR,
          properties: {
            severity: data.severity || "error",
            message: data.errorMessage,
          },
        });

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.FILE_TRANSFER ||
        data.type === ServerToBrowserEvent.TYPE.FILE_TRANSFER_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        if (data.metadata.download === true) {
          downloadFile(data.fileContents, data.metadata.name);
        }
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.LINK ||
        data.type === ServerToBrowserEvent.TYPE.LINK_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        if (u.string.isValidUrl(data.appRouteOrUrl)) {
          window.open(data.appRouteOrUrl, data.newTab ? "_blank" : "_self");
        } else {
          const formatted = uPub.appRoute.format(data.appRouteOrUrl);

          if (environmentApps.find((app) => app.route === formatted)) {
            if (data.newTab) {
              const url = new URL(
                `/app/${environmentId}/${formatted}`,
                window.location.origin
              );

              if (data.params) {
                Object.entries(data.params).forEach(([key, value]) => {
                  url.searchParams.append(key, String(value));
                });
              }

              window.open(url.toString(), "_blank");
            } else {
              navigate({
                to: `/app/${environmentId}/${formatted}`,
                search: data.params,
              });
            }
          } else {
            addToast({
              message: `Failed to navigate to ${data.appRouteOrUrl}. Could not find app within list of available apps.`,
              appearance: "error",
            });
          }
        }

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.FORM_SUBMISSION_SUCCESS ||
        data.type === ServerToBrowserEvent.TYPE.FORM_SUBMISSION_SUCCESS_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        dispatch({
          type: appStore.EVENT_TYPE.FORM_SUBMISSION_SUCCESS,
          properties: {
            formComponentId: data.formComponentId,
            renderId: data.renderId,
          },
        });

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.RELOAD_PAGE ||
        data.type === ServerToBrowserEvent.TYPE.RELOAD_PAGE_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        restartApp();

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.CONFIRM ||
        data.type === ServerToBrowserEvent.TYPE.CONFIRM_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        dispatch({
          type: appStore.EVENT_TYPE.ADD_PAGE_CONFIRM,
          properties: { pageConfirm: data.component },
        });

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.TOAST ||
        data.type === ServerToBrowserEvent.TYPE.TOAST_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        const toast = data.options
          ? { message: data.message, ...data.options }
          : { message: data.message };

        addToast(toast);

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.SET_INPUTS ||
        data.type === ServerToBrowserEvent.TYPE.SET_INPUTS_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        dispatch({
          type: appStore.EVENT_TYPE.SET_INPUTS,
          properties: {
            inputs: data.inputs,
          },
        });

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.CLOSE_MODAL ||
        data.type === ServerToBrowserEvent.TYPE.CLOSE_MODAL_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        dispatch({
          type: appStore.EVENT_TYPE.CLOSE_MODAL,
          properties: {
            renderId: data.renderId,
          },
        });

        return;
      }

      if (
        data.type === ServerToBrowserEvent.TYPE.UPDATE_LOADING ||
        data.type === ServerToBrowserEvent.TYPE.UPDATE_LOADING_V2
      ) {
        if (args.executionId !== executionId) {
          return;
        }

        dispatch({
          type: appStore.EVENT_TYPE.UPDATE_LOADING,
          properties: {
            value: data.value,
            properties: data.properties,
          },
        });

        return;
      }
    }

    const destroy = addWSListener(listener);

    return () => {
      destroy();
    };
  }, [
    addWSListener,
    dispatch,
    restartApp,
    environmentId,
    executionId,
    setEnvironmentOnline,
    environmentApps,
    navigate,
    addToast,
    rendersRef,
    addRender,
    updatePreference,
    updateEnvironmentPackage,
  ]);

  return {
    loadingAuthorization,
    error,
    restartApp,
    pageConfirm,
    dispatch,
    config,
    renders,
    renderToRootComponent,
    executionId,
    environmentId,
    sendWSJsonMessage,
    connectionStatus,
    isExternalUser,
    browserSessionId: sessionId,
    pageLoading,
  };
}

export { useAppRunner };
