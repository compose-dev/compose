import type { DataRow as TableDataRow } from "./dataRow";
import { StringOrNumberOnlyKeys } from "../../../types";

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

interface AdvancedFilterClauseBase {
  operator: ColumnFilterOperator;
  value: any;
}

interface AdvancedFilterGroupBase {
  logicOperator: ColumnFilterLogicOperator;
}

interface AdvancedFilterClause<TData extends TableDataRow[]>
  extends AdvancedFilterClauseBase {
  key: StringOrNumberOnlyKeys<TData[number]>;
}

interface AdvancedFilterGroup<TData extends TableDataRow[]>
  extends AdvancedFilterGroupBase {
  filters: NonNullable<AdvancedFilterModel<TData>>[];
}

type AdvancedFilterModel<TData extends TableDataRow[]> =
  | AdvancedFilterClause<TData>
  | AdvancedFilterGroup<TData>
  | null;

export { COLUMN_FILTER_LOGIC_OPERATOR, COLUMN_FILTER_OPERATOR };
export type {
  ColumnFilterLogicOperator,
  ColumnFilterOperator,
  AdvancedFilterClauseBase,
  AdvancedFilterGroupBase,
  AdvancedFilterClause,
  AdvancedFilterGroup,
  AdvancedFilterModel,
};
