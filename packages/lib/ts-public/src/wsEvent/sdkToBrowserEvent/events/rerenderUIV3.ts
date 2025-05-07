import { type BaseData, TYPE } from "../eventType";
import * as UI from "../../../ui";

type LayoutInteractionUpdateModel = Omit<
  UI.ComponentGenerators.AllWithLayoutInteraction["model"],
  "id" | "children"
> & {
  children: string[];
};

type NonLayoutInteractionUpdateModel = Omit<
  Exclude<
    UI.ComponentGenerators.All,
    { interactionType: typeof UI.INTERACTION_TYPE.LAYOUT }
  >["model"],
  "id"
>;

type UpdateModel =
  | LayoutInteractionUpdateModel
  | NonLayoutInteractionUpdateModel;

export interface Data extends BaseData {
  type: typeof TYPE.RERENDER_UI_V3;
  diff: Record<
    string,
    {
      delete: string[];
      add: Record<string, UI.ComponentGenerators.All>;
      update: Record<string, UpdateModel>;
      rootId: string;
      metadata: Record<string, { formId: string | null }>;
    }
  >;
  // Added v2 in SDK version 0.27.0. If v2, updating the initial value
  // of an input will override the current value of the property.
  v?: 1 | 2;
}
