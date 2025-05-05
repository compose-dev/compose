import { types, UI } from "@composehq/ts-public";
import { FormattedTableRow } from "../constants";
import { v4 as uuid } from "uuid";
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

function isEmptyOperator(operator: UI.Table.ColumnFilterOperator): boolean {
  return (
    operator === UI.Table.COLUMN_FILTER_OPERATOR.IS_EMPTY ||
    operator === UI.Table.COLUMN_FILTER_OPERATOR.IS_NOT_EMPTY
  );
}

function getValidFilterModel(
  model: EditableAdvancedFilterModel
): UI.Table.AdvancedFilterModel<FormattedTableRow[]> {
  if (model === null) {
    return null;
  }

  // Handle filter clause
  if (!("logicOperator" in model)) {
    // If key is null or value is null/undefined, the clause is invalid
    if (model.key === null || model.operator == null) {
      return null;
    }

    // The model value can only be null if the operator is IS_EMPTY or IS_NOT_EMPTY
    if (!isEmptyOperator(model.operator) && model.value == null) {
      return null;
    }

    return {
      key: model.key,
      operator: model.operator,
      value: model.value,
    };
  }

  // Handle filter group
  const validFilters = model.filters
    .map(getValidFilterModel)
    .filter((filter): filter is NonNullable<typeof filter> => filter !== null);

  // If no valid filters remain, the group is invalid
  if (validFilters.length === 0) {
    return null;
  }

  return {
    logicOperator: model.logicOperator,
    filters: validFilters,
  };
}

function serverToBrowserFilterModelRecursive(
  model: UI.Table.AdvancedFilterModel<FormattedTableRow[]>
): EditableAdvancedFilterModel {
  if (model === null) {
    return null;
  }

  if ("logicOperator" in model) {
    return {
      ...model,
      filters: model.filters.map(
        serverToBrowserFilterModelRecursive
      ) as NonNullable<EditableAdvancedFilterModel>[],
      id: uuid(),
    };
  }

  return {
    ...model,
    id: uuid(),
  };
}

function serverToBrowserFilterModel(
  model: UI.Table.AdvancedFilterModel<FormattedTableRow[]>
): EditableAdvancedFilterModel {
  try {
    return serverToBrowserFilterModelRecursive(model);
  } catch (error) {
    return null;
  }
}

export type {
  EditableAdvancedFilterClause,
  EditableAdvancedFilterGroup,
  EditableAdvancedFilterModel,
};
export {
  copyAdvancedFilterModel,
  findFilterModelNode,
  getValidFilterModel,
  serverToBrowserFilterModel,
};
