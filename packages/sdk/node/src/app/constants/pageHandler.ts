import { Generator, Page, UI } from "@composehq/ts-public";

import { UIRenderLayout } from "./renderLayout";

type pageConfirmOptions = Parameters<typeof Generator.page.confirm>[2];

interface PageHandler {
  /**
   * Render UI to the page.
   */
  add: <TReturnData = any>(
    layout: UIRenderLayout<TReturnData>,
    options?: Partial<{
      key: string;
    }>
  ) => Promise<TReturnData>;
  /**
   * Render UI within a modal to the page.
   */
  modal: <TReturnData = any>(
    layout: UIRenderLayout<TReturnData>,
    options?: Partial<{
      title: string;
      width: UI.ModalWidth;
      key: string;
    }>
  ) => Promise<TReturnData>;
  /**
   * Edit the default page configuration.
   *
   * See {@link Page.Config} for more information.
   */
  set: (config: Partial<Page.Config>) => void;
  /**
   * Download a file to the user's machine.
   */
  download: (file: Buffer, filename: string) => void;
  /**
   * Open a link in the user's browser. Link between Compose
   * apps by passing the `route` for another Compose app, or
   * open an external URL.
   */
  link: (
    appRouteOrUrl: string,
    options?: Partial<{
      newTab: boolean;
      params: Page.Params;
    }>
  ) => void;
  /**
   * Log information to audit logs. Only available on Pro plans.
   *
   * Compose automatically enriches each log entry with the triggering user's
   * ID and email, and the app route where the log originated.
   *
   * @example
   * ```ts
   * page.log("Deleted database record", { severity: "info", data: { recordId: 123 } });
   * ```
   *
   * @param event The event to log. Max length is 1024 characters.
   * @param options Optional properties for the log message.
   * @param options.severity The severity of the log message. Defaults to "info".
   * @param options.data Additional metadata to log. Should be a JSON serializable object. Max size is 4 kilobytes.
   */
  log: (
    event: string,
    options?: Partial<{
      severity: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
      data: Record<string, any>;
    }>
  ) => void;
  /**
   * Get the current page parameters. Empty by default. You can pass
   * parameters between pages when using page.link() to create multipage
   * apps.
   */
  params: Page.Params;
  /**
   * Reload the page. Re-runs the handler function.
   */
  reload: () => void;
  /**
   * Open a confirmation dialog to the user.
   */
  confirm: (options?: pageConfirmOptions) => Promise<boolean>;
  /**
   * Show a temporary toast message to the user.
   */
  toast: (
    message: Page.toast.Base["message"],
    options?: Omit<Page.toast.Base, "message">
  ) => void;
  /**
   * @deprecated Simply update the initial value of the input component then call `page.update()` instead.
   * Manually set the value of input components. Use this to create
   * controlled components and dynamically update the value of inputs
   * in response to events on the server.
   */
  setInputs: (idsToValue: Record<string, any>) => void;
  /**
   * Show a loading indicator to the user.
   *
   * @example
   * ```ts
   * // Start loading indicator
   * page.loading(true, { text: "Loading..." });
   *
   * // Some expensive operation
   *
   * // Stop loading indicator
   * page.loading(false);
   * ```
   */
  loading: (
    value: Page.loading.Value,
    properties?: Page.loading.Properties
  ) => void;
  /**
   * Rerender the UI to reflect the latest data.
   *
   * @important All updates to data should be done immutably. For example, instead of mutating a single field in a table row, you should create a copy of the table data, mutate the copy, and reassign the original table data to the copy. Compose detects UI changes by comparing cached UI components with the latest version. Immutable updates ensure that updated data doesn't also update the cached UI component.
   */
  update: () => void;
}

export type { PageHandler };
