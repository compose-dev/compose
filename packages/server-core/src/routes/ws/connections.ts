import { u as uPublic } from "@composehq/ts-public";
import { RawData as NodeWebSocketRawData } from "ws";

interface Connection<TMessage, TMetadata> {
  id: string;
  mostRecentMessageDate: Date | null;
  push: (data: TMessage) => void;
  metadata: TMetadata;
}

class Connections<TMessage, TMetadata> {
  private map: Map<string, Connection<TMessage, TMetadata>>;

  /**
   * For browser connections, this is a record of SDK connections -> list of browser connections.
   * For SDK connections, this is a record of browser connections -> list of SDK connections.
   *
   * The use case is for a browser to subscribe to SDK connection events. The SDK will
   * send the event to all browser listeners.
   */
  private subscriptions: Record<string, string[]>;

  constructor() {
    this.map = new Map();
    this.subscriptions = {};

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.exists = this.exists.bind(this);
    this.push = this.push.bind(this);
    this.pushToSubscribers = this.pushToSubscribers.bind(this);
  }

  add(
    connectionId: string,
    callback: (data: TMessage) => void,
    subscribeTo: string[],
    metadata: TMetadata
  ) {
    this.map.set(connectionId, {
      id: connectionId,
      mostRecentMessageDate: null,
      push: callback,
      metadata,
    });

    for (const subscriptionId of subscribeTo) {
      if (!this.subscriptions[subscriptionId]) {
        this.subscriptions[subscriptionId] = [connectionId];
      } else {
        this.subscriptions[subscriptionId].push(connectionId);
      }
    }
  }

  remove(connectionId: string) {
    for (const subscriptionId of Object.keys(this.subscriptions)) {
      if (this.subscriptions[subscriptionId].includes(connectionId)) {
        this.subscriptions[subscriptionId] = this.subscriptions[
          subscriptionId
        ].filter((id) => id !== connectionId);
      }
    }

    return this.map.delete(connectionId);
  }

  exists(connectionId: string) {
    return this.map.has(connectionId);
  }

  get(connectionId: string) {
    return this.map.get(connectionId);
  }

  push(connectionId: string, data: TMessage) {
    const connection = this.map.get(connectionId);
    if (connection) {
      connection.push(data);
      connection.mostRecentMessageDate = new Date();
    }
  }

  pushToSubscribers(
    subscriptionId: string,
    data: (connectionId: string) => TMessage
  ) {
    const connections = this.subscriptions[subscriptionId];
    if (connections) {
      connections.forEach((connectionId) =>
        this.push(connectionId, data(connectionId))
      );
    }
  }

  summarize() {
    return {
      connections: Array.from(this.map.values()).map(
        ({ id, mostRecentMessageDate }) => ({
          id,
          mostRecentMessageDate,
        })
      ),
      subscriptions: this.subscriptions,
    };
  }
}

class SdkConnections extends Connections<
  NodeWebSocketRawData,
  {
    packageName: uPublic.sdkPackage.Name;
    packageVersion: string;
    useNewHeaderFormat: boolean;
  }
> {}

class BrowserConnections extends Connections<
  NodeWebSocketRawData,
  Record<string, never>
> {}

export { Connections, SdkConnections, BrowserConnections };
