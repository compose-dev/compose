import { u as uPub } from "@composehq/ts-public";
import { AppHandler } from "./constants";
import { Navigation } from "../nav";

export interface RequiredAppOptions<TRoute extends string> {
  /**
   * A unique route to assign to the app and use as the URL slug.
   *
   * If not provided, the route will be auto-generated based on the app name.
   *
   * @correct "user-management-app"
   * @correct "/user-management-app"
   * @incorrect "users/management-app"
   * @incorrect "/user$management$app"
   */
  route: TRoute;
  /**
   * The handler function for the app.
   */
  handler: AppHandler;
}

export interface OptionalAppOptions {
  /**
   * A name to identify the app in the homepage UI, and as the title of the browser tab.
   * If not provided, will be inferred from the route.
   *
   * @example "User Management App"
   */
  name: string | null;
  /**
   * A short description of the app to display on the home page.
   */
  description: string | null;
  /**
   * Whether the app should be hidden from the home page.
   */
  hidden?: boolean;
  /**
   * @deprecated Use `page.update()` to manage state instead. See {@link https://docs.composehq.com/page-actions/update documentation}
   */
  initialState: Record<string, any>;
  /**
   * If this app is a sub-page of a multi-page app, declare the parent app
   * route here. Declaring this value will:
   *
   * a) allow this app to inherit permissions from the parent app (e.g. if the
   * parent app is shared with an external email, this app will be too).
   *
   * b) hide this app in the Compose dashboard so that the dashboard isn't
   * cluttered with sub-pages for a multi-page app. This app will still
   * be available programmatically (e.g. via the `page.link` function) and
   * via the URL. This feature can be overriden by directly setting the
   * `hidden` property to `false`.
   */
  parentAppRoute?: string;

  /**
   * Display a navigation pane that links to other apps. See {@link https://docs.composehq.com/components/navigation documentation} for more information.
   */
  navigation?: Navigation;
}

type AppOptions<TRoute extends string> = RequiredAppOptions<TRoute> &
  Partial<OptionalAppOptions>;

class AppDefinition<TRoute extends string = string> {
  private _route: RequiredAppOptions<TRoute>["route"];
  handler: RequiredAppOptions<TRoute>["handler"];

  private description: OptionalAppOptions["description"];
  private hidden: OptionalAppOptions["hidden"];
  private name: NonNullable<OptionalAppOptions["name"]>;
  private _parentAppRoute?: OptionalAppOptions["parentAppRoute"];
  private nav: Navigation | undefined;

  private _initialState: Record<string, any>;

  /**
   * Create a new Compose app based on the provided properties.
   *
   * @example
   * ```ts
   * const app = new Compose.App({
   *   route: "my-app",
   *   handler: async ({ page, ui }) => {
   *     page.add(() => ui.text("Hello, world!"));
   *   },
   * });
   * ```
   *
   * @param options - Properties to configure the app. "route" and "handler" are required, the rest are optional.
   * @param options.route - A unique key to identify the app (e.g. `users-dashboard` or `/users-dashboard`). Used for routing, multipage apps, nav bars, etc. The route should NOT contain special characters (e.g. `$-app`) or nested routes (e.g. `apps/users`).
   * @param options.handler - The handler function for the app. (see example above)
   * @param options.name - The name of the app. If not provided, the name will be inferred from the route. For example: "My App"
   * @param options.description - A short description of the app to display on the home page. For example: "A simple app to manage my users"
   * @param options.parentAppRoute - The route of the parent app. If provided, the app will be considered a sub-page of the parent app. The main use case for this is that anyone granted access to the parent app will also have access to this sub-page.
   * @param options.hidden - Boolean value to determine if the app should be hidden from the home page. Defaults to `false`, except for sub-pages, which default to `true`.
   * @param options.navigation - Display a navigation pane that links to other apps. See {@link https://docs.composehq.com/components/navigation documentation} for more information.
   */
  constructor(options: AppOptions<TRoute>) {
    if (!options.route) {
      throw new Error(
        "Failed to initialize Compose: route argument is required when creating a new Compose app."
      );
    }

    this._route = uPub.appRoute.format(options.route) as TRoute;

    try {
      uPub.appRoute.isValid(this._route);
    } catch (error) {
      throw new Error(
        "Failed to initialize Compose. Received invalid route: " +
          this._route +
          ". " +
          (error as Error).message
      );
    }

    this.name = options.name || uPub.string.prettifyKey(this._route);
    this.handler = options.handler;

    this.description = options.description ?? null;
    this.hidden = options.hidden;
    this._parentAppRoute = options.parentAppRoute
      ? uPub.appRoute.format(options.parentAppRoute)
      : undefined;

    this.nav = options.navigation;

    this._initialState = options.initialState ?? {};

    this.summarize = this.summarize.bind(this);
  }

  get route() {
    return this._route;
  }

  get parentAppRoute() {
    return this._parentAppRoute;
  }

  summarize() {
    return {
      name: this.name,
      route: this.route,
      description: this.description,
      hidden: this.hidden,
      parentAppRoute: this._parentAppRoute,
      navId: this.nav ? this.nav.configuration.id : undefined,
    };
  }

  get navigation() {
    return this.nav;
  }

  get initialState() {
    return this._initialState;
  }
}

export { AppDefinition };
