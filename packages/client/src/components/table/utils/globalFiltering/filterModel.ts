import { types, UI } from "@composehq/ts-public";
import { FormattedTableRow } from "../constants";

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

export type {
  EditableAdvancedFilterClause,
  EditableAdvancedFilterGroup,
  EditableAdvancedFilterModel,
};
export { copyAdvancedFilterModel, findFilterModelNode };
