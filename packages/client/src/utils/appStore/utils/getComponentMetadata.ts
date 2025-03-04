import { UI } from "@composehq/ts-public";
import { AppError } from "../error";

type ComponentMetadata = Record<string, { formId: string | null }>;

function getComponentMetadata(
  componentId: string,
  formId: string | null,
  flattened: Record<string, UI.ComponentGenerators.All>
): ComponentMetadata | string {
  const component = flattened[componentId];

  if (component.interactionType !== UI.INTERACTION_TYPE.LAYOUT) {
    return {
      [componentId]: {
        formId,
      },
    };
  }

  if (formId && component.type === UI.TYPE.LAYOUT_FORM) {
    throw new AppError("error", "Cannot render a form inside another form");
  }

  // If the component is a form, we want to use the componentId as the formId
  // Else, just continue using the inherited formId
  const newFormId =
    component.type === UI.TYPE.LAYOUT_FORM ? componentId : formId;

  const children = Array.isArray(component.model.children)
    ? component.model.children
    : [component.model.children];

  const mapped = children.map((child) =>
    getComponentMetadata(child.model.id, newFormId, flattened)
  );

  // If a child errored, pass the error up the chain
  for (const child of mapped) {
    if (typeof child === "string") {
      return child;
    }
  }

  return mapped.reduce(
    (acc, item) => {
      if (typeof item === "string" || typeof acc === "string") {
        return acc;
      }

      return {
        ...acc,
        ...item,
      };
    },
    {
      [componentId]: {
        formId: newFormId,
      },
    }
  );
}

export { getComponentMetadata, type ComponentMetadata };
