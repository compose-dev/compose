import { TagColor, TagValue } from "./tagColor";
import { StringOnlyKeys } from "../../../types";

export type TableDataRow = {
  [key: string]: string | number | boolean | null | Date | undefined | any;
};

interface TablePageChangeParams {
  offset: number;
  pageSize: number;
  searchQuery: string | null;
  prevSearchQuery: string | null;
  prevTotalRecords: number | null;
}

type TablePageChangeResponse<TData extends TableDataRow[]> = {
  data: TData;
  totalRecords: number;
};

type OnPageChange<TData extends TableDataRow[]> = (
  input: TablePageChangeParams
) => Promise<TablePageChangeResponse<TData>> | TablePageChangeResponse<TData>;

/**
 * Convenience types to quickly format table data.
 *
 * @type `date` Oct 14, 1983
 *
 * @type `datetime` Oct 14, 1983, 10:14 AM
 *
 * @type `currency` $1000.00
 *
 * @type `number` 1,234
 *
 * @type `boolean` ✅ or ❌
 *
 * @type `tag` Colored pills
 *
 * @type `string` Stringify the value and render as is
 */
const TABLE_COLUMN_FORMAT = {
  /** Oct 10, 2000 */
  date: "date",

  /** Oct 10, 2000, 10:14 AM */
  datetime: "datetime",

  /** 1,023,456 */
  number: "number",

  /** $1,023,456.00 */
  currency: "currency",

  /** ✅ or ❌ */
  boolean: "boolean",

  /** Colored pills */
  tag: "tag",

  /** Stringify the value and render as is */
  string: "string",
} as const;

/**
 * The type of a table column.
 *
 * @see {@link TABLE_COLUMN_FORMAT}
 */
type TableColumnFormat =
  (typeof TABLE_COLUMN_FORMAT)[keyof typeof TABLE_COLUMN_FORMAT];

type AdvancedTableColumn<TData extends TableDataRow[]> = {
  key: StringOnlyKeys<TData[number]>;
  /**
   * The original key of the column. Now that we compress key names
   * to single digits, we need to keep track of the original key
   * name so we can map it back to the original data.
   */
  original?: string;
  label?: string;
  /**
   * Format the column data.
   *
   * @see {@link TABLE_COLUMN_FORMAT Table column format options}
   */
  format?: TableColumnFormat;
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

export {
  TableDataRow as DataRow,
  OnPageChange as OnPageChange,
  TablePageChangeParams as PageChangeParams,
  TablePageChangeResponse as PageChangeResponse,
  TABLE_COLUMN_FORMAT as COLUMN_FORMAT,
  TableColumnFormat as ColumnFormat,
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
};
