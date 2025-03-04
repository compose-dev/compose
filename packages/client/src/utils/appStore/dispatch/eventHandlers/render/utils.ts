import { UI } from "@composehq/ts-public";
import { FrontendComponentModel } from "~/utils/appStore/types";

function shouldResetOutput(
  oldModel: FrontendComponentModel.All,
  newModel: UI.ComponentGenerators.All
) {
  // Irrelevant for non-input components
  if (oldModel.interactionType !== UI.INTERACTION_TYPE.INPUT) {
    return false;
  }

  // File drop inputs are never reset since they don't support initial values
  if (oldModel.type === UI.TYPE.INPUT_FILE_DROP) {
    return false;
  }

  // For tables, just reset the value no matter what. It's too
  // complicated to try to match up old selections with new data.
  if (oldModel.type === UI.TYPE.INPUT_TABLE) {
    return true;
  }

  const oldValue = oldModel.model.properties.initialValue;
  // @ts-expect-error don't want to deal with typescript here
  const newValue = newModel.model.properties.initialValue;

  // Stringify is a good catch all way for checking if two values
  // have changed (e.g. comparing initial values for multiselect).
  // Putting it in a try/catch to avoid cases where the user passes
  // in wack data that can't be stringified.
  try {
    return JSON.stringify(oldValue) !== JSON.stringify(newValue);
  } catch (e) {
    return false;
  }
}

export { shouldResetOutput };
