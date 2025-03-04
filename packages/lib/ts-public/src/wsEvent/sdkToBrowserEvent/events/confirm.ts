import { type BaseData, TYPE } from "../eventType";
import * as UI from "../../../ui";

export interface Data extends BaseData {
  type: typeof TYPE.CONFIRM;
  executionId: string;
  component: UI.ComponentGenerators.PageConfirm;
}
