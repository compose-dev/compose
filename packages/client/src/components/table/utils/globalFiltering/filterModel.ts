import { types, UI } from "@composehq/ts-public";
import { FormattedTableRow } from "../constants";
import { u } from "@compose/ts";

interface EditableAdvancedFilterClause
  extends UI.Table.AdvancedFilterClauseBase {
  key: types.StringOnlyKeys<FormattedTableRow> | null;
  id: string;
}

interface EditableAdvancedFilterGroup extends UI.Table.AdvancedFilterGroupBase {
  filters: NonNullable<EditableAdvancedFilterModel>[];
  id: string;
}

type EditableAdvancedFilterModel =
  | EditableAdvancedFilterClause
  | EditableAdvancedFilterGroup
  | null;

function copyAdvancedFilterModel(
  model: EditableAdvancedFilterModel
): EditableAdvancedFilterModel {
  if (model === null) {
    return null;
  }

  if ("logicOperator" in model) {
    return {
      ...model,
      filters: model.filters.map(
        copyAdvancedFilterModel
      ) as NonNullable<EditableAdvancedFilterModel>[],
    };
  }

  return { ...model };
}

function findFilterModelNode(
  model: EditableAdvancedFilterModel,
  path: string[]
): EditableAdvancedFilterModel {
  if (model === null) {
    return null;
  }

  if (model.id === path[path.length - 1]) {
    return model;
  }

  if ("logicOperator" in model && path.length > 1) {
    for (let i = 0; i < model.filters.length; i++) {
      const result = findFilterModelNode(model.filters[i], path);

      if (result !== null) {
        return result;
      }
    }
  }

  return null;
}

type ServerAdvancedFilterModel = UI.Table.AdvancedFilterModel<
  FormattedTableRow[]
>;
type DisplayAdvancedFilterModel = EditableAdvancedFilterModel;
type ValidatedAdvancedFilterModel = UI.Table.AdvancedFilterModel<
  FormattedTableRow[]
>;

function advancedFilterModelValuesAreEqual(
  oldValue: ServerAdvancedFilterModel | EditableAdvancedFilterModel,
  newValue: ServerAdvancedFilterModel | EditableAdvancedFilterModel
) {
  if (oldValue === null && newValue === null) {
    return true;
  }

  if (oldValue === null || newValue === null) {
    return false;
  }

  if ("logicOperator" in oldValue) {
    if (!("logicOperator" in newValue)) {
      return false;
    }

    if (oldValue.logicOperator !== newValue.logicOperator) {
      return false;
    }

    if (oldValue.filters.length !== newValue.filters.length) {
      return false;
    }

    for (let i = 0; i < oldValue.filters.length; i++) {
      if (
        !advancedFilterModelValuesAreEqual(
          oldValue.filters[i],
          newValue.filters[i]
        )
      ) {
        return false;
      }
    }

    return true;
  }

  if ("logicOperator" in newValue) {
    return false;
  }

  if (oldValue.key !== newValue.key) {
    return false;
  }

  if (oldValue.operator !== newValue.operator) {
    return false;
  }

  if (Array.isArray(oldValue.value)) {
    if (!Array.isArray(newValue.value)) {
      return false;
    }

    if (oldValue.value.length !== newValue.value.length) {
      return false;
    }

    for (let i = 0; i < oldValue.value.length; i++) {
      if (oldValue.value[i] !== newValue.value[i]) {
        return false;
      }
    }

    return true;
  }

  if (oldValue.value instanceof Date || newValue.value instanceof Date) {
    try {
      const oldValueDate =
        oldValue.value instanceof Date
          ? oldValue.value.getTime()
          : new Date(oldValue.value).getTime();
      const newValueDate =
        newValue.value instanceof Date
          ? newValue.value.getTime()
          : new Date(newValue.value).getTime();

      return Math.abs(oldValueDate - newValueDate) < 30000; // Within 30 seconds
    } catch (e) {
      return false;
    }
  } else if (u.date.isValidISODateString(oldValue.value)) {
    try {
      const oldValueDate = new Date(oldValue.value).getTime();
      const newValueDate = new Date(newValue.value).getTime();

      return Math.abs(oldValueDate - newValueDate) < 30000; // Within 30 seconds
    } catch (e) {
      return false;
    }
  }

  const oldValueIsNullish = oldValue.value === null || oldValue.value === "";
  const newValueIsNullish = newValue.value === null || newValue.value === "";

  if (oldValueIsNullish && newValueIsNullish) {
    return true;
  }

  if (oldValueIsNullish || newValueIsNullish) {
    return false;
  }

  return oldValue.value === newValue.value;
}

export type {
  EditableAdvancedFilterClause,
  EditableAdvancedFilterGroup,
  EditableAdvancedFilterModel,
  ServerAdvancedFilterModel,
  DisplayAdvancedFilterModel,
  ValidatedAdvancedFilterModel,
};
export {
  copyAdvancedFilterModel,
  findFilterModelNode,
  advancedFilterModelValuesAreEqual,
};
