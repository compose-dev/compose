import type { DataRow as TableDataRow } from "./dataRow";
import { StringOnlyKeys } from "../../../types";

const COLUMN_FILTER_LOGIC_OPERATOR = {
  AND: "and",
  OR: "or",
} as const;

type ColumnFilterLogicOperator =
  (typeof COLUMN_FILTER_LOGIC_OPERATOR)[keyof typeof COLUMN_FILTER_LOGIC_OPERATOR];

const COLUMN_FILTER_OPERATOR = {
  IS: "IS",
  IS_NOT: "IS_NOT",
  INCLUDES: "INCLUDES",
  NOT_INCLUDES: "NOT_INCLUDES",
  GREATER_THAN: "GREATER_THAN",
  GREATER_THAN_OR_EQUAL: "GREATER_THAN_OR_EQUAL",
  LESS_THAN: "LESS_THAN",
  LESS_THAN_OR_EQUAL: "LESS_THAN_OR_EQUAL",
  IS_EMPTY: "IS_EMPTY",
  IS_NOT_EMPTY: "IS_NOT_EMPTY",
  HAS_ANY: "HAS_ANY",
  NOT_HAS_ANY: "NOT_HAS_ANY",
  HAS_ALL: "HAS_ALL",
  NOT_HAS_ALL: "NOT_HAS_ALL",
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
  key: StringOnlyKeys<TData[number]>;
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
