import { UI } from "@composehq/ts-public";

import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";
import { generatorToFrontendOutput } from "~/utils/appStore/utils";

interface FormSubmissionSuccessEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.FORM_SUBMISSION_SUCCESS;
  properties: {
    formComponentId: string;
    renderId: string;
  };
}

function formSubmissionSuccess(
  state: AppStore,
  event: FormSubmissionSuccessEvent
): Partial<AppStore> {
  if (event.properties.renderId in state.flattenedOutput) {
    const outputsById = {
      ...state.flattenedOutput[event.properties.renderId],
    };

    const formComponent = outputsById[event.properties.formComponentId];
    const formComponentModel =
      state.flattenedModel[event.properties.renderId][
        event.properties.formComponentId
      ];

    if (
      !formComponent ||
      formComponent.type !== UI.TYPE.LAYOUT_FORM ||
      formComponentModel.type !== UI.TYPE.LAYOUT_FORM
    ) {
      return {};
    }

    // Currently, all this event does is clear forms on submission, so if we
    // don't clear the form, we can just return early.
    if (formComponentModel.model.properties.clearOnSubmit === false) {
      return {};
    }

    for (const componentId in outputsById) {
      const componentModel =
        state.flattenedModel[event.properties.renderId][componentId];

      if (componentModel.formId === event.properties.formComponentId) {
        outputsById[componentId] = generatorToFrontendOutput(componentModel);
      }
    }

    return {
      flattenedOutput: {
        ...state.flattenedOutput,
        [event.properties.renderId]: outputsById,
      },
    };
  }

  return {};
}

export { formSubmissionSuccess, type FormSubmissionSuccessEvent };
