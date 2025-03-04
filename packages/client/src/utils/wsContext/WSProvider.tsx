import { BrowserToServerEvent } from "@compose/ts";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { toast } from "~/utils/toast";
import { u as uPublic } from "@composehq/ts-public";

import { api } from "~/api";

import { useAuthContext } from "~/utils/authContext";

import { WSContext } from "./WSContext";
import * as ConnectionStatus from "../connectionStatus";
import { WebsocketListener } from "~/api/ws";
import { appStore } from "../appStore";

const SERVER_UPDATING_MESSAGE = {
  title: "Server is updating",
  message:
    "Could not send message due to active server update. Please wait ~15 seconds before trying again.",
  appearance: toast.APPEARANCE.warning,
} as const;

const SERVER_OFFLINE_MESSAGE = {
  title: "Could not send message",
  message:
    "Please check your connection and try again. If the problem persists, contact support.",
  appearance: toast.APPEARANCE.error,
} as const;

const WSProvider: React.FC<{
  children: React.ReactNode;
  environmentId?: string;
  appRoute?: string;
}> = ({ children, environmentId, appRoute }) => {
  const { isAuthenticated } = useAuthContext();

  const { addToast } = toast.useStore();
  const executionId = appStore.use((state) => state.executionId);

  const {
    connectionStatus,
    connectionStatusRef,
    setIsBrowserConnected,
    setEnvironmentOnline,
    setEnvironmentsOnline,
    addListener: addConnectionStatusListener,
    removeListener: removeConnectionStatusListener,
  } = ConnectionStatus.use();

  const [sessionId] = useState(uuid());

  const [wsClient] = useState(
    new api.ws.Client(
      sessionId,
      setIsBrowserConnected,
      environmentId,
      appRoute,
      executionId
    )
  );

  const environmentToPackage = useRef<
    Record<
      string,
      {
        name: uPublic.sdkPackage.Name | undefined;
        version: string | undefined;
        useNewHeaderFormat: boolean;
      }
    >
  >({});

  useEffect(() => {
    if (isAuthenticated) {
      wsClient.connect();
    }
  }, [wsClient, isAuthenticated]);

  useEffect(() => {
    wsClient.updateExecutionId(executionId);
  }, [executionId, wsClient]);

  // Connection status listener
  useEffect(() => {
    const id = uuid();

    addConnectionStatusListener(id, (status) => {
      connectionStatusRef.current = status;
    });

    return () => removeConnectionStatusListener(id);
  }, [
    addConnectionStatusListener,
    removeConnectionStatusListener,
    // The linter doesn't realize this is a ref, but it won't actually affect
    // the behavior to include it.
    connectionStatusRef,
  ]);

  /**
   *
   * @param callback A listener function to receive data.
   * @returns A destroy function that should be called in the effect cleanup.
   */
  const addWSListener = useCallback(
    (callback: WebsocketListener) => {
      const randomUUID = uuid();

      wsClient.addListener(randomUUID, callback);

      function removeListener() {
        wsClient.removeListener(randomUUID);
      }

      return removeListener;
    },
    [wsClient]
  );

  const sendWSJsonMessage = useCallback(
    (data: BrowserToServerEvent.WS.Data, environmentId: string) => {
      if (
        connectionStatusRef.current[environmentId] ===
        ConnectionStatus.TYPE.ONLINE
      ) {
        wsClient.sendJson(
          data,
          environmentId,
          environmentToPackage.current[environmentId]?.useNewHeaderFormat ??
            false
        );
      } else if (
        connectionStatusRef.current[environmentId] ===
        ConnectionStatus.TYPE.SERVER_UPDATE_IN_PROGRESS
      ) {
        addToast(SERVER_UPDATING_MESSAGE);
      } else {
        addToast(SERVER_OFFLINE_MESSAGE);
      }
    },
    [wsClient, addToast, connectionStatusRef]
  );

  const sendWSRawMessage = useCallback(
    (
      data: string | ArrayBufferLike | Blob | ArrayBufferView,
      environmentId: string
    ) => {
      if (
        connectionStatusRef.current[environmentId] ===
        ConnectionStatus.TYPE.ONLINE
      ) {
        wsClient.sendRaw(data);
      } else if (
        connectionStatusRef.current[environmentId] ===
        ConnectionStatus.TYPE.SERVER_UPDATE_IN_PROGRESS
      ) {
        addToast(SERVER_UPDATING_MESSAGE);
      } else {
        addToast(SERVER_OFFLINE_MESSAGE);
      }
    },
    [wsClient, addToast, connectionStatusRef]
  );

  const updateEnvironmentPackage = useCallback(
    (
      environmentId: string,
      packageName: uPublic.sdkPackage.Name | undefined,
      packageVersion: string | undefined
    ) => {
      environmentToPackage.current[environmentId] = {
        name: packageName,
        version: packageVersion,
        // precompute this here since the result of the computation
        // is used often, but the underlying variables change infrequently.
        useNewHeaderFormat: uPublic.sdkPackage.shouldUseNewHeaderFormat(
          packageName,
          packageVersion
        ),
      };
    },
    []
  );

  return (
    <WSContext.Provider
      value={{
        addWSListener,
        sendWSJsonMessage,
        sendWSRawMessage,
        connectionStatus,
        connectionStatusRef,
        setEnvironmentOnline,
        setEnvironmentsOnline,
        addConnectionStatusListener,
        removeConnectionStatusListener,
        sessionId,
        updateEnvironmentPackage,
      }}
    >
      {children}
    </WSContext.Provider>
  );
};

export { WSProvider };
