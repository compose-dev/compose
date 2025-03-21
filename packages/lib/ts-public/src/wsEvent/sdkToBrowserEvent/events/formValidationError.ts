import * as UI from "../../../ui";
import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.FORM_VALIDATION_ERROR;
  executionId: string;
  renderId: string;
  formComponentId: string;
  inputComponentErrors: Record<string, UI.ValidatorErrorResponseType> | null;
  formError: UI.ValidatorErrorResponseType | null;
}
