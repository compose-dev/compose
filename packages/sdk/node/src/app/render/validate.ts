import { UIRenderStaticLayout } from "../constants";
import { UI } from "@composehq/ts-public";

const MAX_DEPTH = 100;

/**
 * Internal recursive function for validating a static layout. Checks:
 * - That the component ID is a string
 * - That all components have unique IDs
 * - That onEnter hooks are not used for inputs inside forms
 * - That a form is not inside another form
 * - That the component tree does not exceed a depth of 100 (to prevent stack overflow)
 */
function validateStaticLayoutRecursive(
  layout: UIRenderStaticLayout,
  parentFormId: string | null,
  depth: number
): string | Record<string, boolean> {
  if (typeof layout.model.id !== "string") {
    return `Component IDs must be a string. Received: ${typeof layout.model.id}`;
  }

  if (parentFormId && layout.type === UI.TYPE.LAYOUT_FORM) {
    return `Cannot render a form inside another form`;
  }

  if (
    parentFormId &&
    layout.interactionType === UI.INTERACTION_TYPE.INPUT &&
    UI.InputComponentTypes.isEnterType(layout) &&
    layout.model.properties.hasOnEnterHook
  ) {
    return `Invalid input: ${layout.model.id}.\n\nInputs inside forms cannot have onEnter hooks since pressing enter will submit the form.\n\nPlace the input outside the form to use the onEnter hook.`;
  }

  if (depth > MAX_DEPTH) {
    return `Maximum component tree depth of ${MAX_DEPTH} exceeded.`;
  }

  let ids: Record<string, boolean> = {
    [layout.model.id]: true,
  };

  if (layout.interactionType !== UI.INTERACTION_TYPE.LAYOUT) {
    return ids;
  }

  const children = Array.isArray(layout.model.children)
    ? layout.model.children
    : [layout.model.children];

  const newFormId =
    layout.type === UI.TYPE.LAYOUT_FORM ? layout.model.id : parentFormId;

  for (let i = 0; i < children.length; i += 1) {
    const childIds = validateStaticLayoutRecursive(
      children[i],
      newFormId,
      depth + 1
    );

    // If there's an error, pass it up the chain.
    if (typeof childIds === "string") {
      return childIds;
    }

    const childIdsLength = Object.keys(childIds).length;
    const oldIdsLength = Object.keys(ids).length;

    const mergedIds = { ...ids, ...childIds };

    if (Object.keys(mergedIds).length !== oldIdsLength + childIdsLength) {
      const duplicateId = Object.keys(childIds).find((id) => id in ids);
      return `Duplicate component ID found: '${duplicateId || "<Unknown ID>"}'. All component IDs must be unique.`;
    }

    ids = mergedIds;
  }

  return ids;
}

/**
 * Validates static layouts. See the recursive function for more details.
 * @returns an error string
 */
function validateStaticLayout(layout: UIRenderStaticLayout): string | null {
  const result = validateStaticLayoutRecursive(layout, null, 0);

  if (typeof result === "string") {
    return result;
  }

  return null;
}

export { validateStaticLayout };
