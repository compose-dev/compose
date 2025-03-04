import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { FrontendComponentModel, type AppStore } from "../../../types";
import { generatorToFrontendOutput } from "../../../utils";
import { UI } from "@composehq/ts-public";

interface SetInputsEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.SET_INPUTS;
  properties: {
    inputs: Record<string, unknown>;
  };
}

function setInputs(state: AppStore, event: SetInputsEvent): Partial<AppStore> {
  const outputsById = {
    ...state.flattenedOutput,
  };

  for (const renderId in outputsById) {
    outputsById[renderId] = {
      ...outputsById[renderId],
    };
  }

  for (const inputId in event.properties.inputs) {
    for (const renderId in state.flattenedModel) {
      if (inputId in state.flattenedModel[renderId] === false) {
        continue;
      }

      const componentModel = state.flattenedModel[renderId][inputId];

      if (componentModel.interactionType !== UI.INTERACTION_TYPE.INPUT) {
        continue;
      }

      // Essentially we just create a copy with a new initial value (without
      // editing the OG model), then we pass that to the generator to get
      // the new output.
      const withNewValue: FrontendComponentModel.All = {
        ...componentModel,
        model: {
          ...componentModel.model,
          properties: {
            ...componentModel.model.properties,
            initialValue: event.properties.inputs[inputId],
            // @ts-expect-error - TODO: Fix this. It doesn't actually matter
            // that we pass both value and selected rows. The generator
            // will only use the relevant field based on the component type.
            initialSelectedRows: event.properties.inputs[inputId],
          },
        },
      };

      outputsById[renderId][inputId] = generatorToFrontendOutput(withNewValue);
    }
  }

  return {
    flattenedOutput: outputsById,
  };
}

export { setInputs, type SetInputsEvent };
