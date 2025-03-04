import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.FORM_SUBMISSION_SUCCESS;
  executionId: string;
  renderId: string;
  formComponentId: string;
}
