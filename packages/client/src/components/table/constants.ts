import { UI } from "@composehq/ts-public";

const INTERNAL_COLUMN_ID = {
  ACTION: "a-//&&wreqa#jksejsl-*AFSS",
  SELECT: "s-//&&wreqa#jksejsl-*!!AFSS",
  META: "m-//&&wreqa#jksejsl-*!!AFSS",
} as const;

type FormattedTableRow =
  UI.Components.InputTable["model"]["properties"]["data"][number] & {
    [INTERNAL_COLUMN_ID.META]: Record<string, string>;
  };

interface TableColumn {
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

  width?: string;
}

export { INTERNAL_COLUMN_ID };
export type { FormattedTableRow, TableColumn };
