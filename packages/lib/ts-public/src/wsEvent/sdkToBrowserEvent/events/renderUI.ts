import { type BaseData, TYPE } from "../eventType";
import * as UI from "../../../ui";

export interface Data extends BaseData {
  type: typeof TYPE.RENDER_UI;
  executionId: string;
  renderId: string;
  ui: UI.ComponentGenerators.All;
  idx?: number;
  appearance?: UI.RenderAppearance;
  modalHeader?: string;
  modalWidth?: UI.ModalWidth;
}
