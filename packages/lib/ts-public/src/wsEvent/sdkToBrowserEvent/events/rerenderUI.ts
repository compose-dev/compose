import { type BaseData, TYPE } from "../eventType";
import * as UI from "../../../ui";

export interface Data extends BaseData {
  type: typeof TYPE.RERENDER_UI;
  executionId: string;
  diff: Record<string, UI.ComponentGenerators.All>;
}
