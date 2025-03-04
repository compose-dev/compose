import { UI } from "@composehq/ts-public";

export type WithInputInteraction =
  UI.OutputOnlyComponents.AllWithInputInteraction & {
    validation: {
      localErrorMessage: string | null;
      remoteErrorMessage: string | null;
      showLocalErrorIfExists: boolean;
    };
    id: string;
  };

export type WithDisplayInteraction =
  UI.OutputOnlyComponents.AllWithDisplayInteraction & {
    id: string;
  };

export type WithButtonInteraction =
  UI.OutputOnlyComponents.AllWithButtonInteraction & {
    id: string;
  };

export type WithLayoutInteractionExcludingForm = Exclude<
  UI.OutputOnlyComponents.AllWithLayoutInteraction,
  { type: typeof UI.TYPE.LAYOUT_FORM }
> & {
  id: string;
};

export type WithLayoutFormInteraction = UI.OutputOnlyComponents.LayoutForm & {
  validation: {
    remoteErrorMessage: string | null;
  };
  id: string;
};

export type All =
  | WithInputInteraction
  | WithDisplayInteraction
  | WithButtonInteraction
  | WithLayoutInteractionExcludingForm
  | WithLayoutFormInteraction;
