import { UI } from "@composehq/ts-public";
import { useDataOperation } from "../useDataOperation";
import { EditableAdvancedFilterModel } from "./filterModel";
import {
  FormattedTableRow,
  TableColumnProp,
  TanStackTable,
} from "../constants";
import { v4 as uuid } from "uuid";
import { useMemo } from "react";

function serverToDisplayFilterModelRecursive(
  model: UI.Table.AdvancedFilterModel<FormattedTableRow[]>
): EditableAdvancedFilterModel {
  if (model === null) {
    return null;
  }

  if ("logicOperator" in model) {
    return {
      ...model,
      filters: model.filters.map(
        serverToDisplayFilterModelRecursive
      ) as NonNullable<EditableAdvancedFilterModel>[],
      id: uuid(),
    };
  }

  return {
    ...model,
    id: uuid(),
  };
}

function serverToDisplayFilterModel(
  model: UI.Table.AdvancedFilterModel<FormattedTableRow[]>
): EditableAdvancedFilterModel {
  try {
    return serverToDisplayFilterModelRecursive(model);
  } catch (error) {
    return null;
  }
}

function isEmptyOperator(operator: UI.Table.ColumnFilterOperator): boolean {
  return (
    operator === UI.Table.COLUMN_FILTER_OPERATOR.IS_EMPTY ||
    operator === UI.Table.COLUMN_FILTER_OPERATOR.IS_NOT_EMPTY
  );
}

function getValidFilterModel(
  model:
    | EditableAdvancedFilterModel
    | UI.Table.AdvancedFilterModel<FormattedTableRow[]>,
  getKey: (key: string) => string
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
      key: getKey(model.key),
      operator: model.operator,
      value: model.value,
    };
  }

  // Handle filter group
  const validFilters = model.filters
    .map((filter) => getValidFilterModel(filter, getKey))
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

function useAdvancedFiltering({
  initialValue,
  filterable,
  columns,
  onShouldRequestBrowserData,
  onShouldRequestServerData,
}: {
  initialValue: UI.Table.AdvancedFilterModel<FormattedTableRow[]>;
  filterable: boolean;
  columns: TableColumnProp[];
  onShouldRequestBrowserData: (() => void) | null;
  onShouldRequestServerData: (() => void) | null;
}) {
  const columnIdToName = useMemo(
    () =>
      columns.reduce(
        (acc, column) => {
          acc[column.id] = column.original ?? column.id;
          return acc;
        },
        {} as Record<string, string>
      ),
    [columns]
  );

  return useDataOperation({
    // Initial Values
    initialValueFromServer: initialValue,
    serverValueDidChange: (oldValue, newValue) =>
      JSON.stringify(oldValue) !== JSON.stringify(newValue),

    // Operation enabled state
    operationIsEnabled: filterable,
    operationDisabledValue: null,

    // Formatting
    formatServerToDisplay: serverToDisplayFilterModel,
    formatDisplayToValidated: (model) =>
      getValidFilterModel(model, (key) => key),
    formatValidatedToServer: (validatedModel) =>
      getValidFilterModel(validatedModel, (key) => columnIdToName[key]),

    // Pagination Syncing
    onShouldRequestBrowserData,
    onShouldRequestServerData,
  });
}

export { useAdvancedFiltering };
