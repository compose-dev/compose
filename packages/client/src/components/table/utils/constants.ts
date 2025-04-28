import { UI } from "@composehq/ts-public";
import { Table } from "@tanstack/react-table";

/**
 * Column IDs that are applied by Compose to the table data to enable certain
 * table features.
 */
const INTERNAL_COLUMN_ID = {
  /**
   * The ID applied to the actions column, which is added to table data to
   * enable actions buttons on table rows.
   */
  ACTION: "a-//&&wreqa#jksejsl-*AFSS",
  /**
   * The ID applied to the row selection checkboxes column, which is added
   * to table data to enable row selections.
   */
  SELECT: "s-//&&wreqa#jksejsl-*!!AFSS",
  /**
   * A hidden column that is added to every row that includes metadata about
   * that row. This enables features such as custom fuzzy search which we
   * use to search over date columns.
   */
  META: "m-//&&wreqa#jksejsl-*!!AFSS",
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
  tagColors?: Record<string | number, UI.Table.TagColor>;
  /**
   * Width of the column in pixels/rem/etc.
   */
  width?: string;
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
}

type TanStackTable = Table<FormattedTableRow>;

export { INTERNAL_COLUMN_ID };
export type { FormattedTableRow, TableColumnProp, TanStackTable };
