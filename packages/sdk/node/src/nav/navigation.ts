import { v4 as uuid } from "uuid";
import { u } from "@composehq/ts-public";

class Navigation {
  private _configuration: u.navigation.UserProvidedInterface;

  /**
   * Create a navigation pane that links between apps.
   *
   * @example
   * ```ts
   * const nav = new Navigation(
   *   [
   *     "home-page",
   *     "settings",
   *   ],
   *   { logoUrl: "https://composehq.com/dark-logo-with-text.svg" }
   * );
   *
   * const homePage = new App({
   *   route: "home-page",
   *   handler: ({ page, ui }) => page.add(() => ui.text("Home Page"))
   *   navigation: nav, // show nav pane on home page
   * });
   *
   * const settings = new App({
   *   route: "settings",
   *   handler: ({ page, ui }) => page.add(() => ui.text("Settings"))
   *   navigation: nav, // show nav pane on settings page
   * });
   * ```
   *
   * @see {@link https://docs.composehq.com/components/navigation Documentation}
   *
   * @param items - List of app routes to include in the navigation pane
   * @param properties - Optional properties to configure the navigation pane
   * @param properties.logoUrl - URL to a logo image to display in the navigation pane.
   */
  constructor(
    items: u.navigation.UserProvidedInterface["items"],
    properties?: Partial<{
      logoUrl: u.navigation.UserProvidedInterface["logoUrl"];
    }>
  ) {
    this._configuration = {
      id: uuid(),
      items,
      logoUrl: properties?.logoUrl,
    };
  }

  get configuration() {
    return this._configuration;
  }
}

export { Navigation };
