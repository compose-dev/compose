import { FrontendComponentModel } from "./frontendComponentModel";
import { FrontendComponentOutput } from "./frontendComponentOutput";
import { Severity } from "../error";
import { type AppRunnerEvent } from "../dispatch";
import { type FormData } from "../utils";
import { type DeletedRender } from "./deletedRender";
import { Page, UI } from "@composehq/ts-public";

/**
 * An ordered list of render IDs. Used to render the App in order.
 */
type UIRenders = Array<string | null>;

/**
 * A map between a render ID and the key of the root component id for that
 * render. If the value is "DELETED", the render has been deleted (e.g. the
 * modal was closed).
 */
// eslint-disable-next-line @typescript-eslint/ban-types
type RenderToRootComponent = Record<string, DeletedRender | (string & {})>;

/**
 * A flattened copy of the component tree for a render. Used for efficient
 * lookups on UI components.
 *
 * Record<renderId, Record<componentId, component>>
 */
type FlattenedModel = Record<
  string,
  Record<string, FrontendComponentModel.All>
>;

/**
 * A flattened copy of the component tree values for a render. Null for
 * display components, but will have the current value for any inputs.
 *
 * This is split from the FlattenedModel tree to allow for efficient updates
 * without causing rerenders of components that don't need the output values.
 *
 * Record<renderId, Record<componentId, component>>
 */
type FlattenedOutput = Record<
  string,
  Record<string, FrontendComponentOutput.All>
>;

/**
 * An error that occurred while rendering the app. 'error' severity requires
 * an app restart. 'warning' severity does not.
 */
type Error = {
  severity: Severity;
  message: string;
} | null;

/**
 * Store whether a component is in a temporary loading state. Keyed by
 * `renderId.componentId`.
 */
type Stale = Record<string, UI.Stale.Option>;

interface AppStore {
  renders: UIRenders;
  renderToRootComponent: RenderToRootComponent;
  flattenedModel: FlattenedModel;
  flattenedOutput: FlattenedOutput;
  renderToMetadata: Record<
    string,
    {
      appearance: UI.RenderAppearance;
      modalHeader?: string;
      modalWidth?: UI.ModalWidth;
    }
  >;
  error: Error;
  // Typed so that the minimum required keys are defined, rest may be undefined.
  config: Partial<Page.Config> & Page.MinConfig;
  wentOffline: boolean;
  executionId: string | null;
  route: string | null;
  pageConfirm: FrontendComponentModel.PageConfirmInteraction | null;
  dispatch: (event: AppRunnerEvent) => void;
  getFormData: (formId: string, renderId: string) => FormData;
  loading: {
    value: Page.loading.Value;
    properties?: Page.loading.Properties;
  };
  stale: Stale;
}

export { type AppStore };
