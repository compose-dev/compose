import { UI } from "@composehq/ts-public";
import {
  advancedFilterModelValuesAreEqual,
  DisplayAdvancedFilterModel,
  EditableAdvancedFilterModel,
  ServerAdvancedFilterModel,
  ValidatedAdvancedFilterModel,
} from "./filterModel";
import { FormattedTableRow, TableColumnProp } from "../constants";
import { v4 as uuid } from "uuid";
import { useMemo, useCallback, useEffect } from "react";
import {
  COLUMN_FORMAT_TO_FILTER_OPERATORS,
  getOperatorInputType,
  OPERATOR_INPUT_TYPE,
} from "./filterOperators";
import { useDataControl } from "../useDataControl";
import * as Views from "../views";

function serverToDisplayFilterModelRecursive(
  model: UI.Table.AdvancedFilterModel<FormattedTableRow[]>,
  getMetadata: (key: string) => {
    id: string;
    format: UI.Table.ColumnFormat | undefined;
  }
): EditableAdvancedFilterModel {
  if (model === null) {
    return null;
  }

  if ("logicOperator" in model) {
    return {
      ...model,
      filters: model.filters.map((filter) =>
        serverToDisplayFilterModelRecursive(filter, getMetadata)
      ) as NonNullable<EditableAdvancedFilterModel>[],
      id: uuid(),
    };
  }

  const metadata = getMetadata(model.key);

  const validOperators =
    COLUMN_FORMAT_TO_FILTER_OPERATORS[
      metadata.format ?? UI.Table.COLUMN_FORMAT.string
    ];

  const isValidOperator = validOperators.includes(model.operator);

  let modelValue = model.value;

  if (!isValidOperator) {
    alert(
      `Received invalid filter operator from server for column with id: ${model.key}.\n\nReceived: ${model.operator}.\n\nValid operators for column with format ${metadata.format}: ${validOperators.join(
        ", "
      )}\n\nNote: Certain SDKs may use different operator names. For example, the Python SDK uses snake_case for operator names. Check the SDK documentation for the correct operator names.`
    );
  }

  const operatorInputType = getOperatorInputType(
    model.operator,
    metadata.format
  );

  if (operatorInputType === OPERATOR_INPUT_TYPE.BOOLEAN_SELECT) {
    if (typeof modelValue !== "boolean") {
      alert(
        `Received invalid filter from server for boolean column with id: ${model.key}. Received: ${modelValue} with type ${typeof modelValue}. Should be a boolean.`
      );
    }
  } else if (operatorInputType === OPERATOR_INPUT_TYPE.MULTI_SELECT) {
    if (!Array.isArray(modelValue)) {
      alert(
        `Received invalid filter from server for multi-select column with id: ${model.key}. Received: ${modelValue} with type ${typeof modelValue}. Should be a list of values, instead of a single value.\n\nIf you want to filter for a single value, pass a list with only that value.`
      );
    } else if (
      modelValue.some(
        (value) =>
          typeof value !== "string" &&
          typeof value !== "number" &&
          typeof value !== "boolean"
      )
    ) {
      alert(
        `Received invalid filter from server for multi-select column with id: ${model.key}. Received: ${JSON.stringify(
          modelValue
        )}. Should be an array of strings, numbers, or booleans.`
      );
    }
  } else if (operatorInputType === OPERATOR_INPUT_TYPE.NUMBER) {
    if (typeof modelValue !== "number") {
      alert(
        `Received invalid filter from server for number column with id: ${model.key}. Received: ${modelValue} with type ${typeof modelValue}. Should be a number.`
      );
    }
  } else if (
    operatorInputType === OPERATOR_INPUT_TYPE.DATE_INPUT ||
    operatorInputType === OPERATOR_INPUT_TYPE.DATE_TIME_INPUT
  ) {
    try {
      modelValue = new Date(modelValue);

      if (isNaN(modelValue.getTime())) {
        throw new Error("Invalid date");
      }
    } catch (error) {
      alert(
        `Received invalid filter from server for date column with id: ${model.key}. Received: ${modelValue}, which could not be parsed as a date. Should be a value that can be parsed into a JS Date object.`
      );
    }
  } else if (operatorInputType === OPERATOR_INPUT_TYPE.TEXT) {
    if (typeof modelValue !== "string") {
      alert(
        `Received invalid filter from server for text column with id: ${model.key}. Received: ${modelValue} with type ${typeof modelValue}. Should be a string.`
      );
    }
  } else {
    modelValue = "";
  }

  return {
    value: modelValue,
    key: metadata.id,
    operator: isValidOperator ? model.operator : validOperators[0],
    id: uuid(),
  };
}

function serverToDisplayFilterModel(
  model: ServerAdvancedFilterModel,
  getMetadata: (key: string) => {
    id: string;
    format: UI.Table.ColumnFormat | undefined;
  }
): DisplayAdvancedFilterModel {
  try {
    return serverToDisplayFilterModelRecursive(model, getMetadata);
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
  serverFilterBy,
  filterable,
  columns,
  paginated,
  viewsHook,
}: {
  serverFilterBy: ServerAdvancedFilterModel | undefined;
  filterable: boolean;
  columns: TableColumnProp[];
  paginated: boolean;
  viewsHook: ReturnType<typeof Views.use>;
}) {
  const getCurrentServerValue = useCallback(() => {
    if (paginated) {
      return serverFilterBy ?? null;
    }

    return viewsHook.appliedRef.current.filterBy;
  }, [paginated, serverFilterBy, viewsHook.appliedRef]);

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

  const columnNameToMetadata = useMemo(
    () =>
      columns.reduce(
        (acc, column) => {
          acc[column.original ?? column.id] = {
            id: column.id,
            format: column.format,
          };
          return acc;
        },
        {} as Record<
          string,
          { id: string; format: UI.Table.ColumnFormat | undefined }
        >
      ),
    [columns]
  );

  const serverToDraft = useCallback(
    (model: ServerAdvancedFilterModel) =>
      serverToDisplayFilterModel(model, (key) => columnNameToMetadata[key]),
    [columnNameToMetadata]
  );

  const draftToApplied = useCallback(
    (model: DisplayAdvancedFilterModel) =>
      getValidFilterModel(model, (key) => key),
    []
  );

  const appliedToServer = useCallback(
    (model: ValidatedAdvancedFilterModel) =>
      getValidFilterModel(model, (key) => columnIdToName[key]),
    [columnIdToName]
  );

  const getResetValue = useCallback(() => {
    return viewsHook.appliedRef.current.filterBy;
  }, [viewsHook.appliedRef]);

  const dataControl = useDataControl({
    getCurrentServerValue,
    draftToApplied,
    appliedToServer,
    serverToDraft,
    serverValuesAreEqual: advancedFilterModelValuesAreEqual,
    isEnabled: filterable,
    disabledValue: null,
    paginated,
    getResetValue,
  });

  useEffect(() => {
    dataControl.setIsEnabled(filterable);
  }, [filterable, dataControl]);

  return dataControl;
}

export { useAdvancedFiltering };
