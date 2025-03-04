import { UIRenderStaticLayout } from "../../constants";
import { UI } from "@composehq/ts-public";

/**
 * This function edits the layout in place. Even though it returns a new object,
 * be aware that the passed object is mutated!!!
 *
 * idMap is a record of current IDs to replacement IDs. i.e. you replace the
 * current ID with the replacement ID.
 */
function applyIDs(layout: UIRenderStaticLayout, idMap: Record<string, string>) {
  if (layout.model.id in idMap) {
    layout.model.id = idMap[layout.model.id];
  }

  if (layout.interactionType === UI.INTERACTION_TYPE.LAYOUT) {
    if (Array.isArray(layout.model.children)) {
      layout.model.children = layout.model.children.map((child) =>
        applyIDs(child, idMap)
      );
    } else {
      layout.model.children = applyIDs(
        layout.model.children as UIRenderStaticLayout,
        idMap
      );
    }
  }

  return layout;
}

export { applyIDs };
