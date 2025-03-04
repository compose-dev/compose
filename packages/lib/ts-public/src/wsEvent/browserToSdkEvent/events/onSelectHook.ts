import * as UI from "../../../ui";
import { TYPE } from "../eventType";

type WithInputSelectInteraction = Extract<
  UI.Components.All,
  {
    type: UI.InputComponentTypes.SelectType;
  }
>;

export interface Data {
  type: typeof TYPE.ON_SELECT_HOOK;
  componentId: string;
  renderId: string;
  executionId: string;
  value: WithInputSelectInteraction["output"]["networkTransferValue"];
}
