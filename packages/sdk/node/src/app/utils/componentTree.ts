import { UI } from "@composehq/ts-public";

function findComponentByCondition<T extends UI.ComponentGenerators.All>(
  layout: T,
  condition: <J extends UI.ComponentGenerators.All>(component: J) => boolean
): T | null {
  if (condition(layout)) {
    return layout;
  }

  if (layout.interactionType === UI.INTERACTION_TYPE.LAYOUT) {
    const children = Array.isArray(layout.model.children)
      ? layout.model.children
      : [layout.model.children];

    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];
      const found = findComponentByCondition(child, condition);
      if (found !== null) {
        return found as T;
      }
    }
  }

  return null;
}

function countComponentsByCondition<T extends UI.ComponentGenerators.All>(
  layout: T,
  condition: (component: T) => boolean
): number {
  let count = 0;

  if (condition(layout)) {
    count += 1;
  }

  if (layout.interactionType === UI.INTERACTION_TYPE.LAYOUT) {
    const children = Array.isArray(layout.model.children)
      ? layout.model.children
      : [layout.model.children];

    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];
      const childCount = countComponentsByCondition(child as T, condition);
      count += childCount;
    }
  }

  return count;
}

async function doForComponent<T extends UI.ComponentGenerators.All>(
  layout: T,
  callback: (component: T) => Promise<void> | void
): Promise<void> {
  await callback(layout);

  if (layout.interactionType === UI.INTERACTION_TYPE.LAYOUT) {
    const children = Array.isArray(layout.model.children)
      ? layout.model.children
      : [layout.model.children];

    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];
      await doForComponent(child as T, callback);
    }
  }
}

async function editComponentsByCondition<T extends UI.ComponentGenerators.All>(
  layout: T,
  conditionalEdit: (component: T) => Promise<false | T> | false | T
): Promise<T> {
  const edit = await conditionalEdit(layout);

  if (edit !== false) {
    if (edit.interactionType !== UI.INTERACTION_TYPE.LAYOUT) {
      return edit;
    }

    const children = Array.isArray(edit.model.children)
      ? edit.model.children
      : [edit.model.children];

    const newChildren = await Promise.all(
      children.map(async (child) => {
        return await editComponentsByCondition(child as T, conditionalEdit);
      })
    );

    return {
      ...edit,
      model: { ...edit.model, children: newChildren },
    };
  }

  if (layout.interactionType === UI.INTERACTION_TYPE.LAYOUT) {
    const children = Array.isArray(layout.model.children)
      ? layout.model.children
      : [layout.model.children];

    const newChildren = await Promise.all(
      children.map(async (child) => {
        return await editComponentsByCondition(child as T, conditionalEdit);
      })
    );

    return {
      ...layout,
      model: { ...layout.model, children: newChildren },
    };
  }

  return layout;
}

function findComponentByType<T extends UI.ComponentGenerators.All>(
  layout: T,
  type: UI.Type
): T | null {
  return findComponentByCondition(
    layout,
    (component) => component.type === type
  );
}

function findComponentById<T extends UI.ComponentGenerators.All>(
  layout: T,
  id: string
): T | null {
  return findComponentByCondition(
    layout,
    (component) => component.model.id === id
  );
}

function findComponentByInteractionType<T extends UI.ComponentGenerators.All>(
  layout: T,
  interactionType: UI.InteractionType
): T | null {
  return findComponentByCondition(
    layout,
    (component) => component.interactionType === interactionType
  );
}

function countComponentsByType<T extends UI.ComponentGenerators.All>(
  layout: T,
  type: UI.Type
): number {
  return countComponentsByCondition(
    layout,
    (component) => component.type === type
  );
}

export {
  findComponentByCondition as findByCondition,
  countComponentsByCondition as countByCondition,
  editComponentsByCondition as editByCondition,
  findComponentByType as findByType,
  findComponentById as findById,
  findComponentByInteractionType as findByInteractionType,
  countComponentsByType as countByType,
  doForComponent as doForComponent,
};
