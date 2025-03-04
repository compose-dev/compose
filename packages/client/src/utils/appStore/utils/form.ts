import { UI } from "@composehq/ts-public";
import {
  type AppStore,
  type FrontendComponentModel,
  type FrontendComponentOutput,
} from "../types";

interface FormDataBase {
  components: {
    model: FrontendComponentModel.WithInputInteraction;
    output: FrontendComponentOutput.WithInputInteraction;
  }[];
  hasLocalErrors: boolean;
  networkTransferValuesById: Record<
    string,
    UI.Components.AllWithInputInteraction["output"]["networkTransferValue"]
  > | null;
}

interface FormDataSuccess extends FormDataBase {
  hasLocalErrors: false;
  networkTransferValuesById: Record<
    string,
    UI.Components.AllWithInputInteraction["output"]["networkTransferValue"]
  >;
}

interface FormDataError extends FormDataBase {
  hasLocalErrors: true;
  networkTransferValuesById: null;
}

type FormData = FormDataSuccess | FormDataError;

function getFormData(
  formId: string,
  renderId: string,
  appStore: AppStore
): FormData {
  const models = appStore.flattenedModel[renderId];
  const outputs = appStore.flattenedOutput[renderId];

  const formComponents: FormDataBase["components"] = [];
  let hasLocalErrors = false;
  const networkTransferValuesById: FormDataSuccess["networkTransferValuesById"] =
    {};

  for (const id in models) {
    if (models[id].formId !== formId) {
      continue;
    }

    if (
      models[id].interactionType !== UI.INTERACTION_TYPE.INPUT ||
      outputs[id].interactionType !== UI.INTERACTION_TYPE.INPUT
    ) {
      continue;
    }

    formComponents.push({
      model: models[id],
      output: outputs[id],
    });

    networkTransferValuesById[id] = outputs[id].output.networkTransferValue;

    if (outputs[id].validation.localErrorMessage !== null) {
      hasLocalErrors = true;
    }
  }

  if (hasLocalErrors) {
    return {
      components: formComponents,
      hasLocalErrors: true,
      networkTransferValuesById: null,
    };
  }

  return {
    components: formComponents,
    hasLocalErrors: false,
    networkTransferValuesById: networkTransferValuesById,
  };
}

export { getFormData, type FormData };
