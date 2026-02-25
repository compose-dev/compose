import { type BaseData, TYPE } from "../eventType";
import * as UI from "../../../ui";

export interface Data extends BaseData {
  type: typeof TYPE.ON_TEXT_CHANGE_SUGGESTIONS;
  componentId: string;
  renderId: string;
  suggestions: UI.SelectOption.List;
}
