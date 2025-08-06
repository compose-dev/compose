import { UI } from "@composehq/ts-public";
import { AppError } from "../error";
import { AppStore } from "../types";

/**
 * Flattens a component into a record of component IDs to components. Useful
 * for nested component trees.
 *
 * Accepts an optional "flattenedRenderModel" parameter. When passed, it
 * "hydrates" the children of the component using the flattened render model.
 * This is necessary in cases where we we only store the child IDs instead of
 * the entire child component within the "children" field of layout components.
 * This can occur when layout components are updated, since the rerender message
 * only sends the child IDs alongside the layout component instead of nesting
 * the entire child component.
 */
function flattenComponent(
  component: UI.ComponentGenerators.All,
  flattenedRenderModel?: AppStore["flattenedModel"][string]
): Record<string, UI.ComponentGenerators.All> {
  if (component.interactionType === UI.INTERACTION_TYPE.LAYOUT) {
    let children: UI.ComponentGenerators.All[] = Array.isArray(
      component.model.children
    )
      ? component.model.children
      : [component.model.children];

    if (flattenedRenderModel) {
      children = children.map((child) => {
        const childId = child.model.id;
        return flattenedRenderModel[childId];
      });
    }

    const mapped = children.map((child) =>
      flattenComponent(child, flattenedRenderModel)
    );

    return mapped.reduce(
      (acc, item) => {
        const duplicate = checkDuplicateIds(acc, item);
        if (duplicate !== null) {
          throw new AppError(
            "error",
            `Duplicate component ID found: '${duplicate}'. All component IDs must be unique.`
          );
        }

        if (typeof component.model.id !== "string") {
          throw new AppError("error", "Component ID must be a string");
        }

        return {
          ...acc,
          ...item,
        };
      },
      {
        [component.model.id]: component,
      }
    );
  }

  if (typeof component.model.id !== "string") {
    throw new AppError("error", "Component ID must be a string");
  }

  return {
    [component.model.id]: component,
  };
}

function checkDuplicateIds(
  a: Record<string, UI.ComponentGenerators.All>,
  b: Record<string, UI.ComponentGenerators.All>
): string | null {
  const setA = new Set(Object.keys(a));

  for (const key of Object.keys(b)) {
    if (setA.has(key)) {
      return key;
    }
  }

  return null;
}

export { flattenComponent };
