import { UI } from "@composehq/ts-public";
import { AppError } from "../error";

function flattenComponent(
  component: UI.ComponentGenerators.All
): Record<string, UI.ComponentGenerators.All> {
  if (component.interactionType === UI.INTERACTION_TYPE.LAYOUT) {
    const children = Array.isArray(component.model.children)
      ? component.model.children
      : [component.model.children];

    const mapped = children.map(flattenComponent);

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
