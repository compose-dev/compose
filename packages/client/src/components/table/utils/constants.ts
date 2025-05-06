import { UI } from "@composehq/ts-public";
import { Table } from "@tanstack/react-table";
import { FormattedTagColors } from "./tags";

const UNIQUE_SUFFIX = "-//&&wr@q%#jks*j~l-*A<+SS>..<||{^$@??.";

/**
 * Column IDs that are applied by Compose to the table data to enable certain
 * table features.
 */
const INTERNAL_COLUMN_ID = {
  /**
   * The ID applied to the actions column, which is added to table data to
   * enable actions buttons on table rows.
   */
  ACTION: `a${UNIQUE_SUFFIX}`,
  /**
   * The ID applied to the row selection checkboxes column, which is added
   * to table data to enable row selections.
   */
  SELECT: `s${UNIQUE_SUFFIX}`,
  /**
   * A hidden column that is added to every row that includes metadata about
   * that row. This enables features such as custom fuzzy search which we
   * use to search over date columns.
   */
  META: `m${UNIQUE_SUFFIX}`,
  /**
   * A hidden key that is added to the meta object of every row that is used
   * to track the selection state of the row.
   */
  ROW_SELECTION: `r${UNIQUE_SUFFIX}`,
} as const;

/**
 * A table row after initial pre-processing. This is the data type that's
 * actually used throughout the table component.
 */
type FormattedTableRow =
  UI.Components.InputTable["model"]["properties"]["data"][number] & {
    [INTERNAL_COLUMN_ID.META]: Record<string, string>;
  };

/**
 * The table column type that's expected as a prop input into the Table component.
 */
interface TableColumnProp {
  /**
   * The unique identifier for the column.
   */
  id: string;
  /**
   * The displayed label for the column.
   */
  label: string;
  /**
   * The path to the data in the data object.
   * @example
   * // For the following data object:
   * [
   *  { user: { name: "Alice" }, age: 42 },
   *  { user: { name: "Bob" }, age: 43 },
   * ]
   * // The accessor for the "name" column would be "user.name".
   * // The accessor for the "age" column would be "age".
   */
  accessorKey: string;
  /**
   * The type of the column.
   */
  format?: UI.Table.AdvancedColumn<UI.Table.DataRow[]>["format"];
  /**
   * The colors to use for the column.
   */
  tagColors?: FormattedTagColors;
  /**
   * Width of the column in pixels/rem/etc.
   */
  width?: string;
  /**
   * Absolute width of the column in pixels when pinned.
   *
   * If not provided, will use the default width.
   */
  pinnedWidth?: number;
  /**
   * The overflow behavior of the column.
   */
  overflow: NonNullable<
    UI.Table.AdvancedColumn<UI.Table.DataRow[]>["overflow"]
  >;
  /**
   * Whether the column should expand to fill the available width. Essentially,
   * all column cells should set `flex-1` if this is true.
   */
  expand?: boolean;
  /**
   * Whether the column is initially hidden.
   * @default `false`
   */
  hidden?: boolean;
  /**
   * The original accessor key for the column, prior to any server-side
   * optimizations to reduce the payload size.
   */
  original?: string;
  /**
   * Whether the column is pinned to the left or right of the table.
   */
  pinned?: UI.Table.PinnedSide;
}

type TanStackTable = Table<FormattedTableRow>;

const COLUMN_WIDTH_NUMERIC = {
  DEFAULT: 192,
  JSON: 288,
} as const;

const COLUMN_WIDTH = {
  DEFAULT: `${COLUMN_WIDTH_NUMERIC.DEFAULT}px`,
  JSON: `${COLUMN_WIDTH_NUMERIC.JSON}px`,
} as const;

interface PaginationOperators {
  searchQuery: string | null;
  sortBy: UI.Table.PageChangeParams<UI.Table.DataRow[]>["sortBy"];
  filterBy: UI.Table.AdvancedFilterModel<FormattedTableRow[]>;
}

export { INTERNAL_COLUMN_ID, COLUMN_WIDTH, COLUMN_WIDTH_NUMERIC };
export type {
  FormattedTableRow,
  TableColumnProp,
  TanStackTable,
  PaginationOperators,
};
