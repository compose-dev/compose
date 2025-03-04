import * as UI from "../../../ui";
import { TYPE } from "../eventType";

type WithInputEnterInteraction = Extract<
  UI.Components.All,
  {
    type: UI.InputComponentTypes.EnterType;
  }
>;

export interface Data {
  type: typeof TYPE.ON_ENTER_HOOK;
  componentId: string;
  renderId: string;
  executionId: string;
  value: WithInputEnterInteraction["output"]["networkTransferValue"];
}
