import { type BaseData, TYPE } from "../eventType";
import * as UI from "../../../ui";

export interface Data extends BaseData {
  type: typeof TYPE.CONFIRM_V2;
  component: UI.ComponentGenerators.PageConfirm;
}
