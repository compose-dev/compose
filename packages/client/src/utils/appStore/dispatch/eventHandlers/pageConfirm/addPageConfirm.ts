import { APP_RUNNER_EVENT_TYPE } from "../../types/eventType";
import { AppRunnerBaseEvent } from "../../types";
import { UI } from "@composehq/ts-public";

import { type AppStore } from "../../../types";

interface AddPageConfirmEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.ADD_PAGE_CONFIRM;
  properties: {
    pageConfirm: UI.ComponentGenerators.PageConfirm;
  };
}

function addPageConfirm(event: AddPageConfirmEvent): Partial<AppStore> {
  const frontendComponent = {
    ...event.properties.pageConfirm,
    output: null,
  };

  return {
    pageConfirm: frontendComponent,
  };
}

export { addPageConfirm, type AddPageConfirmEvent };
