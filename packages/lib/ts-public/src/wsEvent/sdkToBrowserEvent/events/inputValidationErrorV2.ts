import * as UI from "../../../ui";
import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.INPUT_VALIDATION_ERROR_V2;
  renderId: string;
  componentId: string;
  error: UI.ValidatorErrorResponseType | null;
}
