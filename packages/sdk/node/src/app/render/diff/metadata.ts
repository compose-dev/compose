import { UIRenderStaticLayout } from "../../constants";
import { UI } from "@composehq/ts-public";

/**
 * Recursively gets the component metadata for a static layout.
 * @returns a record of component IDs to their metadata
 */
function getComponentMetadataRecursive(
  layout: UIRenderStaticLayout,
  parentFormId: string | null
): Record<string, { formId: string | null }> {
  if (layout.interactionType !== UI.INTERACTION_TYPE.LAYOUT) {
    return {
      [layout.model.id]: {
        formId: parentFormId,
      },
    };
  }

  const children = Array.isArray(layout.model.children)
    ? layout.model.children
    : [layout.model.children];

  const newFormId =
    layout.type === UI.TYPE.LAYOUT_FORM ? layout.model.id : parentFormId;

  const childrenMetadata = children.map((child) =>
    getComponentMetadataRecursive(child, newFormId)
  );

  return childrenMetadata.reduce((acc, item) => ({ ...acc, ...item }), {
    [layout.model.id]: {
      formId: newFormId,
    },
  });
}

function getComponentMetadata(
  layout: UIRenderStaticLayout
): Record<string, { formId: string | null }> {
  return getComponentMetadataRecursive(layout, null);
}

export { getComponentMetadata };
