import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.FORM_SUBMISSION_SUCCESS_V2;
  renderId: string;
  formComponentId: string;
}
