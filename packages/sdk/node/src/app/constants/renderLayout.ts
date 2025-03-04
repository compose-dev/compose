import { UI } from "@composehq/ts-public";

type UIRenderStaticLayout = UI.OutputOmittedComponents.All;

type UIRenderStaticLayoutWithLayoutInteraction = Extract<
  UIRenderStaticLayout,
  { interactionType: typeof UI.INTERACTION_TYPE.LAYOUT }
>;

type UIRenderStaticLayoutWithoutLayoutInteraction = Exclude<
  UIRenderStaticLayout,
  { interactionType: typeof UI.INTERACTION_TYPE.LAYOUT }
>;

type UIRenderStaticLayoutWithLayoutInteractionUpdateModel = Omit<
  UIRenderStaticLayoutWithLayoutInteraction["model"],
  "id" | "children"
> & {
  children: string[];
};

type UIRenderStaticLayoutUpdateModel =
  | UIRenderStaticLayoutWithLayoutInteractionUpdateModel
  | Omit<UIRenderStaticLayoutWithoutLayoutInteraction["model"], "id">;

type UIRenderLayoutModel = UI.OutputOmittedComponents.All;

type UIRenderLayout<TReturnData> =
  | UIRenderLayoutModel
  | (({
      resolve,
    }: {
      resolve: (data?: TReturnData) => void;
    }) =>
      | Promise<UIRenderLayoutModel>
      | UIRenderLayoutModel
      | undefined
      | null);

export type {
  UIRenderStaticLayout,
  UIRenderStaticLayoutUpdateModel,
  UIRenderLayoutModel,
  UIRenderLayout,
};
