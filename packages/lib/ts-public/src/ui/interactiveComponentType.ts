import { TYPE, INTERACTION_TYPE } from "./types";
import * as Components from "./components";

function isInteractiveComponent<
  T extends {
    type: Components.All["type"];
    interactionType: Components.All["interactionType"];
  },
>(component: T) {
  return (
    component.interactionType === INTERACTION_TYPE.INPUT ||
    component.interactionType === INTERACTION_TYPE.BUTTON ||
    component.type === TYPE.LAYOUT_FORM
  );
}

export { isInteractiveComponent };
