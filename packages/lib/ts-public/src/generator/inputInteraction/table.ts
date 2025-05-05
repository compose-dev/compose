import * as UI from "../../ui";
import {
  BaseWithInputInteraction,
  MULTI_SELECTION_MIN_DEFAULT,
  MULTI_SELECTION_MAX_DEFAULT,
} from "../base";

// Takes a table action interface and adds an onClick handler
type TableAction<TData extends UI.Table.DataRow[]> = NonNullable<
  UI.Components.InputTable["model"]["properties"]["actions"]
>[number] & {
  /**
   * The function to call when the action is clicked.
   *
   * @param row - The row that was clicked.
   * @param index - The index of the row that was clicked.
   */
  onClick: (row: TData[number], index: number) => void;
};

interface TableProperties<TData extends UI.Table.DataRow[]>
  extends BaseWithInputInteraction<boolean> {
  /**
   * Manually specify the columns to be displayed in the table. Usage:
   *
   * @example
   * ```typescript
   * // Simple usage:
   * page.add(() => ui.table("companies", companies, {
   *   columns: ["name", "location", "revenue"],
   * }));
   *
   * // Advanced usage:
   * page.add(() => ui.table("companies", companies, {
   *   columns: [
   *     "name",
   *     { key: "location", format: "tag" },
   *     { key: "revenue", label: "ARR", format: "currency" },
   *   ],
   * }));
   * ```
   *
   * @link https://docs.composehq.com/components/input/table#columns
   * Learn more in the {@link https://docs.composehq.com/components/input/table#columns documentation}.
   */
  columns: UI.Table.ColumnGenerator<TData>[] | null;
  /**
   * A list of actions that can be performed on table rows.
   *
   * @example
   * ```typescript
   * page.add(() => ui.table("companies", companies, {
   *   actions: [
   *     { label: "Delete", onClick: (row) => database.deleteCompany(row.id) },
   *     { label: "Details", onClick: (row) => page.modal(() => ui.json(row)) },
   *   ],
   * }));
   * ```
   *
   * @link
   * Learn more in the {@link https://docs.composehq.com/components/input/table#row-actions documentation}.
   */
  actions: TableAction<TData>[] | null;
  /**
   * The minimum number of rows that must be selected. Defaults to `0`.
   */
  minSelections: number;
  /**
   * The maximum number of rows that can be selected. Defaults to `1000000000`.
   */
  maxSelections: number;
  /**
   * A custom validation function that is called on selected rows. Return nothing if valid, or a string error message if invalid.
   */
  validate: UI.Components.InputTable["hooks"]["validate"];
  data: TData;
  /**
   * Whether the table should allow row selection. Defaults to `false`, or `true` if `onChange` is provided.
   */
  selectable?: boolean;
  /**
   * @deprecated use `selectable` instead
   */
  allowSelect: UI.Components.InputTable["model"]["properties"]["allowSelect"];
  /**
   * A function that is called when the user selects or deselects rows. It receives the selected rows as an argument, or the selected row indices if the `selectionReturnType` parameter is set to `index`.
   */
  onChange: UI.Components.InputTable["hooks"]["onSelect"];
  /**
   * A list of row indices (e.g. `[0, 1, 2]`) to pre-select when the table is first rendered. Defaults to empty list.
   */
  initialSelectedRows: UI.Components.InputTable["model"]["properties"]["initialSelectedRows"];
  /**
   * How the table should return selected rows to hooks such as `onChange`. Options:
   *
   * - `full`: A list of rows.
   * - `index`: A list of row indices.
   *
   * Defaults to `full`. Must be set to `index` if the table is paginated to enable row selection.
   */
  selectionReturnType: UI.Components.InputTable["model"]["properties"]["selectMode"];
  /**
   * Whether the table should be searchable. Defaults to `true` for normal tables, `false` for paginated tables.
   */
  searchable: boolean;
  /**
   * Whether the table should be paginated server-side. Enabling this can improve performance by only loading a subset of the data at a time. Defaults to `false`. Tables with more than 2500 rows will be paginated by default.
   */
  paginate: boolean;
  /**
   * The overflow behavior of table cells. Options:
   *
   * - `clip`: Clip the content.
   * - `ellipsis`: Show ellipsis when the content overflows.
   * - `dynamic`: Expand the cell height to fit the content.
   *
   * @default `ellipsis`
   */
  overflow?: UI.Components.InputTable["model"]["properties"]["overflow"];
  /**
   * Whether the table should be sortable. Options:
   *
   * - `true`: Allow multi-column sorting.
   * - `"single"`: Allow single-column sorting.
   * - `false`: Disable sorting.
   *
   * @default `true` for normal tables, `false` for paginated tables
   */
  sortable?: UI.Components.InputTable["model"]["properties"]["sortable"];
  /**
   * An ordered list of columns to initially sort by. For example
   *
   * @example
   * ```typescript
   * page.add(() => ui.table("companies", companies, {
   *   sortBy: [
   *     { key: "planType", direction: "asc" },
   *     { key: "revenue", direction: "desc" },
   *   ],
   * }));
   * ```
   *
   * Each item in the list should have the following fields:
   *
   * - `key`: The key of the column to sort by.
   * - `direction`: The direction to sort by. Either `asc` or `desc`.
   *
   * @default `[]`
   */
  sortBy?: UI.Table.ColumnSort<TData>[];
  /**
   * Whether the table should be filterable. Defaults to `true` for normal tables, `false` for paginated tables.
   */
  filterable?: boolean;
  /**
   * Define a filtering model to initially filter the table. For example:
   *
   * @example
   * ```typescript
   * page.add(() => ui.table("companies", companies, {
   *   filterable: true,
   *   filterBy: {
   *     "logicOperator": "AND",
   *     "filters": [
   *       {
   *         "key": "name",
   *         "operator": "includes",
   *         "value": "John"
   *       },
   *       {
   *         "key": "age",
   *         "operator": "greaterThan",
   *         "value": 30
   *       }
   *     ]
   *   }
   * }));
   * ```
   *
   * @link
   * Learn more in the {@link https://docs.composehq.com/components/input/table#filtering documentation}.
   */
  filterBy?: UI.Table.AdvancedFilterModel<TData>;
  /**
   * The density of the table rows. Options:
   *
   * - `compact`: 32px row height
   * - `standard`: 40px row height
   * - `comfortable`: 48px row height
   *
   * @default `standard`
   */
  density?: UI.Table.Density;
}

type RequiredTableFields = "id" | "data";
type OptionalTableProperties<TData extends UI.Table.DataRow[]> = Omit<
  TableProperties<TData>,
  RequiredTableFields
>;

const defaultTableProperties: OptionalTableProperties<UI.Table.DataRow[]> = {
  label: null,
  required: true,
  description: null,
  columns: null,
  actions: null,
  minSelections: MULTI_SELECTION_MIN_DEFAULT,
  maxSelections: MULTI_SELECTION_MAX_DEFAULT,
  validate: null,
  style: null,
  allowSelect: false,
  onChange: null,
  initialSelectedRows: [],
  selectionReturnType: UI.Table.SELECTION_RETURN_TYPE.FULL,
  searchable: true,
  paginate: false,
};

function getModelActions(
  actions: TableProperties<UI.Table.DataRow[]>["actions"]
) {
  if (actions === null) {
    return null;
  }

  return actions.map(({ onClick, ...rest }) => ({
    ...rest,
  }));
}

function getHookActions(
  actions: TableProperties<UI.Table.DataRow[]>["actions"]
) {
  if (actions === null) {
    return null;
  }

  return actions.map(({ onClick }) => onClick);
}

function getSearchable(
  searchable: boolean | undefined,
  manuallyPaged: boolean,
  autoPaged: boolean
) {
  // If auto-paginated, then it is never searchable.
  if (autoPaged) {
    return false;
  }

  // If manually paged, then it is searchable only if explicitly set to true.
  if (manuallyPaged) {
    if (searchable === true) {
      return true;
    }

    return false;
  }

  // If not paged and explicitly set, then use the explicitly set value.
  if (searchable !== undefined) {
    return searchable;
  }

  // Otherwise, if not paged, the table is default searchable.
  return true;
}

function getSortable(
  sortable: UI.Table.SortOption | undefined,
  manuallyPaged: boolean,
  autoPaged: boolean
) {
  // If auto-paginated, then it is never sortable.
  if (autoPaged) {
    return UI.Table.SORT_OPTION.DISABLED;
  }

  // If manually paged, then it is sortable only if explicitly set.
  if (manuallyPaged) {
    if (sortable === undefined) {
      return UI.Table.SORT_OPTION.DISABLED;
    }

    return sortable;
  }

  // If not paged and explicitly set, then use the explicitly set value.
  if (sortable !== undefined) {
    return sortable;
  }

  // Otherwise, if not paged, the table is default multi-column sortable.
  return UI.Table.SORT_OPTION.MULTI;
}

function getFilterable(
  filterable: boolean | undefined,
  manuallyPaged: boolean,
  autoPaged: boolean
) {
  // If auto-paginated, then it is never filterable.
  if (autoPaged) {
    return false;
  }

  // If manually paged, then it is filterable only if explicitly set to true.
  if (manuallyPaged) {
    if (filterable === true) {
      return true;
    }

    return false;
  }

  // In the normal case, it's filterable unless explicitly set to false.
  if (filterable === false) {
    return false;
  }

  return true;
}

function getSelectable(
  selectable: boolean | undefined,
  allowSelect: boolean | undefined,
  onChange: UI.Components.InputTable["hooks"]["onSelect"] | null | undefined,
  paginated: boolean,
  selectMode: UI.Table.SelectionReturnType | undefined,
  tableId: UI.BaseGeneric.Id
) {
  const isExplicitlyTrue = selectable === true || allowSelect === true;
  const isExplicitlyFalse = selectable === false || allowSelect === false;

  // If there's an onChange hook, default to `true` unless explicitly set to
  // `false`. Else, default to `false` unless explicitly set to `true`.
  const isSelectable = onChange
    ? isExplicitlyFalse
      ? false
      : true
    : isExplicitlyTrue;

  // If paginated, add a secondary check to ensure that they have the correct
  // selection mode.
  if (paginated) {
    if (selectMode !== UI.Table.SELECTION_RETURN_TYPE.INDEX) {
      // If it's selectable, we assume the user wants row selection and
      // warn them on how to enable it.
      if (isSelectable) {
        console.warn(
          `Paginated tables only support row selection by index. Set \`selectionReturnType: 'index'\` to enable row selection for table with id: ${tableId}.`
        );
      }

      return false;
    }
  }

  return isSelectable;
}

/**
 * Generate a table component that allows users to view and interact with rows of data.
 *
 * ```typescript
 * // Basic table. Will infer columns from the data.
 * const users = database.selectUsers();
 * page.add(() => ui.table("users", users));
 *
 * // Add actions to each row:
 * page.add(() => ui.table("users", users, {
 *   actions: [
 *     { label: "Delete", onClick: (row) => database.deleteUser(row.id) },
 *     { label: "Details", onClick: (row) => page.modal(() => ui.json(row)) },
 *   ],
 * }));
 *
 * // Customize column formatting:
 * page.add(() => ui.table("users", users, {
 *   columns: [
 *     "name",
 *     { key: "annualPay", format: "currency" },
 *     { key: "isActive", format: "boolean" },
 *   ],
 * }));
 * ```
 *
 * And much more...
 *
 * Read the full {@link https://docs.composehq.com/components/input/table Documentation}.
 *
 * @param {string} id - Unique id to identify the table.
 * @param {TData | UI.Table.OnPageChange<TData>} data - Data to display in the table. Should be an array of objects, or a function that returns a subset of the data if paginating.
 * @param {Partial<OptionalTableProperties<TData>>} properties - Optional properties to configure the table.
 * @param {UI.Components.InputTable["model"]["properties"]["columns"]} properties.columns - Manually specify the columns to be displayed in the table. Each item in the list should be either a string that maps to a key in the data, or an object with at least a `key` field and other optional fields. Learn more in the {@link https://docs.composehq.com/components/input/table#columns Docs}
 * @param {UI.Components.InputTable["model"]["properties"]["actions"]} properties.actions - Actions that can be performed on table rows. Each action should be an object with at least a `label` field and an `on_click` handler. Learn more in the {@link https://docs.composehq.com/components/input/table#row-actions Docs}
 * @param {UI.Components.InputTable["model"]["label"]} properties.label - Label to display above the table.
 * @param {UI.Components.InputTable["model"]["description"]} properties.description - Description to display below the label.
 * @param {UI.Components.InputTable["model"]["required"]} properties.required - Whether the table requires at least one row selection (e.g. if part of a form). Defaults to `true`.
 * @param {UI.Components.InputTable["model"]["properties"]["initialSelectedRows"]} properties.initialSelectedRows - List of row indices to select by default. Defaults to empty list.
 * @param {UI.Components.InputTable["hooks"]["validate"]} properties.validate - Custom validation function that is called on selected rows. Return nothing if valid, or a string error message if invalid.
 * @param {UI.Components.InputTable["hooks"]["onSelect"]} properties.onChange - Function to be called when row selection changes.
 * @param {UI.Components.InputTable["model"]["style"]} properties.style - CSS styles object to directly style the table HTML element.
 * @param {UI.Components.InputTable["model"]["minSelections"]} properties.minSelections - Minimum number of rows that must be selected. Defaults to `1`.
 * @param {UI.Components.InputTable["model"]["maxSelections"]} properties.maxSelections - Maximum number of rows that can be selected. Defaults to `1`.
 * @param {UI.Components.InputTable["model"]["selectionReturnType"]} properties.selectionReturnType - How the table should return selected rows. Defaults to `full` (a list of rows). Must be `index` (a list of row indices) if the table is paginated.
 * @param {UI.Components.InputTable["model"]["searchable"]} properties.searchable - Whether the table should be searchable. Defaults to `true` for normal tables, `false` for paginated tables.
 * @param {boolean} properties.filterable - Whether the table should be filterable. Defaults to `true` for normal tables, `false` for paginated tables.
 * @param {UI.Table.AdvancedFilterModel<TData>} properties.filterBy - Define a filtering model to initially filter the table.
 * @param {boolean} properties.paginate - Whether the table should be paginated. Defaults to `false`. Tables with more than 2500 rows will be paginated by default.
 * @param {boolean} properties.selectable - Whether the table should allow row selection. Defaults to `false`, or `true` if `onChange` is provided.
 * @param {UI.Components.InputTable["model"]["density"]} properties.density - The density of the table rows. Options:
 *
 * - `compact`: 32px row height
 * - `standard`: 40px row height
 * - `comfortable`: 48px row height
 *
 * Defaults to `standard`.
 *
 * @param {UI.Components.InputTable["model"]["overflow"]} properties.overflow - The overflow behavior of table cells. Options:
 *
 * - `ellipsis`: Show ellipsis when the text overflows.
 * - `clip`: Clip the text.
 * - `dynamic`: Expand the cell height to fit the content.
 *
 * Defaults to `ellipsis`.
 *
 * @param {UI.Components.InputTable["model"]["sortable"]} properties.sortable - Whether to allow multi-column, single-column, or no sorting. Options:
 *
 * - `true`: Allow multi-column sorting.
 * - `"single"`: Allow single-column sorting.
 * - `false`: Disable sorting.
 *
 * Defaults to `true` for normal tables, `false` for paginated tables.
 *
 * @param {UI.Components.InputTable["model"]["sortBy"]} properties.sortBy - An ordered list of columns to initially sort by. Each item in the list should include `key` and `direction` (either `asc` or `desc`) fields.
 * @returns The configured table component.
 */
function table<TId extends UI.BaseGeneric.Id, TData extends UI.Table.DataRow[]>(
  id: TId,
  data: TData | UI.Table.OnPageChange<TData>,
  properties: Partial<OptionalTableProperties<TData>> = {}
): UI.OutputOmittedComponents.InputTable<TId> {
  const mergedProperties = {
    ...defaultTableProperties,
    ...properties,
  };

  if (
    properties.initialSelectedRows !== undefined &&
    (!Array.isArray(properties.initialSelectedRows) ||
      !properties.initialSelectedRows.every((row) => typeof row === "number"))
  ) {
    throw new Error(
      "initialSelectedRows must be an array of numbers for table"
    );
  }

  if (typeof data !== "function" && !Array.isArray(data)) {
    throw new Error(
      "data must be an array for table or a function for table with pagination"
    );
  }

  const manuallyPaged = typeof data === "function";
  const autoPaged =
    typeof data !== "function" &&
    (data.length > UI.Table.PAGINATION_THRESHOLD ||
      mergedProperties.paginate === true);

  // Perform a shallow copy of the data to make it less likely to be mutated
  // by the user, and thus more likely that any page.update() calls will
  // succeed.
  const shallowCopy = manuallyPaged ? [] : [...data];

  const modelProperties: UI.Components.InputTable["model"]["properties"] = {
    data: shallowCopy,
    columns: mergedProperties.columns,
    minSelections: mergedProperties.minSelections,
    maxSelections: mergedProperties.maxSelections,
    hasOnSelectHook: mergedProperties.onChange !== null,
    actions: getModelActions(mergedProperties.actions),
    v: 3,
    allowSelect: getSelectable(
      properties.selectable,
      properties.allowSelect,
      properties.onChange,
      manuallyPaged || autoPaged,
      properties.selectionReturnType,
      id
    ),
    initialSelectedRows:
      properties.initialSelectedRows === undefined
        ? []
        : properties.initialSelectedRows,
  };

  if (manuallyPaged || autoPaged) {
    modelProperties.paged = true;
  }

  if (
    mergedProperties.selectionReturnType !== UI.Table.SELECTION_RETURN_TYPE.FULL
  ) {
    modelProperties.selectMode = mergedProperties.selectionReturnType;
  }

  if (properties.overflow && properties.overflow !== "ellipsis") {
    modelProperties.overflow = properties.overflow;
  }

  // Only set `notSearchable` if the table is not searchable.
  if (!getSearchable(properties.searchable, manuallyPaged, autoPaged)) {
    modelProperties.notSearchable = true;
  }

  // Only set `sortable` if the table is not multi-column sortable.
  const sortable = getSortable(properties.sortable, manuallyPaged, autoPaged);
  if (sortable !== UI.Table.SORT_OPTION.MULTI) {
    modelProperties.sortable = sortable;
  }

  if (sortable && properties.sortBy) {
    modelProperties.sortBy = properties.sortBy as UI.Table.ColumnSort<
      UI.Table.DataRow[]
    >[];
  }

  const filterable = getFilterable(
    properties.filterable,
    manuallyPaged,
    autoPaged
  );
  if (filterable === false) {
    modelProperties.filterable = false;
  }

  if (filterable && properties.filterBy) {
    modelProperties.filterBy =
      properties.filterBy as UI.Table.AdvancedFilterModel<UI.Table.DataRow[]>;
  }

  if (properties.density) {
    modelProperties.density = properties.density;
  }

  return {
    model: {
      id,
      label: mergedProperties.label,
      description: mergedProperties.description,
      required: mergedProperties.required,
      hasValidateHook: mergedProperties.validate !== null,
      properties: modelProperties,
      style: mergedProperties.style,
    },
    hooks: {
      validate: mergedProperties.validate,
      onSelect: mergedProperties.onChange,
      onRowActions: getHookActions(mergedProperties.actions),
      onPageChange: manuallyPaged
        ? { fn: data, type: UI.Table.PAGINATION_TYPE.MANUAL }
        : autoPaged
          ? { fn: () => shallowCopy, type: UI.Table.PAGINATION_TYPE.AUTO }
          : null,
    },
    type: UI.TYPE.INPUT_TABLE,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

export default table;
