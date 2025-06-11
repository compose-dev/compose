import { StringOnlyKeys } from "../../types";
import * as UI from "../../ui";
import {
  BaseWithInputInteraction,
  MULTI_SELECTION_MIN_DEFAULT,
  MULTI_SELECTION_MAX_DEFAULT,
} from "../base";

type TableOnChangeDataPayload<
  TSRT, // Stands for TSelectionReturnType
  TData extends UI.Table.DataRow[],
> = TSRT extends typeof UI.Table.SELECTION_RETURN_TYPE.ID
  ? (string | number)[]
  : TSRT extends typeof UI.Table.SELECTION_RETURN_TYPE.INDEX
    ? number[]
    : TSRT extends typeof UI.Table.SELECTION_RETURN_TYPE.FULL
      ? TData
      : TSRT extends undefined // Handles case where selectionReturnType is omitted (assuming default behavior implies TData[])
        ? TData
        : // If TSRT is a union (e.g., "id" | "index" | "full"),
          // TypeScript's distributive conditional types will make this resolve to:
          // Array<string | number> | Array<number> | TData[]
          // This is the desired behavior for the 'rows' parameter.
          // The final TData[] acts as a default for "full" or any unhandled case within the union.
          TData;

interface TableProperties<
  TData extends UI.Table.DataRow[],
  TSelectionReturnType extends
    UI.Components.InputTable["model"]["properties"]["selectMode"],
> extends BaseWithInputInteraction<boolean> {
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
  actions: UI.Table.Action<TData>[] | null;
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
  validate: UI.Factory.Nullable<
    UI.Factory.ValidatorCallback<
      TableOnChangeDataPayload<TSelectionReturnType, TData>
    >
  >;
  /**
   * The data to display in the table.
   */
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
   * A function that is called when the user selects or deselects rows. It receives the selected rows as an argument, or the selected row IDs if the `selectionReturnType` parameter is set to `id`.
   */
  onChange: UI.Factory.Nullable<
    UI.Factory.InputValueCallback<
      TableOnChangeDataPayload<TSelectionReturnType, TData>
    >
  >;
  /**
   * A list of row IDs to pre-select when the table is first rendered. Defaults to empty list.
   */
  initialSelectedRows: UI.Components.InputTable["model"]["properties"]["initialSelectedRows"];
  /**
   * The primary key of the table. This should map to a unique, stable identifier field in the table data.
   *
   * Setting this property enables Compose to properly track row selections.
   *
   * Defaults to the row index.
   */
  primaryKey?: StringOnlyKeys<TData[number]>;
  /**
   * How the table should return selected rows to hooks such as `onChange`. Options:
   *
   * - `full`: A list of rows.
   * - `id`: A list of row ids.
   *
   * Defaults to `full`. Must be set to `id` if the table is paginated to enable row selection.
   */
  selectionReturnType: TSelectionReturnType;
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
   * Whether the table should be filterable. Defaults to `true` for normal tables, `false` for paginated tables.
   */
  filterable?: boolean;
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
  /**
   * A list of views that enable the user to quickly switch between different
   * table configurations, such as different column filters, sorting, column
   * pinning, etc.
   *
   * @example
   * ```typescript
   * page.add(() => ui.table("companies", companies, {
   *   views: [
   *     {
   *       label: "Enterprise companies",
   *       filterBy: {
   *         key: "tier",
   *         operator: "is",
   *         value: "enterprise",
   *       },
   *       sortBy: [
   *         { key: "revenue", direction: "desc" },
   *       ],
   *       columns: {
   *         name: {
   *           pinned: "left",
   *         },
   *       },
   *     },
   *   ],
   * }));
   * ```
   *
   * The following properties are configurable for each view:
   *
   * - `label`: The label of the view.
   * - `isDefault`: Whether the table should show this view by default.
   * - `filterBy`: A filtering model to initially filter the table.
   * - `sortBy`: An ordered list of columns to initially sort by.
   * - `searchQuery`: A search query to initially filter the table.
   * - `columns`: A mapping of column keys to configuration options for that column.
   * - `density`: The density of the table rows.
   * - `overflow`: The overflow behavior of table cells.
   */
  views?: UI.Table.View<TData>[];
}

type RequiredTableFields = "id" | "data";
type OptionalTableProperties<
  TData extends UI.Table.DataRow[],
  TSelectionReturnType extends
    UI.Components.InputTable["model"]["properties"]["selectMode"],
> = Omit<TableProperties<TData, TSelectionReturnType>, RequiredTableFields>;

const defaultTableProperties: OptionalTableProperties<
  UI.Table.DataRow[],
  UI.Table.SelectionReturnType
> = {
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
  actions: TableProperties<
    UI.Table.DataRow[],
    UI.Table.SelectionReturnType
  >["actions"]
) {
  if (actions === null) {
    return null;
  }

  return actions.map(({ onClick, ...rest }) => ({
    ...rest,
  }));
}

function getHookActions(
  actions: TableProperties<
    UI.Table.DataRow[],
    UI.Table.SelectionReturnType
  >["actions"]
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

function getSelectable<
  TSelectionReturnType extends
    UI.Components.InputTable["model"]["properties"]["selectMode"],
>(
  selectable: boolean | undefined,
  allowSelect: boolean | undefined,
  onChange: UI.Components.InputTable["hooks"]["onSelect"] | null | undefined,
  paginated: boolean,
  selectMode: TSelectionReturnType,
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
    if (
      selectMode !== UI.Table.SELECTION_RETURN_TYPE.INDEX &&
      selectMode !== UI.Table.SELECTION_RETURN_TYPE.ID
    ) {
      // If it's selectable, we assume the user wants row selection and
      // warn them on how to enable it.
      if (isSelectable) {
        console.warn(
          `Paginated tables only support row selection by id. Set a \`primaryKey\` and specify \`selectionReturnType: 'id'\` to enable row selection for table with id: ${tableId}.`
        );
      }

      return false;
    }
  }

  return isSelectable;
}

function warnAboutSelectMode(
  primaryKey: UI.Components.InputTable["model"]["properties"]["primaryKey"],
  selectMode: UI.Table.SelectionReturnType | undefined,
  tableId: UI.BaseGeneric.Id
) {
  if (
    primaryKey === undefined &&
    selectMode === UI.Table.SELECTION_RETURN_TYPE.ID
  ) {
    console.warn(
      `Selection return type is set to \`id\` but no \`primaryKey\` is set for table with id: ${tableId}. `
    );
  }

  if (selectMode === UI.Table.SELECTION_RETURN_TYPE.INDEX) {
    if (primaryKey !== undefined) {
      console.warn(
        `The \`primaryKey\` property does nothing when the selection return type is \`index\` for table with id: ${tableId}. Set \`selectionReturnType: 'id'\` instead (index is deprecated and may be removed in a future version).`
      );
    } else {
      console.warn(
        `Selection return type of \`index\` is deprecated for table with id: ${tableId}. Set \`selectionReturnType: 'id'\` and specify a \`primaryKey\` to use instead. While index selection is supported for now, it may be removed in a future version. Additionally, ID selection enables proper row selection tracking!`
      );
    }
  }
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
 * @param {UI.Components.InputTable["model"]["properties"]["initialSelectedRows"]} properties.initialSelectedRows - List of row IDs to select by default. Defaults to empty list.
 * @param {UI.Components.InputTable["hooks"]["validate"]} properties.validate - Custom validation function that is called on selected rows. Return nothing if valid, or a string error message if invalid.
 * @param {UI.Components.InputTable["hooks"]["onSelect"]} properties.onChange - Function to be called when row selection changes.
 * @param {UI.Components.InputTable["model"]["style"]} properties.style - CSS styles object to directly style the table HTML element.
 * @param {UI.Components.InputTable["model"]["minSelections"]} properties.minSelections - Minimum number of rows that must be selected. Defaults to `1`.
 * @param {UI.Components.InputTable["model"]["maxSelections"]} properties.maxSelections - Maximum number of rows that can be selected. Defaults to `1`.
 * @param {UI.Components.InputTable["model"]["primaryKey"]} properties.primaryKey - The primary key of the table. Setting this property enables Compose to properly track row selections using the `id` field. Defaults to the row index.
 * @param {UI.Components.InputTable["model"]["selectionReturnType"]} properties.selectionReturnType - How the table should return selected rows. Defaults to `full` (a list of rows). Must be `id` (a list of row ids) if the table is paginated.
 * @param {UI.Components.InputTable["model"]["searchable"]} properties.searchable - Whether the table should be searchable. Defaults to `true` for normal tables, `false` for paginated tables.
 * @param {boolean} properties.filterable - Whether the table should be filterable. Defaults to `true` for normal tables, `false` for paginated tables.
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
 * @param {UI.Components.InputTable["model"]["views"]} properties.views - A list of views that enable the user to quickly switch between different table configurations.
 * @returns The configured table component.
 */
function table<
  TId extends UI.BaseGeneric.Id,
  TData extends UI.Table.DataRow[],
  TSelectionReturnType extends
    UI.Components.InputTable["model"]["properties"]["selectMode"] = undefined,
>(
  id: TId,
  data: TData | UI.Table.OnPageChange<TData>,
  properties: Partial<OptionalTableProperties<TData, TSelectionReturnType>> = {}
): UI.OutputOmittedComponents.InputTable<TId> {
  const mergedProperties = {
    ...defaultTableProperties,
    ...properties,
  };

  if (
    properties.initialSelectedRows !== undefined &&
    (!Array.isArray(properties.initialSelectedRows) ||
      !properties.initialSelectedRows.every(
        (row) => typeof row === "number" || typeof row === "string"
      ))
  ) {
    throw new Error(
      "initialSelectedRows must be an array of row ids (numbers or strings) for table"
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

  const modelProperties: UI.Components.InputTable["model"]["properties"] = {
    data: manuallyPaged ? [] : data,
    columns: mergedProperties.columns,
    minSelections: mergedProperties.minSelections,
    maxSelections: mergedProperties.maxSelections,
    hasOnSelectHook: mergedProperties.onChange !== null,
    actions: getModelActions(mergedProperties.actions),
    v: 3,
    allowSelect: getSelectable<TSelectionReturnType>(
      properties.selectable,
      properties.allowSelect,
      properties.onChange as UI.Components.InputTable["hooks"]["onSelect"],
      manuallyPaged || autoPaged,
      properties.selectionReturnType as TSelectionReturnType,
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

  if (properties.primaryKey !== undefined) {
    modelProperties.primaryKey = properties.primaryKey;
  }

  const filterable = getFilterable(
    properties.filterable,
    manuallyPaged,
    autoPaged
  );
  if (filterable === false) {
    modelProperties.filterable = false;
  }

  if (properties.density) {
    modelProperties.density = properties.density;
  }

  if (properties.views) {
    if (!Array.isArray(properties.views)) {
      throw new Error(
        "views property must be an array of view objects for table with id: " +
          id
      );
    }

    modelProperties.views = properties.views.map((view, idx) => {
      return {
        ...view,
        key: `${idx}_${view.label}`,
      } as UI.Table.ViewInternal<UI.Table.DataRow[]>;
    });
  }

  warnAboutSelectMode(
    properties.primaryKey,
    properties.selectionReturnType,
    id
  );

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
      validate:
        mergedProperties.validate as UI.Components.InputTable["hooks"]["validate"],
      onSelect:
        mergedProperties.onChange as UI.Components.InputTable["hooks"]["onSelect"],
      onRowActions: getHookActions(mergedProperties.actions),
      onPageChange: manuallyPaged
        ? { fn: data, type: UI.Table.PAGINATION_TYPE.MANUAL }
        : autoPaged
          ? { fn: () => data, type: UI.Table.PAGINATION_TYPE.AUTO }
          : null,
    },
    type: UI.TYPE.INPUT_TABLE,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

export default table;
