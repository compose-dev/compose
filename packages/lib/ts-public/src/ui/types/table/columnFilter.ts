import type { DataRow as TableDataRow } from "./dataRow";
import { StringOnlyKeys } from "../../../types";

const COLUMN_FILTER_LOGIC_OPERATOR = {
  AND: "and",
  OR: "or",
} as const;

type ColumnFilterLogicOperator =
  (typeof COLUMN_FILTER_LOGIC_OPERATOR)[keyof typeof COLUMN_FILTER_LOGIC_OPERATOR];

const COLUMN_FILTER_OPERATOR = {
  IS: "is",
  IS_NOT: "isNot",
  INCLUDES: "includes",
  NOT_INCLUDES: "notIncludes",
  GREATER_THAN: "greaterThan",
  GREATER_THAN_OR_EQUAL: "greaterThanOrEqual",
  LESS_THAN: "lessThan",
  LESS_THAN_OR_EQUAL: "lessThanOrEqual",
  IS_EMPTY: "isEmpty",
  IS_NOT_EMPTY: "isNotEmpty",
  HAS_ANY: "hasAny",
  NOT_HAS_ANY: "notHasAny",
  HAS_ALL: "hasAll",
  NOT_HAS_ALL: "notHasAll",
} as const;

type ColumnFilterOperator =
  (typeof COLUMN_FILTER_OPERATOR)[keyof typeof COLUMN_FILTER_OPERATOR];

interface ColumnFilterRuleBase {
  operator: ColumnFilterOperator;
  value: any;
}

interface ColumnFilterGroupBase {
  logicOperator: ColumnFilterLogicOperator;
}

interface ColumnFilterRule<TData extends TableDataRow[]>
  extends ColumnFilterRuleBase {
  key: StringOnlyKeys<TData[number]>;
}

interface ColumnFilterGroup<TData extends TableDataRow[]>
  extends ColumnFilterGroupBase {
  filters: NonNullable<ColumnFilterModel<TData>>[];
}

type ColumnFilterModel<TData extends TableDataRow[]> =
  | ColumnFilterRule<TData>
  | ColumnFilterGroup<TData>
  | null;

export { COLUMN_FILTER_LOGIC_OPERATOR, COLUMN_FILTER_OPERATOR };
export type {
  ColumnFilterLogicOperator,
  ColumnFilterOperator,
  ColumnFilterRuleBase,
  ColumnFilterGroupBase,
  ColumnFilterRule,
  ColumnFilterGroup,
  ColumnFilterModel,
};
