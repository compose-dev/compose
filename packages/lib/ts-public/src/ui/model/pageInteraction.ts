import { BaseWithPageInteraction } from "./base";
import { ButtonAppearance, BaseGeneric } from "../types";

export interface Confirm<TId extends BaseGeneric.Id>
  extends BaseWithPageInteraction<TId> {
  properties: {
    hasOnResponseHook: boolean;
    title?: string;
    message?: string;
    typeToConfirmText?: string;
    confirmButtonLabel?: string;
    cancelButtonLabel?: string;
    appearance?: ButtonAppearance.Type;
  };
}
