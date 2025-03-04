import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore, DELETED_RENDER } from "../../../types";

interface CloseModalEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.CLOSE_MODAL;
  properties: {
    renderId: string;
  };
}

function closeModal(
  state: AppStore,
  event: CloseModalEvent
): Partial<AppStore> {
  return {
    renderToRootComponent: {
      ...state.renderToRootComponent,
      [event.properties.renderId]: DELETED_RENDER,
    },
  };
}

export { closeModal, type CloseModalEvent };
