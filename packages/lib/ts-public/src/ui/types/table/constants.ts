import { TagColor, TagValue } from "./tagColor";
import { StringOnlyKeys } from "../../../types";
import type { DataRow as TableDataRow } from "./dataRow";
import { AdvancedFilterModel } from "./advancedFiltering";
import type { ColumnFormat } from "./columnFormat";

const COLUMN_SORT_DIRECTION = {
  ASC: "asc",
  DESC: "desc",
} as const;

type ColumnSortDirection =
  (typeof COLUMN_SORT_DIRECTION)[keyof typeof COLUMN_SORT_DIRECTION];

interface ColumnSort<TData extends TableDataRow[]> {
  key: StringOnlyKeys<TData[number]>;
  direction: ColumnSortDirection;
}

interface TablePageChangeParams<TData extends TableDataRow[]> {
  offset: number;
  pageSize: number;
  searchQuery: string | null;
  prevSearchQuery: string | null;
  prevTotalRecords: number | null;
  sortBy: ColumnSort<TData>[];
  filterBy: AdvancedFilterModel<TData> | null;
}

type TablePageChangeResponse<TData extends TableDataRow[]> = {
  data: TData;
  totalRecords: number;
};

type OnPageChange<TData extends TableDataRow[]> = (
  input: TablePageChangeParams<TData>
) => Promise<TablePageChangeResponse<TData>> | TablePageChangeResponse<TData>;

const OVERFLOW_BEHAVIOR = {
  CLIP: "clip",
  ELLIPSIS: "ellipsis",
  DYNAMIC: "dynamic",
} as const;

type OverflowBehavior =
  (typeof OVERFLOW_BEHAVIOR)[keyof typeof OVERFLOW_BEHAVIOR];

const PINNED_SIDE = {
  LEFT: "left",
  RIGHT: "right",
} as const;

type PinnedSide = (typeof PINNED_SIDE)[keyof typeof PINNED_SIDE];

type AdvancedTableColumn<TData extends TableDataRow[]> = {
  /**
   * The key that will be used to access the column data from
   * the passed in data.
   */
  key: StringOnlyKeys<TData[number]>;
  /**
   * The original key of the column. Now that we compress key names
   * to single digits, we need to keep track of the original key
   * name so we can map it back to the original data.
   */
  original?: string;
  /**
   * The label of the column. By default, the label will be inferred
   * from the key.
   */
  label?: string;
  /**
   * Format the column data.
   *
   * @see {@link TABLE_COLUMN_FORMAT Table column format options}
   */
  format?: ColumnFormat;
  /**
   * The width of the column, e.g. `100px`. By default, the width will be
   * set dynamically.
   */
  width?: string;
  /**
   * Map tag colors to values or lists of values. Use optional `_default` key
   * to set a fallback color for values that are not in the map. Will work with
   * string, number, and boolean type values.
   *
   * @example
   * ```ts
   * {
   *   red: "error",
   *   green: ["success", "approved"],
   *   _default: "gray",
   * }
   * ```
   */
  tagColors?: Partial<
    Record<TagColor, TagValue | TagValue[]> & {
      _default: TagColor;
    }
  >;
  /**
   * The overflow behavior of the column. In most cases, you should set the
   * overflow behavior for all columns at once using the `overflow` property
   * that's available directly on the table component. If you need to
   * override the overflow behavior for a specific column, you can do so here.
   *
   * Options:
   *
   * - `clip`: Clip the text.
   * - `ellipsis`: Show ellipsis when the text overflows.
   * - `dynamic`: Expand the cell height to fit the content.
   *
   * @default `ellipsis`
   */
  overflow?: OverflowBehavior;
  /**
   * Whether the column is initially hidden.
   *
   * @default `false`
   */
  hidden?: boolean;
  /**
   * Whether the column is pinned to the left or right of the table.
   */
  pinned?: PinnedSide;
};

// Omit the original field in the type that's shown to the user.
type AdvancedTableColumnGenerator<TData extends TableDataRow[]> = Omit<
  AdvancedTableColumn<TData>,
  "original"
>;

type TableColumn<TData extends TableDataRow[]> =
  | StringOnlyKeys<TData[number]>
  | AdvancedTableColumn<TData>;
type TableColumnGenerator<TData extends TableDataRow[]> =
  | StringOnlyKeys<TData[number]>
  | AdvancedTableColumnGenerator<TData>;

const PAGINATION_THRESHOLD = 2500;
const DEFAULT_PAGE_SIZE = 100;
const DEFAULT_OFFSET = 0;
const DEFAULT_SEARCH_QUERY = null;
const DEFAULT_PAGINATED = false;

const PAGINATION_TYPE = {
  MANUAL: "manual",
  AUTO: "auto",
} as const;

type PaginationType = (typeof PAGINATION_TYPE)[keyof typeof PAGINATION_TYPE];

const SELECTION_RETURN_TYPE = {
  /**
   * Return the full row object.
   */
  FULL: "full",

  /**
   * Return the index of the row.
   */
  INDEX: "index",
} as const;

type SelectionReturnType =
  (typeof SELECTION_RETURN_TYPE)[keyof typeof SELECTION_RETURN_TYPE];

/**
 * Determine if a column should sort in descending order by default.
 */
function shouldSortDescendingFirst(format: ColumnFormat | undefined) {
  return (
    format === "date" ||
    format === "datetime" ||
    format === "number" ||
    format === "currency" ||
    format === "boolean"
  );
}

const TABLE_SORT_OPTION = {
  SINGLE: "single",
  MULTI: true,
  DISABLED: false,
} as const;

type TableSortOption =
  (typeof TABLE_SORT_OPTION)[keyof typeof TABLE_SORT_OPTION];

const TABLE_DENSITY = {
  COMPACT: "compact",
  STANDARD: "standard",
  COMFORTABLE: "comfortable",
} as const;

type TableDensity = (typeof TABLE_DENSITY)[keyof typeof TABLE_DENSITY];

export {
  OnPageChange as OnPageChange,
  TablePageChangeParams as PageChangeParams,
  TablePageChangeResponse as PageChangeResponse,
  TableColumn as Column,
  AdvancedTableColumn as AdvancedColumn,
  TableColumnGenerator as ColumnGenerator,
  PAGINATION_THRESHOLD as PAGINATION_THRESHOLD,
  DEFAULT_PAGE_SIZE as DEFAULT_PAGE_SIZE,
  PAGINATION_TYPE as PAGINATION_TYPE,
  PaginationType as PaginationType,
  SELECTION_RETURN_TYPE as SELECTION_RETURN_TYPE,
  SelectionReturnType as SelectionReturnType,
  DEFAULT_OFFSET as DEFAULT_OFFSET,
  DEFAULT_SEARCH_QUERY as DEFAULT_SEARCH_QUERY,
  DEFAULT_PAGINATED as DEFAULT_PAGINATED,
  OVERFLOW_BEHAVIOR as OVERFLOW_BEHAVIOR,
  OverflowBehavior as OverflowBehavior,
  shouldSortDescendingFirst as shouldSortDescendingFirst,
  TABLE_SORT_OPTION as SORT_OPTION,
  TableSortOption as SortOption,
  COLUMN_SORT_DIRECTION as SORT_DIRECTION,
  ColumnSortDirection as SortDirection,
  ColumnSort as ColumnSort,
  TABLE_DENSITY as DENSITY,
  TableDensity as Density,
  PINNED_SIDE as PINNED_SIDE,
  PinnedSide as PinnedSide,
};
