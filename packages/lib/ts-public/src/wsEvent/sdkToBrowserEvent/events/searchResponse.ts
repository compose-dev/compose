import { type BaseData, TYPE } from "../eventType";
import { SelectOption } from "../../../ui";

export interface Data extends BaseData {
  type: typeof TYPE.SEARCH_RESPONSE;
  renderId: string;
  componentId: string;
  options: SelectOption.List;
}
