import { useCallback, useEffect, useRef, useState } from "react";

import {
  CONNECTION_STATUS,
  CONNECTING_INTERVAL_MS,
  type ConnectionStatus,
  SERVER_UPDATE_GRACE_PERIOD_MS,
} from "./constants";
import { u } from "@compose/ts";

function timeSince(timestamp: number) {
  return Date.now() - timestamp;
}

function isConnecting(appStartedTimestamp: number) {
  return timeSince(appStartedTimestamp) < CONNECTING_INTERVAL_MS;
}

function serverUpdateInProgress(serverUpdateStartedTimestamp: number | null) {
  if (serverUpdateStartedTimestamp === null) {
    return false;
  }

  return (
    timeSince(serverUpdateStartedTimestamp) < SERVER_UPDATE_GRACE_PERIOD_MS
  );
}

function isEqual(
  a: Record<string, ConnectionStatus>,
  b: Record<string, ConnectionStatus>
) {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}

function getConnectionStatus(
  browserIsOnline: boolean,
  environmentIsOnline: boolean,
  appStartedTimestamp: number,
  serverUpdateStartedTimestamp: number | null
): ConnectionStatus {
  if (!browserIsOnline) {
    if (isConnecting(appStartedTimestamp)) {
      return CONNECTION_STATUS.BROWSER_CONNECTING;
    }

    if (serverUpdateInProgress(serverUpdateStartedTimestamp)) {
      return CONNECTION_STATUS.SERVER_UPDATE_IN_PROGRESS;
    }

    return CONNECTION_STATUS.BROWSER_OFFLINE;
  }

  if (!environmentIsOnline) {
    if (isConnecting(appStartedTimestamp)) {
      return CONNECTION_STATUS.ENVIRONMENT_CONNECTING;
    }

    if (serverUpdateInProgress(serverUpdateStartedTimestamp)) {
      return CONNECTION_STATUS.SERVER_UPDATE_IN_PROGRESS;
    }

    return CONNECTION_STATUS.ENVIRONMENT_OFFLINE;
  }

  return CONNECTION_STATUS.ONLINE;
}

function useConnectionStatus() {
  const appStartedTimestamp = useRef(Date.now());
  const browserIsOnlineRef = useRef(false);
  const serverUpdateStartedTimestamp = useRef<number | null>(null);
  const environmentsOnlineRef = useRef<Record<string, boolean>>({});

  const listeners = useRef<
    Record<string, (status: Record<string, ConnectionStatus>) => void>
  >({});

  const [connectionStatus, setConnectionStatus] = useState<
    Record<string, ConnectionStatus>
  >({});

  const connectionStatusRef = useRef<Record<string, ConnectionStatus>>({});

  const updateConnectionStatus = useCallback(() => {
    const newConnectionStatus = u.object.mapValues(
      environmentsOnlineRef.current,
      (isOnline) =>
        getConnectionStatus(
          browserIsOnlineRef.current,
          isOnline,
          appStartedTimestamp.current,
          serverUpdateStartedTimestamp.current
        )
    );

    if (!isEqual(newConnectionStatus, connectionStatusRef.current)) {
      connectionStatusRef.current = newConnectionStatus;
      setConnectionStatus(newConnectionStatus);

      for (const listener of Object.values(listeners.current)) {
        listener(newConnectionStatus);
      }
    }
  }, []);

  // Quick and easy way to keep the connection status always up to date:
  // just check every 3 seconds.
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateConnectionStatus();
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [updateConnectionStatus]);

  const setEnvironmentsOnline = useCallback(
    (environments: Record<string, boolean>) => {
      environmentsOnlineRef.current = environments;
      updateConnectionStatus();
    },
    [updateConnectionStatus]
  );

  const setEnvironmentOnline = useCallback(
    (environmentId: string, isOnline: boolean) => {
      environmentsOnlineRef.current[environmentId] = isOnline;
      updateConnectionStatus();
    },
    [updateConnectionStatus]
  );

  const setIsBrowserConnected = useCallback(
    (isOnline: boolean, serverUpdateStarted: boolean = false) => {
      if (serverUpdateStarted) {
        serverUpdateStartedTimestamp.current = Date.now();
      }

      if (isOnline) {
        browserIsOnlineRef.current = true;
        serverUpdateStartedTimestamp.current = null;
      } else {
        browserIsOnlineRef.current = false;

        // If the browser went offline, we should assume all environments are
        // offline too. Once the browser comes back online, we'll check
        // environments again.
        environmentsOnlineRef.current = u.object.mapValues(
          environmentsOnlineRef.current,
          () => false
        );
      }

      updateConnectionStatus();
    },
    [updateConnectionStatus]
  );

  const addListener = useCallback(
    (
      id: string,
      listener: (status: Record<string, ConnectionStatus>) => void
    ) => {
      listeners.current[id] = listener;
    },
    []
  );

  const removeListener = useCallback((id: string) => {
    delete listeners.current[id];
  }, []);

  return {
    setIsBrowserConnected,
    setEnvironmentsOnline,
    setEnvironmentOnline,
    connectionStatus,
    connectionStatusRef,
    addListener,
    removeListener,
  };
}

export { useConnectionStatus, CONNECTION_STATUS, type ConnectionStatus };
