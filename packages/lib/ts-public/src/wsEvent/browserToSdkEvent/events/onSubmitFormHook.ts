import { TYPE } from "../eventType";

export interface Data {
  type: typeof TYPE.ON_SUBMIT_FORM_HOOK;
  formComponentId: string;
  renderId: string;
  executionId: string;
  formData: Record<string, any>;
}
