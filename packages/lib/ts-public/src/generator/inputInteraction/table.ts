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
   * Whether the table should allow row selection. Defaults to `true`.
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
   * Whether the table should be searchable. Defaults to `true`, except for paginated tables, which must handle search server-side. See the docs for more info.
   */
  searchable: boolean;
  /**
   * Whether the table should be paginated server-side. Enabling this can improve performance by only loading a subset of the data at a time. Defaults to `false`. Tables with more than 2500 rows will be paginated by default.
   */
  paginate: boolean;
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
  allowSelect: true,
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
 * @param {UI.Components.InputTable["model"]["properties"]["allowSelect"]} properties.allowSelect - Whether the table should allow row selection. Defaults to `true`.
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
 * @param {UI.Components.InputTable["model"]["searchable"]} properties.searchable - Whether the table should be searchable. Defaults to `true`.
 * @param {boolean} properties.paginate - Whether the table should be paginated. Defaults to `false`. Tables with more than 2500 rows will be paginated by default.
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
    !Array.isArray(mergedProperties.initialSelectedRows) ||
    !mergedProperties.initialSelectedRows.every(
      (row) => typeof row === "number"
    )
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
    allowSelect: mergedProperties.allowSelect,
    hasOnSelectHook: mergedProperties.onChange !== null,
    actions: getModelActions(mergedProperties.actions),
    initialSelectedRows: mergedProperties.initialSelectedRows,
    v: 2,
  };

  if (autoPaged || mergedProperties.searchable === false) {
    modelProperties.notSearchable = true;
  }

  if (manuallyPaged || autoPaged) {
    modelProperties.paged = true;
  }

  if (
    mergedProperties.selectionReturnType !== UI.Table.SELECTION_RETURN_TYPE.FULL
  ) {
    modelProperties.selectMode = mergedProperties.selectionReturnType;
  }

  // Paged tables only support row selection by index.
  if (
    (manuallyPaged || autoPaged) &&
    modelProperties.selectMode !== UI.Table.SELECTION_RETURN_TYPE.INDEX
  ) {
    modelProperties.allowSelect = false;
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
