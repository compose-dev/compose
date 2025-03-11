import { AppResponse } from "@composehq/ts-public";

import { PageHandler } from "./pageHandler";
import { ui } from "./ui";

type AppHandlerOptions = {
  page: PageHandler;
  ui: typeof ui;
  /**
   * @deprecated use `page.update()` to manage state instead.
   */
  state: Record<string, any> & {
    overwrite: (newState: Record<string, any>) => void;
    merge: (newPartialState: Partial<Record<string, any>>) => void;
  };
};

type AppHandler = ({ page, ui, state }: AppHandlerOptions) => AppResponse;

export { AppHandler, AppHandlerOptions };
