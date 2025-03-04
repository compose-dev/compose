import { AppRunner } from "../appRunner";
import { AppDefinition } from "../../appDefinition";
import { Handler } from "../../../api";
import { AppHandler } from "../../constants";
import { SdkToServerEvent } from "@composehq/ts-public";

const MAX_WAIT_MS = 10;

function mockRunner(
  handlerFunction: AppHandler<Record<string, any>> = () => {}
) {
  const appDefinition = new AppDefinition({
    name: "Test App",
    handler: handlerFunction,
  });

  const api = new Handler(true, "fake-api-key", "fake-package-name", "1.0.0");

  const appRunner = new AppRunner(
    appDefinition,
    api,
    "fake-execution-id",
    "fake-browser-session-id"
  );

  return { appDefinition, api, appRunner };
}

type WaitUntilOptions = Partial<{
  timeoutMs: number;
  intervalMs: number;
}>;

async function waitUntil(
  condition: () => boolean,
  options: WaitUntilOptions = {}
) {
  const timeoutMs = options.timeoutMs ?? MAX_WAIT_MS;
  const intervalMs = options.intervalMs ?? 15;

  const start = Date.now();

  while (!condition() && Date.now() - start < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

class ApiEventTracker {
  api: Handler;
  events: SdkToServerEvent.Data[] = [];

  renderCount = 0;
  rerenderCount = 0;

  metCondition = false;

  renders: Array<{ renderId: string; rootComponentId: string }> = [];

  constructor(
    api: Handler,
    options: Partial<{
      onEvent: (event: SdkToServerEvent.Data) => void;
      condition: (event: SdkToServerEvent.Data) => boolean | void;
    }> = {}
  ) {
    this.api = api;

    api.send = (event, sessionId) => {
      this.events.push(event);

      if (options.onEvent) {
        options.onEvent(event);
      }

      if (event.type === SdkToServerEvent.TYPE.RENDER_UI_V2) {
        this.renderCount++;
        this.renders.push({
          renderId: event.renderId,
          rootComponentId: event.ui.model.id,
        });
      } else if (event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3) {
        this.rerenderCount++;
      }

      if (options.condition && !this.metCondition) {
        const result = options.condition(event);

        if (result !== undefined) {
          this.metCondition = result;
        }
      }
    };
  }

  get oneRenderOrMore() {
    return this.renderCount > 0;
  }

  get oneRerenderOrMore() {
    return this.rerenderCount > 0;
  }

  waitUntilCondition(options: WaitUntilOptions = {}) {
    return waitUntil(() => this.metCondition, options);
  }
}

export { mockRunner, MAX_WAIT_MS, waitUntil, ApiEventTracker };
