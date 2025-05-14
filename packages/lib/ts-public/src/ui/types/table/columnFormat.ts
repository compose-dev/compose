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
 * @type `json` JSON object
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

  /** JSON object */
  json: "json",

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

export { TABLE_COLUMN_FORMAT as COLUMN_FORMAT };
export type { TableColumnFormat as ColumnFormat };
