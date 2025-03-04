import { BrowserToServerEvent } from "@compose/ts";
import { createContext } from "react";
import { Type as ConnectionStatus } from "../connectionStatus";
import { u as uPublic } from "@composehq/ts-public";
import { WebsocketListener } from "~/api/ws";

interface WSContextData {
  /**
   *
   * @param callback A listener function to receive data.
   * @returns A destroy function that should be called in the effect cleanup.
   */
  addWSListener: (callback: WebsocketListener) => () => void;

  sendWSJsonMessage: (
    data: BrowserToServerEvent.WS.Data,
    environmentId: string
  ) => void;

  sendWSRawMessage: (
    data: string | ArrayBufferLike | Blob | ArrayBufferView,
    environmentId: string
  ) => void;

  setEnvironmentOnline: (environmentId: string, isOnline: boolean) => void;
  setEnvironmentsOnline: (environments: Record<string, boolean>) => void;

  connectionStatus: Record<string, ConnectionStatus>;
  connectionStatusRef: React.MutableRefObject<Record<string, ConnectionStatus>>;
  addConnectionStatusListener: (
    id: string,
    listener: (status: Record<string, ConnectionStatus>) => void
  ) => void;
  removeConnectionStatusListener: (id: string) => void;

  sessionId: string;

  updateEnvironmentPackage: (
    environmentId: string,
    packageName: uPublic.sdkPackage.Name | undefined,
    packageVersion: string | undefined
  ) => void;
}

const WSContext = createContext<WSContextData | null>(null);

export { WSContext, type WSContextData };
