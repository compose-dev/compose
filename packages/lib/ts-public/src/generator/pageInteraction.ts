import * as UI from "../ui";
import { BaseWithPageInteraction } from "./base";

interface PageConfirmProperties extends BaseWithPageInteraction {
  onResponse: UI.Components.PageConfirm["hooks"]["onResponse"];
  title?: UI.Components.PageConfirm["model"]["properties"]["title"];
  message?: UI.Components.PageConfirm["model"]["properties"]["message"];
  typeToConfirmText?: UI.Components.PageConfirm["model"]["properties"]["typeToConfirmText"];
  confirmButtonLabel?: UI.Components.PageConfirm["model"]["properties"]["confirmButtonLabel"];
  cancelButtonLabel?: UI.Components.PageConfirm["model"]["properties"]["cancelButtonLabel"];
  appearance?: UI.Components.PageConfirm["model"]["properties"]["appearance"];
}

type RequiredPageConfirmFields = "id" | "onResponse";
type OptionalPageConfirmProperties = Omit<
  PageConfirmProperties,
  RequiredPageConfirmFields
>;

// We currently pull the "properties" field to type the "page.confirm" function.
// Be careful when editing the input fields for this function.
function pageConfirm(
  id: PageConfirmProperties["id"],
  onResponse: PageConfirmProperties["onResponse"],
  properties: OptionalPageConfirmProperties = {}
): UI.OutputOmittedComponents.PageConfirm {
  const modelProperties: UI.Components.PageConfirm["model"]["properties"] = {
    ...{
      title: properties.title,
      message: properties.message,
      typeToConfirmText: properties.typeToConfirmText,
      confirmButtonLabel: properties.confirmButtonLabel,
      cancelButtonLabel: properties.cancelButtonLabel,
      appearance: properties.appearance,
    },
    hasOnResponseHook: onResponse !== undefined,
  };

  return {
    model: {
      id,
      properties: modelProperties,
    },
    hooks: {
      onResponse,
    },
    type: UI.TYPE.PAGE_CONFIRM,
    interactionType: UI.INTERACTION_TYPE.PAGE,
  };
}

const pageGenerator = {
  confirm: pageConfirm,
};

export { pageGenerator };
