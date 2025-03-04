import { UIRenderStaticLayout } from "../../constants";
import { UI, compress } from "@composehq/ts-public";
import { UIRenderStaticLayoutUpdateModel } from "../../constants/renderLayout";

import { getComponentMetadata } from "./metadata";
import { applyIDs } from "./applyIDs";

function interactiveComponentIDChanged(
  oldComponent: UI.ComponentGenerators.All,
  newComponent: UI.ComponentGenerators.All
) {
  if (UI.isInteractiveComponent(oldComponent)) {
    return oldComponent.model.id !== newComponent.model.id;
  }

  return false;
}

function diffStaticLayoutsRecursive(
  oldLayout: UIRenderStaticLayout,
  newLayout: UIRenderStaticLayout
): {
  delete: string[];
  add: Record<string, UIRenderStaticLayout>;
  update: Record<string, UIRenderStaticLayoutUpdateModel>;
  idMap: Record<string, string>;
} {
  /**
   * Option 1: The component has changed entirely. In this case,
   * delete the old component and add the new component.
   *
   * This option is applied if either of the following conditions is
   * true:
   *
   * a. The component type has changed.
   *
   * b. The component is an interactive component and its ID has
   * changed. Exception: form submit buttons. The IDs for these
   * don't matter since there's no server side hooks for them,
   * hence we can essentially treat them like display components.
   */
  if (
    oldLayout.type !== newLayout.type ||
    (interactiveComponentIDChanged(oldLayout, newLayout) &&
      oldLayout.type !== UI.TYPE.BUTTON_FORM_SUBMIT)
  ) {
    const compressed = compress.uiTree(newLayout);

    return {
      delete: [oldLayout.model.id],
      add: { [newLayout.model.id]: compressed },
      update: {},
      idMap: {},
    };
  }

  // Option 2: The components are the same and not layout types, meaning
  // they are "leaf" components without children. In this case, we'll
  // stringify the models and compare to see if they're different.
  //
  // Technically, we only need to check one of the layouts, but we
  // check both to satisfy typescript.
  if (
    oldLayout.interactionType !== UI.INTERACTION_TYPE.LAYOUT ||
    newLayout.interactionType !== UI.INTERACTION_TYPE.LAYOUT
  ) {
    // For non-input components, ids are regenerated on every render,
    // so we need to ignore them when comparing.
    const { id: oldId, ...oldModelWithoutId } = oldLayout.model;
    const { id: newId, ...newModelWithoutId } = newLayout.model;
    const oldModelString = JSON.stringify(oldModelWithoutId);
    const newModelString = JSON.stringify(newModelWithoutId);

    if (oldModelString !== newModelString) {
      const compressed = compress.uiTree(newLayout);

      const { id, ...rest } = compressed.model;

      return {
        delete: [],
        add: {},
        update: { [oldLayout.model.id]: rest },
        idMap: { [newLayout.model.id]: oldLayout.model.id },
      };
    } else {
      return {
        delete: [],
        add: {},
        update: {},
        idMap: { [newLayout.model.id]: oldLayout.model.id },
      };
    }
  }

  // Option 3: The components are the same and are layout types, meaning
  // they have children. In this case, we need to compare both the
  // children and the models.
  let updateObj: Record<string, UIRenderStaticLayoutUpdateModel> = {};
  let addObj: Record<string, UIRenderStaticLayout> = {};
  let deleteArr: string[] = [];

  // We'll start by iterating through the children.
  const oldChildren = Array.isArray(oldLayout.model.children)
    ? oldLayout.model.children
    : [oldLayout.model.children];

  const newChildren = Array.isArray(newLayout.model.children)
    ? newLayout.model.children
    : [newLayout.model.children];

  // We'll iterate over the children with the longest length to ensure
  // we catch all the children.
  const iteratorCount = Math.max(oldChildren.length, newChildren.length);

  // Need to keep track of the new list of child IDs to attach to the
  // layout component.
  const childIds = [];

  let idMap: Record<string, string> = {};

  for (let i = 0; i < iteratorCount; i += 1) {
    const oldChild = i < oldChildren.length ? oldChildren[i] : null;
    const newChild = i < newChildren.length ? newChildren[i] : null;

    // If both children exist, we'll compare them recursively.
    if (oldChild !== null && newChild !== null) {
      const childDiff = diffStaticLayoutsRecursive(oldChild, newChild);

      if (newChild.model.id in childDiff.add) {
        childIds.push(newChild.model.id);
      } else {
        childIds.push(oldChild.model.id);
      }

      updateObj = { ...updateObj, ...childDiff.update };
      addObj = { ...addObj, ...childDiff.add };
      deleteArr = [...deleteArr, ...childDiff.delete];
      idMap = { ...idMap, ...childDiff.idMap };
    }

    // If the old child doesn't exist but the new child does, we'll add the new child.
    if (oldChild === null && newChild !== null) {
      childIds.push(newChild.model.id);
      addObj[newChild.model.id] = newChild;
    }

    // If the old child exists but the new child doesn't, we'll delete the old child.
    if (oldChild !== null && newChild === null) {
      deleteArr.push(oldChild.model.id);
    }
  }

  // Next, we'll compare the models of the layouts themselves.
  const childrenDidChange =
    childIds.length !== oldChildren.length ||
    childIds.some((id, idx) => oldChildren[idx].model.id !== id);

  // We'll start by comparing the models.
  const {
    id: oldId,
    children: oldModelChildren,
    ...oldModelWithoutIdAndChildren
  } = oldLayout.model;
  const {
    id: newId,
    children: newModelChildren,
    ...newModelWithoutIdAndChildren
  } = newLayout.model;
  const oldModelString = JSON.stringify(oldModelWithoutIdAndChildren);
  const newModelString = JSON.stringify(newModelWithoutIdAndChildren);

  if (oldModelString !== newModelString || childrenDidChange) {
    // We don't need to compress nested components since we already
    // recurse elsewhere in the diffing algorithm. This compression
    // is only needed for the root layout.
    const compressed = compress.uiTreeWithoutRecursion(newLayout);

    // If the models are different, we'll add the new model to the "update"
    const { id, children, ...rest } = compressed.model;
    updateObj[oldLayout.model.id] = { ...rest, children: childIds };
  }

  idMap = { ...idMap, [newLayout.model.id]: oldLayout.model.id };

  return { delete: deleteArr, add: addObj, update: updateObj, idMap };
}

/**
 * Diff two static layouts.
 *
 * Note: The deleted IDs covers the branches of the layout that have been
 * deleted, but does not exhaustively list all the IDs that need to be deleted.
 * For example, if an entire stack is deleted, then only the root stack ID is
 * included in the `delete` array. It is up to the client to delete any
 * stranded leaf nodes as a result of a deleted branch.
 *
 * @param oldLayout - The old static layout.
 * @param newLayout - The new static layout.
 * @returns The diff between the two layouts.
 */
function diffStaticLayouts(
  oldLayout: UIRenderStaticLayout,
  newLayout: UIRenderStaticLayout
): {
  delete: string[];
  add: Record<string, UIRenderStaticLayout>;
  update: Record<string, UIRenderStaticLayoutUpdateModel>;
  metadata: Record<string, { formId: string | null }>;
  rootId: string;
  newLayoutWithIDsApplied: UIRenderStaticLayout;
  didChange: boolean;
} {
  const diff = diffStaticLayoutsRecursive(oldLayout, newLayout);

  const newLayoutWithIDsApplied = applyIDs(newLayout, diff.idMap);
  const rootId = newLayoutWithIDsApplied.model.id;

  const metadata = getComponentMetadata(newLayoutWithIDsApplied);

  const isEmpty =
    diff.delete.length === 0 &&
    Object.keys(diff.add).length === 0 &&
    Object.keys(diff.update).length === 0;

  return {
    ...diff,
    rootId,
    metadata,
    newLayoutWithIDsApplied,
    didChange: !isEmpty,
  };
}

export { diffStaticLayouts };
