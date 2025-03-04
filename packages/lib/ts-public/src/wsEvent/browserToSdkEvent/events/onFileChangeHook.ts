import * as UI from "../../../ui";
import { TYPE } from "../eventType";

type WithInputFileChangeInteraction = Extract<
  UI.Components.All,
  {
    type: UI.InputComponentTypes.FileChangeType;
  }
>;

export interface Data {
  type: typeof TYPE.ON_FILE_CHANGE_HOOK;
  componentId: string;
  renderId: string;
  executionId: string;
  value: WithInputFileChangeInteraction["output"]["networkTransferValue"];
}
