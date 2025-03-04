import { AppResponse } from "@composehq/ts-public";

import { PageHandler } from "./pageHandler";
import { ui } from "./ui";

type AppHandlerOptions<TState = Record<string, any>> = {
  page: PageHandler;
  ui: typeof ui;
  state: TState & {
    overwrite: (newState: TState) => void;
    merge: (newPartialState: Partial<TState>) => void;
  };
};

type AppHandler<TState = any> = ({
  page,
  ui,
  state,
}: AppHandlerOptions<TState>) => AppResponse;

export { AppHandler, AppHandlerOptions };
