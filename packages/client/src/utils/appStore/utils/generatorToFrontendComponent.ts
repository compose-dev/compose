import { UI, u as uPub } from "@composehq/ts-public";
import {
  getComponentLocalErrorMessage,
  initialInputInteractionOutput,
} from "../dispatch/eventHandlers/.utils";
import { ComponentMetadata } from "./getComponentMetadata";
import {
  type FrontendComponentModel,
  type FrontendComponentOutput,
} from "../types";

/**
 * The SDK accepts both dict type options and primitive type options (e.g.
 * an array of strings). This function formats the options to the dict type
 * that our UI components accept.
 * @param options The options to format
 * @returns The formatted options
 */
function formatSelectOptions(
  options: UI.SelectOption.List
): UI.SelectOption.AsDict[] {
  if (options.length === 0) {
    return [];
  }

  return options.map((option) => {
    if (
      typeof option === "string" ||
      typeof option === "number" ||
      typeof option === "boolean"
    ) {
      return {
        label: option.toString(),
        value: option,
      };
    } else {
      return option;
    }
  });
}

function guessLabel(id: string, label: string | null): string {
  if (label) {
    return label;
  }

  return uPub.string.prettifyKey(id, false);
}

function generatorToFrontendModel(
  component: UI.ComponentGenerators.All,
  metadata: ComponentMetadata
): FrontendComponentModel.All {
  switch (component.type) {
    case UI.TYPE.INPUT_TEXT:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          label: guessLabel(component.model.id, component.model.label),
        },
      };
    case UI.TYPE.INPUT_EMAIL:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          label: guessLabel(component.model.id, component.model.label),
        },
      };
    case UI.TYPE.INPUT_URL:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          label: guessLabel(component.model.id, component.model.label),
        },
      };
    case UI.TYPE.INPUT_NUMBER:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          label: guessLabel(component.model.id, component.model.label),
        },
      };
    case UI.TYPE.INPUT_PASSWORD:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          label: guessLabel(component.model.id, component.model.label),
        },
      };
    case UI.TYPE.INPUT_CHECKBOX:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          label: guessLabel(component.model.id, component.model.label),
        },
      };
    case UI.TYPE.INPUT_DATE:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          label: guessLabel(component.model.id, component.model.label),
        },
      };
    case UI.TYPE.INPUT_TIME:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          label: guessLabel(component.model.id, component.model.label),
        },
      };
    case UI.TYPE.INPUT_DATE_TIME:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          label: guessLabel(component.model.id, component.model.label),
        },
      };
    case UI.TYPE.INPUT_FILE_DROP:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          label: guessLabel(component.model.id, component.model.label),
        },
      };
    case UI.TYPE.INPUT_TEXT_AREA:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          label: guessLabel(component.model.id, component.model.label),
        },
      };
    case UI.TYPE.INPUT_JSON:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          label: guessLabel(component.model.id, component.model.label),
        },
      };
    case UI.TYPE.INPUT_SELECT_DROPDOWN_MULTI:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          label: guessLabel(component.model.id, component.model.label),
          properties: {
            ...component.model.properties,
            options: formatSelectOptions(component.model.properties.options),
          },
        },
      };
    case UI.TYPE.INPUT_SELECT_DROPDOWN_SINGLE:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          label: guessLabel(component.model.id, component.model.label),
          properties: {
            ...component.model.properties,
            options: formatSelectOptions(component.model.properties.options),
          },
        },
      };
    case UI.TYPE.INPUT_RADIO_GROUP:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          label: guessLabel(component.model.id, component.model.label),
          properties: {
            ...component.model.properties,
            options: formatSelectOptions(component.model.properties.options),
          },
        },
      };
    case UI.TYPE.BUTTON_DEFAULT:
    case UI.TYPE.BUTTON_FORM_SUBMIT:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
        model: {
          ...component.model,
          properties: {
            ...component.model.properties,
            label: guessLabel(
              component.model.id,
              component.model.properties.label
            ),
          },
        },
      };
    default:
      return {
        ...component,
        formId: metadata[component.model.id].formId,
      };
  }
}

function generatorToFrontendOutput(
  component: UI.ComponentGenerators.All
): FrontendComponentOutput.All {
  if (component.type === UI.TYPE.LAYOUT_FORM) {
    return {
      type: component.type,
      interactionType: component.interactionType,
      output: null,
      validation: {
        remoteErrorMessage: null,
      },
      id: component.model.id,
    };
  }

  if (component.interactionType === UI.INTERACTION_TYPE.INPUT) {
    if (component.type === UI.TYPE.INPUT_TABLE) {
      const output = initialInputInteractionOutput.table(
        component.model.properties.data,
        component.model.properties.initialSelectedRows,
        component.model.properties.v
      );

      return {
        type: component.type,
        interactionType: component.interactionType,
        output,
        validation: {
          localErrorMessage: getComponentLocalErrorMessage(
            component,
            output.internalValue
          ),
          remoteErrorMessage: null,
          showLocalErrorIfExists: false,
        },
        id: component.model.id,
      };
    } else if (component.type === UI.TYPE.INPUT_DATE) {
      const output = initialInputInteractionOutput.date(
        component.model.properties.initialValue
      );

      return {
        type: component.type,
        interactionType: component.interactionType,
        output,
        validation: {
          localErrorMessage: getComponentLocalErrorMessage(
            component,
            output.internalValue
          ),
          remoteErrorMessage: null,
          showLocalErrorIfExists: false,
        },
        id: component.model.id,
      };
    } else if (component.type === UI.TYPE.INPUT_DATE_TIME) {
      const output = initialInputInteractionOutput.dateTime(
        component.model.properties.initialValue
      );

      return {
        type: component.type,
        interactionType: component.interactionType,
        output,
        validation: {
          localErrorMessage: getComponentLocalErrorMessage(
            component,
            output.internalValue
          ),
          remoteErrorMessage: null,
          showLocalErrorIfExists: false,
        },
        id: component.model.id,
      };
    } else if (component.type === UI.TYPE.INPUT_TIME) {
      const output = initialInputInteractionOutput.time(
        component.model.properties.initialValue
      );

      return {
        type: component.type,
        interactionType: component.interactionType,
        output,
        validation: {
          localErrorMessage: getComponentLocalErrorMessage(
            component,
            output.internalValue
          ),
          remoteErrorMessage: null,
          showLocalErrorIfExists: false,
        },
        id: component.model.id,
      };
    } else if (component.type === UI.TYPE.INPUT_RADIO_GROUP) {
      const output = initialInputInteractionOutput.nullOutput(
        component.model.properties.initialValue
      );

      const formattedComponent = {
        ...component,
        model: {
          ...component.model,
          properties: {
            ...component.model.properties,
            options: formatSelectOptions(component.model.properties.options),
          },
        },
      };

      return {
        type: component.type,
        interactionType: component.interactionType,
        output,
        validation: {
          localErrorMessage: getComponentLocalErrorMessage(
            formattedComponent,
            output.internalValue
          ),
          remoteErrorMessage: null,
          showLocalErrorIfExists: false,
        },
        id: component.model.id,
      };
    } else if (component.type === UI.TYPE.INPUT_SELECT_DROPDOWN_SINGLE) {
      const output = initialInputInteractionOutput.nullOutput(
        component.model.properties.initialValue
      );

      const formattedComponent = {
        ...component,
        model: {
          ...component.model,
          properties: {
            ...component.model.properties,
            options: formatSelectOptions(component.model.properties.options),
          },
        },
      };

      return {
        type: component.type,
        interactionType: component.interactionType,
        output,
        validation: {
          localErrorMessage: getComponentLocalErrorMessage(
            formattedComponent,
            output.internalValue
          ),
          remoteErrorMessage: null,
          showLocalErrorIfExists: false,
        },
        id: component.model.id,
      };
    } else if (component.type === UI.TYPE.INPUT_SELECT_DROPDOWN_MULTI) {
      const output = initialInputInteractionOutput.selectDropdownMulti(
        component.model.properties.initialValue
      );

      const formattedComponent = {
        ...component,
        model: {
          ...component.model,
          properties: {
            ...component.model.properties,
            options: formatSelectOptions(component.model.properties.options),
          },
        },
      };

      return {
        type: component.type,
        interactionType: component.interactionType,
        output,
        validation: {
          localErrorMessage: getComponentLocalErrorMessage(
            formattedComponent,
            output.internalValue
          ),
          remoteErrorMessage: null,
          showLocalErrorIfExists: false,
        },
        id: component.model.id,
      };
    } else if (component.type === UI.TYPE.INPUT_FILE_DROP) {
      const output = initialInputInteractionOutput.fileDrop();

      return {
        type: component.type,
        interactionType: component.interactionType,
        output,
        validation: {
          localErrorMessage: getComponentLocalErrorMessage(
            component,
            output.internalValue
          ),
          remoteErrorMessage: null,
          showLocalErrorIfExists: false,
        },
        id: component.model.id,
      };
    } else if (component.type === UI.TYPE.INPUT_JSON) {
      const output = initialInputInteractionOutput.json(
        component.model.properties.initialValue
      );

      return {
        type: component.type,
        interactionType: component.interactionType,
        output,
        validation: {
          localErrorMessage: getComponentLocalErrorMessage(
            component,
            output.internalValue
          ),
          remoteErrorMessage: null,
          showLocalErrorIfExists: false,
        },
        id: component.model.id,
      };
    } else {
      const output = initialInputInteractionOutput.nullOutput(
        component.model.properties.initialValue
      );

      return {
        type: component.type,
        interactionType: component.interactionType,
        output,
        validation: {
          localErrorMessage: getComponentLocalErrorMessage(
            component,
            output.internalValue
          ),
          remoteErrorMessage: null,
          showLocalErrorIfExists: false,
        },
        id: component.model.id,
      };
    }
  }

  // @ts-expect-error union type error
  return {
    type: component.type,
    interactionType: component.interactionType,
    output: null,
    id: component.model.id,
  };
}

export { generatorToFrontendModel, generatorToFrontendOutput };
