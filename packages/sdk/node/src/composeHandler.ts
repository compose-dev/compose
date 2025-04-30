import * as api from "./api";
import {
  Page,
  SdkToServerEvent,
  ServerToSdkEvent,
  u,
} from "@composehq/ts-public";
import * as app from "./app";
import { PACKAGE_VERSION } from "./packageVersion";
import { debug } from "./utils";

const MAX_AUDIT_LOGS_PER_MINUTE = 10000;

type ComposeOptions<TApps extends readonly app.Definition[]> = {
  /**
   * A list of apps to serve.
   */
  apps: TApps;

  /**
   * A valid Compose API key.
   */
  apiKey: string;

  /**
   * A custom color palette to use for the apps.
   *
   * @example
   * ```typescript
   * theme: {
   *   textColor: "#000000", // text color
   *   backgroundColor: "#FFFFFF", // background color
   *   primaryColor: "#0074fc", // brand color
   * }
   * ```
   *
   * A full color palette will be generated from the provided theme. If the
   * `backgroundColor` is dark, the generated palette will be dark mode.
   */
  theme?: NonNullable<Partial<SdkToServerEvent.Initialize.Data["theme"]>>;

  /**
   * Whether to enable debug logging. Useful for identifying bugs and
   * performance issues.
   */
  debug?: boolean;

  /**
   * If self-hosting, use this field to specify the host of the Compose
   * server to connect to, e.g. `example.com`.
   *
   * Do not include the protocol (e.g. `https://`) or path (e.g. `/api/v1`) in
   * this value.
   */
  host?: string;
};

/**
 * Ensures that all routes are unique. Edits the apps in place and does not
 * return anything.
 *
 * @param apps - The apps to ensure uniqueness for.
 */
function getUniqueRoutes(apps: readonly app.Definition[]) {
  const routes = new Set<string>();

  for (const app of apps) {
    if (routes.has(app.route)) {
      throw new Error(`Duplicate route: ${app.route}`);
    }

    routes.add(app.route);
  }

  return routes;
}

/**
 * Ensures that all parentAppRoutes are valid. Throws an error if they are not.
 *
 * @param apps - The apps to ensure valid parentAppRoutes for.
 */
function ensureValidParentAppRoute(apps: readonly app.Definition[]) {
  for (const app of apps) {
    if (app.parentAppRoute !== undefined) {
      const parentApp = apps.find(
        (parentApp) => parentApp.route === app.parentAppRoute
      );

      if (parentApp === undefined) {
        throw new Error(
          `Failed to initialize Compose: parent app not found: ${app.parentAppRoute} for app: ${app.route}`
        );
      }

      if (parentApp.route === app.route) {
        throw new Error(
          `Failed to initialize Compose: app cannot have itself as a parent: ${app.route}`
        );
      }
    }
  }
}

function ensureValidNavs(
  navs: u.navigation.UserProvidedInterface[],
  appRoutes: Set<string>
) {
  for (const nav of navs) {
    for (const item of nav.items) {
      if (!appRoutes.has(item)) {
        throw new Error(
          `Failed to initialize Compose: could not find matching app route for nav item: ${item}`
        );
      }
    }

    // Arbitrary limit to prevent abuse.
    if (nav.items.length > 250) {
      throw new Error(
        "Failed to initialize Compose: navigation bar cannot have more than 250 items"
      );
    }

    if (nav.items.length === 0) {
      throw new Error(
        "Failed to initialize Compose: navigation bar has no items"
      );
    }
  }

  if (navs.length > 100) {
    throw new Error(
      "Failed to initialize Compose: cannot have more than 100 navigation bars"
    );
  }

  return true;
}

function getAppsByRoute(apps: readonly app.Definition[]) {
  const appsByRoute: Record<string, app.Definition> = {};

  for (const app of apps) {
    appsByRoute[app.route] = app;
  }

  return appsByRoute;
}

/**
 * Checks if the SDK is in development mode.
 *
 * @param config - The configuration to check.
 * @returns True if the SDK is in development mode, false otherwise.
 */
function isDevelopmentMode(options: ComposeOptions<readonly app.Definition[]>) {
  if (
    // @ts-expect-error We intentionally hide this flag from TypeScript!
    options.DANGEROUS_ENABLE_DEV_MODE !== undefined
  ) {
    // @ts-expect-error We intentionally hide this flag from TypeScript!
    return options.DANGEROUS_ENABLE_DEV_MODE;
  }

  return false;
}

class ComposeClient<TApps extends readonly app.Definition[]> {
  appDefinitions: Record<string, TApps[number]>;
  private isDevelopment: boolean;
  private apiKey: string;
  private theme: SdkToServerEvent.Initialize.Data["theme"];
  private debug: boolean;

  private api: api.Handler;

  private appRunners: Map<string, app.Runner>;

  private navSummaries: u.navigation.UserProvidedInterface[];

  private auditLogRateLimiter: u.RateLimiter;

  /**
   * Initialize a new Compose client. The client is responsible for
   * connecting to Compose's servers and transmitting events between
   * the SDK and Compose.
   *
   * After initializing the client, connect to the server by calling `client.connect()`.
   *
   * @example
   * ```typescript
   * import { Compose } from "@composehq/sdk";
   *
   * const client = new Compose.Client({
   *   apiKey: "your-api-key",
   *   apps: [app1, app2],
   * });
   *
   * client.connect();
   * ```
   *
   * @param {ComposeOptions} options - options to configure the client.
   * @param {ComposeOptions["apiKey"]} options.apiKey (required) A valid Compose API key.
   * @param {ComposeOptions["apps"]} options.apps (required) An array of apps to serve.
   * @param {ComposeOptions["theme"]} options.theme (optional) A custom color palette to use for the apps.
   * @param {ComposeOptions["debug"]} options.debug (optional) Whether to enable debug logging.
   */
  constructor(options: ComposeOptions<TApps>) {
    if (options.apiKey === undefined) {
      throw new Error("Missing 'apiKey' field in Compose.Client constructor");
    }

    if (options.apps === undefined) {
      throw new Error(
        "Missing 'apps' field in Compose.Client constructor. If you don't " +
          "want to pass any apps, you can pass an empty array."
      );
    }

    this.debug = options.debug ?? false;

    this.theme = options.theme === undefined ? null : options.theme;

    this.apiKey = options.apiKey;
    this.isDevelopment = isDevelopmentMode(options);

    // Will throw an error if there are duplicate routes.
    const appRoutes = getUniqueRoutes(options.apps);
    ensureValidParentAppRoute(options.apps);

    this.appDefinitions = getAppsByRoute(options.apps);
    this.api = new api.Handler(
      this.isDevelopment,
      this.apiKey,
      u.sdkPackage.NAME.NODE,
      PACKAGE_VERSION,
      {
        debug: this.debug,
        host: options.host,
      }
    );
    this.appRunners = new Map();

    this.summarizeNavs = this.summarizeNavs.bind(this);

    this.navSummaries = this.summarizeNavs();
    ensureValidNavs(this.navSummaries, appRoutes);

    // Allow 10000 audit log writes per 60 seconds. This is a sanity check to
    // prevent abuse.
    this.auditLogRateLimiter = new u.RateLimiter(
      MAX_AUDIT_LOGS_PER_MINUTE,
      60 * 1000
    );

    this.connect = this.connect.bind(this);
    this.summarizeApps = this.summarizeApps.bind(this);
    this.handleBrowserEvent = this.handleBrowserEvent.bind(this);
    this.executeApp = this.executeApp.bind(this);
    this.cleanup = this.cleanup.bind(this);
  }

  async connect() {
    this.api.addListener("browser-listener", this.handleBrowserEvent);
    this.api.connect();

    this.api.send({
      type: SdkToServerEvent.TYPE.INITIALIZE,
      apps: this.summarizeApps(),
      navs: this.navSummaries,
      theme: this.theme,
      packageName: u.sdkPackage.NAME.NODE,
      packageVersion: PACKAGE_VERSION,
    });
  }

  async shutdown() {
    this.api.shutdown();
  }

  private summarizeApps() {
    return Object.values(this.appDefinitions).map((appDefinition) =>
      appDefinition.summarize()
    );
  }

  private summarizeNavs() {
    const navIds: string[] = [];
    const navs: u.navigation.UserProvidedInterface[] = [];

    for (const appDefinition of Object.values(this.appDefinitions)) {
      if (
        appDefinition.navigation &&
        !navIds.includes(appDefinition.navigation.configuration.id)
      ) {
        navs.push(appDefinition.navigation.configuration);
        navIds.push(appDefinition.navigation.configuration.id);
      }
    }

    return navs;
  }

  private handleBrowserEvent(event: api.ListenerEvent) {
    if (event.type === ServerToSdkEvent.TYPE.START_EXECUTION) {
      if (this.debug) {
        debug.log("Browser", `Start app execution (route: ${event.appRoute})`);
      }

      this.executeApp(
        event.appRoute,
        event.executionId,
        event.sessionId,
        event.params
      );
      return;
    }

    if (event.type === ServerToSdkEvent.TYPE.CHECK_EXECUTION_EXISTS) {
      const exists = this.appRunners.has(event.executionId);

      if (!exists) {
        this.api.send(
          {
            type: SdkToServerEvent.TYPE.EXECUTION_EXISTS_RESPONSE_V2,
            exists,
          },
          event.sessionId,
          event.executionId
        );
      }

      return;
    }

    if (event.type === ServerToSdkEvent.TYPE.BROWSER_SESSION_ENDED) {
      this.cleanup(event.sessionId);
      return;
    }

    const runner = this.appRunners.get(event.executionId);

    if (runner === undefined) {
      return;
    }

    if (event.type === ServerToSdkEvent.TYPE.FILE_TRANSFER) {
      if (this.debug) {
        debug.log("Browser", "File transfer");
      }

      runner.onFileTransfer(event.fileId, event.fileContents);
      return;
    }

    if (event.type === ServerToSdkEvent.TYPE.ON_CLICK_HOOK) {
      if (this.debug) {
        debug.log("Browser", `click event (component: ${event.componentId})`);
      }

      runner.onClickHook(event.componentId, event.renderId);
      return;
    }

    if (event.type === ServerToSdkEvent.TYPE.ON_SUBMIT_FORM_HOOK) {
      if (this.debug) {
        debug.log(
          "Browser",
          `form submitted (component: ${event.formComponentId})`
        );
      }

      runner.onSubmitFormHook(
        event.formComponentId,
        event.renderId,
        event.formData
      );

      return;
    }

    if (
      event.type === ServerToSdkEvent.TYPE.ON_ENTER_HOOK ||
      event.type === ServerToSdkEvent.TYPE.ON_SELECT_HOOK ||
      event.type === ServerToSdkEvent.TYPE.ON_FILE_CHANGE_HOOK
    ) {
      if (this.debug) {
        debug.log("Browser", `input event (component: ${event.componentId})`);
      }

      runner.onInputHook(
        event.type,
        event.componentId,
        event.renderId,
        event.value
      );

      return;
    }

    if (event.type === ServerToSdkEvent.TYPE.ON_TABLE_ROW_ACTION_HOOK) {
      if (this.debug) {
        debug.log(
          "Browser",
          `table row action (component: ${event.componentId})`
        );
      }

      runner.onTableRowActionHook(
        event.componentId,
        event.renderId,
        event.actionIdx,
        event.value
      );

      return;
    }

    if (event.type === ServerToSdkEvent.TYPE.ON_CONFIRM_RESPONSE_HOOK) {
      if (this.debug) {
        debug.log(
          "Browser",
          `page confirmation response (component: ${event.componentId})`
        );
      }

      runner.onConfirmResponseHook(event.componentId, event.response);
      return;
    }

    if (event.type === ServerToSdkEvent.TYPE.ON_CLOSE_MODAL) {
      if (this.debug) {
        debug.log("Browser", `modal closed (fragment: ${event.renderId})`);
      }

      runner.onCloseModal(event.renderId);
      return;
    }

    if (event.type === ServerToSdkEvent.TYPE.ON_TABLE_PAGE_CHANGE_HOOK) {
      if (this.debug) {
        debug.log(
          "Browser",
          `table page change (component: ${event.componentId})`
        );
      }

      runner.onTablePageChangeHook(
        event.renderId,
        event.componentId,
        event.searchQuery,
        event.offset,
        event.pageSize,
        event.sortBy
      );
      return;
    }
  }

  private async executeApp(
    appRoute: string,
    executionId: string,
    browserSessionId: string,
    params: Page.Params = {}
  ) {
    if (appRoute in this.appDefinitions === false) {
      return;
    }

    // Clean up any old runners for this browser session.
    this.cleanup(browserSessionId);

    const appDefinition = this.appDefinitions[appRoute];

    const runner = new app.Runner(
      appDefinition,
      this.api,
      executionId,
      browserSessionId,
      {
        debug: this.debug,
        auditLogRateLimiter: this.auditLogRateLimiter,
      }
    );

    runner.execute(params);

    this.appRunners.set(executionId, runner);
  }

  private cleanup(browserSessionId: string) {
    const oldRunners = Array.from(this.appRunners.values()).filter(
      (runner) => runner.browserSessionId === browserSessionId
    );

    for (const oldRunner of oldRunners) {
      this.appRunners.delete(oldRunner.executionId);
    }
  }
}

export { ComposeClient };
