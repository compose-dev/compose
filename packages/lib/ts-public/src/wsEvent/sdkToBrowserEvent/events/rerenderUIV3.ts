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
}
