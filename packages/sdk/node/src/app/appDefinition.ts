import { u as uPub } from "@composehq/ts-public";
import { AppHandler } from "./constants";

interface RequiredAppOptions<TState> {
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
  route: string;
  /**
   * The handler function for the app.
   */
  handler: AppHandler<TState>;
}

interface OptionalAppOptions<TState> {
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
   * @deprecated Use `page.update()` instead. See {@link https://docs.composehq.com/page-actions/update documentation}
   * The initial state of the app.
   */
  initialState: TState;
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
}

type AppOptions<TState> = RequiredAppOptions<TState> &
  Partial<OptionalAppOptions<TState>>;

class AppDefinition<TState = Record<string, any>> {
  private _route: RequiredAppOptions<TState>["route"];
  handler: RequiredAppOptions<TState>["handler"];

  private description: OptionalAppOptions<TState>["description"];
  private hidden: OptionalAppOptions<TState>["hidden"];
  private name: NonNullable<OptionalAppOptions<TState>["name"]>;
  private _parentAppRoute?: OptionalAppOptions<TState>["parentAppRoute"];

  private _initialState: TState;

  /**
   * Create a new Compose app.
   *
   * See the {@link AppOptions} interface for more information.
   */
  constructor(options: AppOptions<TState>) {
    if (!options.route) {
      throw new Error(
        "Route argument is required when creating a new Compose app."
      );
    }

    this._route = uPub.appRoute.format(options.route);

    try {
      uPub.appRoute.isValid(this._route);
    } catch (error) {
      throw new Error(
        "Invalid route: " + this._route + ". " + (error as Error).message
      );
    }

    this.name = options.name || uPub.string.prettifyKey(this._route);
    this.handler = options.handler;

    this.description = options.description ?? null;
    this.hidden = options.hidden;
    this._parentAppRoute = options.parentAppRoute
      ? uPub.appRoute.format(options.parentAppRoute)
      : undefined;

    this._initialState = options.initialState ?? ({} as TState);

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
    };
  }

  get initialState() {
    return this._initialState;
  }
}

export { AppDefinition };
