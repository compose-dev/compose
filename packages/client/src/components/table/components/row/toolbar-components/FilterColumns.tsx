import Button from "~/components/button";
import Icon from "~/components/icon";
import {
  GlobalFiltering,
  TanStackTable,
  FormattedTableRow,
} from "~/components/table/utils";
import { classNames } from "~/utils/classNames";
import { Popover } from "~/components/popover";
import {
  DateInput,
  DateTimeInput,
  NumberInput,
  TextInput,
} from "~/components/input";
import { ComboboxSingle } from "~/components/combobox";
import { UI } from "@composehq/ts-public";
import { v4 as uuid } from "uuid";
import DropdownMenu from "~/components/dropdown-menu";
import { Listbox } from "~/components/listbox";
import { u } from "@compose/ts";
import { useCallback, useMemo } from "react";
import { Column } from "@tanstack/react-table";
import * as Toolbar from "./Toolbar";

function getTagOptionsForColumn(column: Column<FormattedTableRow> | undefined) {
  if (!column || column.columnDef.meta?.format !== UI.Table.COLUMN_FORMAT.tag) {
    return [];
  }

  const tagColors = column.columnDef.meta?.tagColors;

  if (!tagColors) {
    return [];
  }

  try {
    return Object.values(tagColors).map((tagColor) => tagColor.originalValue);
  } catch (e) {
    return [];
  }
}

function createDefaultClause(): GlobalFiltering.EditableAdvancedFilterClause {
  return {
    key: null,
    operator: UI.Table.COLUMN_FILTER_OPERATOR.IS,
    value: null,
    id: uuid(),
  };
}

function createDefaultGroup(): GlobalFiltering.EditableAdvancedFilterGroup {
  return {
    logicOperator: UI.Table.COLUMN_FILTER_LOGIC_OPERATOR.AND,
    filters: [createDefaultClause()],
    id: uuid(),
  };
}

function stringToNumber(internalValue: string | null) {
  if (internalValue === null) {
    return null;
  }

  const numericValue = Number.parseFloat(internalValue);

  if (Number.isNaN(numericValue)) {
    return null;
  }

  return numericValue;
}

function FilterClauseRow({
  clause,
  path,
  table,
  onUpdateFilterClauseOperator,
  onUpdateFilterClauseValue,
  onUpdateFilterClauseKey,
  onRemoveFilterNode,
  disabled,
}: {
  clause: GlobalFiltering.EditableAdvancedFilterClause;
  path: string[];
  table: TanStackTable;
  onUpdateFilterClauseOperator: (
    path: string[],
    operator: UI.Table.ColumnFilterOperator
  ) => void;
  onUpdateFilterClauseValue: (path: string[], value: unknown) => void;
  onUpdateFilterClauseKey: (path: string[], key: string | null) => void;
  onRemoveFilterNode: (path: string[]) => void;
  disabled: boolean;
}) {
  const columnOptions = table
    .getAllColumns()
    .filter((col) => col.columnDef.meta?.isDataColumn)
    .map((col) => ({
      label: col.columnDef.meta?.label ?? "Unknown",
      value: col.id,
      format: col.columnDef.meta?.format,
    }));

  const column = table.getAllColumns().find((col) => col.id === clause.key);

  const columnFormat = column?.columnDef.meta?.format;

  const operatorOptions =
    GlobalFiltering.COLUMN_FORMAT_TO_FILTER_OPERATORS[
      columnFormat ?? UI.Table.COLUMN_FORMAT.string
    ];

  const operatorType = GlobalFiltering.getOperatorInputType(
    clause.operator,
    columnFormat
  );

  const labelLength =
    GlobalFiltering.COLUMN_FORMAT_TO_LABEL_LENGTH[
      columnFormat ?? UI.Table.COLUMN_FORMAT.string
    ];
  const tagOptions = getTagOptionsForColumn(column);

  return (
    <div className="flex flex-row items-start space-x-2 w-full">
      <ComboboxSingle
        options={columnOptions}
        value={clause.key}
        setValue={(val) => {
          onUpdateFilterClauseKey(path, val);
        }}
        id={`filter-col-${path.join("-")}`}
        label={null}
        disabled={disabled}
        rootClassName="w-1/3 min-w-36 flex-1"
        optionsBoxClassName="min-w-60"
      />
      <Listbox.Single
        options={operatorOptions.map((op) => ({
          label:
            labelLength === "short"
              ? GlobalFiltering.COLUMN_FILTER_OPERATOR_TO_SHORT_LABEL[op]
              : GlobalFiltering.COLUMN_FILTER_OPERATOR_TO_LABEL[op],
          value: op,
        }))}
        value={clause.operator}
        setValue={(val) => {
          if (val !== null) {
            onUpdateFilterClauseOperator(path, val);
          }
        }}
        id={`filter-op-${path.join("-")}`}
        label={null}
        disabled={!clause.key || disabled} // Disable if no column selected
        rootClassName={classNames("w-1/4 min-w-32 flex-1", {
          "w-2/3":
            operatorType === GlobalFiltering.OPERATOR_INPUT_TYPE.NO_INPUT,
        })}
        optionsBoxClassName="min-w-56"
      />
      {operatorType === GlobalFiltering.OPERATOR_INPUT_TYPE.TEXT && (
        <TextInput
          value={clause.value}
          setValue={(val) => onUpdateFilterClauseValue(path, val)}
          label={null}
          disabled={disabled}
          rootClassName="w-1/3 min-w-36 flex-1"
          placeholder="Enter value"
        />
      )}
      {operatorType === GlobalFiltering.OPERATOR_INPUT_TYPE.NUMBER && (
        <NumberInput
          value={clause.value}
          setValue={(val) =>
            onUpdateFilterClauseValue(path, stringToNumber(val))
          }
          label={null}
          disabled={disabled}
          rootClassName="w-1/3 min-w-36 flex-1"
          placeholder="Enter value"
        />
      )}
      {operatorType === GlobalFiltering.OPERATOR_INPUT_TYPE.DATE_INPUT && (
        <DateInput
          value={
            clause.value === null ? null : u.date.toDateOnlyModel(clause.value)
          }
          setValue={(val) =>
            onUpdateFilterClauseValue(
              path,
              val === null ? null : u.date.fromDateOnlyModel(val)
            )
          }
          label={null}
          disabled={disabled}
        />
      )}
      {operatorType === GlobalFiltering.OPERATOR_INPUT_TYPE.DATE_TIME_INPUT && (
        <DateTimeInput
          value={
            clause.value === null ? null : u.date.toDateTimeModel(clause.value)
          }
          setValue={(val) =>
            onUpdateFilterClauseValue(
              path,
              val === null ? null : u.date.fromDateTimeModel(val)
            )
          }
          label={null}
          disabled={disabled}
        />
      )}
      {operatorType === GlobalFiltering.OPERATOR_INPUT_TYPE.MULTI_SELECT && (
        <Listbox.Multi
          options={tagOptions.map((op) => ({
            label: op.toString(),
            value: op,
          }))}
          value={clause.value === null ? [] : clause.value}
          setValue={(val) =>
            onUpdateFilterClauseValue(path, val.length === 0 ? null : val)
          }
          id={`filter-op-${path.join("-")}`}
          label={null}
          disabled={disabled}
          rootClassName="w-1/3 min-w-36 flex-1"
          optionsBoxClassName="min-w-56"
        />
      )}
      {operatorType === GlobalFiltering.OPERATOR_INPUT_TYPE.BOOLEAN_SELECT && (
        <Listbox.Single
          options={[
            { label: "True", value: true },
            { label: "False", value: false },
          ]}
          value={clause.value}
          setValue={(val) => onUpdateFilterClauseValue(path, val)}
          id={`filter-op-${path.join("-")}`}
          label={null}
          disabled={disabled}
          rootClassName="w-1/3 min-w-36 flex-1"
          optionsBoxClassName="min-w-56"
        />
      )}
      <div className="mt-1">
        <Button
          variant="ghost"
          onClick={() => onRemoveFilterNode(path)}
          disabled={disabled}
        >
          <Icon name="x" size="0.625" color="brand-neutral-2" />
        </Button>
      </div>
    </div>
  );
}

function FilterGroupSection({
  group,
  path,
  table,
  onUpdateFilterGroupLogicOperator,
  onAddFilterClauseToGroup,
  onAddFilterGroupToGroup,
  onUpdateFilterClauseOperator,
  onUpdateFilterClauseValue,
  onUpdateFilterClauseKey,
  onRemoveFilterNode,
  disabled,
}: {
  group: GlobalFiltering.EditableAdvancedFilterGroup;
  path: string[];
  table: TanStackTable;
  onUpdateFilterGroupLogicOperator: (
    path: string[],
    logicOperator: UI.Table.ColumnFilterLogicOperator
  ) => void;
  onAddFilterClauseToGroup: (path: string[]) => void;
  onAddFilterGroupToGroup: (path: string[]) => void;
  onUpdateFilterClauseOperator: (
    path: string[],
    operator: UI.Table.ColumnFilterOperator
  ) => void;
  onUpdateFilterClauseValue: (path: string[], value: unknown) => void;
  onUpdateFilterClauseKey: (path: string[], key: string | null) => void;
  onRemoveFilterNode: (path: string[]) => void;
  disabled: boolean;
}) {
  return (
    <div
      className={classNames("min-w-fit w-full", {
        "p-4 border border-brand-neutral rounded-brand bg-brand-page-inverted-5":
          path.length > 1,
      })}
    >
      <div
        className={classNames(
          "flex flex-col space-y-4 flex-1 overflow-x-visible min-w-[32rem] w-full"
        )}
      >
        {group.filters.map((filter, index) => (
          <div
            key={index}
            className={classNames(
              "flex flex-row items-start gap-x-2 self-stretch"
            )}
          >
            <div
              className={"w-16 flex-shrink-0 flex items-center justify-center"}
            >
              {index === 0 && (
                <p className="font-medium mt-1.5 text-sm">Where</p>
              )}
              {index === 1 && (
                <DropdownMenu
                  labelVariant="ghost"
                  label={
                    <div
                      className={classNames(
                        "flex flex-row items-center justify-around border border-brand-neutral rounded-brand p-1.5 bg-brand-io w-16 relative",
                        {
                          "opacity-50 cursor-not-allowed pointer-events-none":
                            disabled,
                        }
                      )}
                    >
                      <p className="text-sm">
                        {
                          GlobalFiltering.COLUMN_FILTER_LOGIC_OPERATOR_TO_LABEL[
                            group.logicOperator
                          ]
                        }
                      </p>
                      <Icon
                        name="chevron-down"
                        color="brand-neutral-2"
                        size="0.75"
                      />
                    </div>
                  }
                  dropdownAnchor="bottom start"
                  options={[
                    {
                      label:
                        GlobalFiltering.COLUMN_FILTER_LOGIC_OPERATOR_TO_LABEL[
                          UI.Table.COLUMN_FILTER_LOGIC_OPERATOR.AND
                        ],
                      onClick: () =>
                        onUpdateFilterGroupLogicOperator(
                          path,
                          UI.Table.COLUMN_FILTER_LOGIC_OPERATOR.AND
                        ),
                    },
                    {
                      label:
                        GlobalFiltering.COLUMN_FILTER_LOGIC_OPERATOR_TO_LABEL[
                          UI.Table.COLUMN_FILTER_LOGIC_OPERATOR.OR
                        ],
                      onClick: () =>
                        onUpdateFilterGroupLogicOperator(
                          path,
                          UI.Table.COLUMN_FILTER_LOGIC_OPERATOR.OR
                        ),
                    },
                  ]}
                />
              )}
              {index >= 2 && (
                <p className="font-medium mt-1.5 text-sm">
                  {group.logicOperator.toLocaleUpperCase()}
                </p>
              )}
            </div>
            <div className="flex-grow min-w-0">
              <FilterNode
                key={filter.id}
                node={filter}
                path={[...path, filter.id]}
                table={table}
                onUpdateFilterGroupLogicOperator={
                  onUpdateFilterGroupLogicOperator
                }
                onAddFilterClauseToGroup={onAddFilterClauseToGroup}
                onAddFilterGroupToGroup={onAddFilterGroupToGroup}
                onUpdateFilterClauseOperator={onUpdateFilterClauseOperator}
                onUpdateFilterClauseValue={onUpdateFilterClauseValue}
                onUpdateFilterClauseKey={onUpdateFilterClauseKey}
                onRemoveFilterNode={onRemoveFilterNode}
                disabled={disabled}
              />
            </div>
          </div>
        ))}
        {path.length > 1 && (
          <div>
            <DropdownMenu
              labelVariant="ghost"
              label={
                <div
                  className={classNames(
                    "flex flex-row items-center space-x-1 border border-brand-neutral rounded-brand p-1.5 px-2 bg-brand-io",
                    {
                      "opacity-50 cursor-not-allowed pointer-events-none":
                        disabled,
                    }
                  )}
                >
                  <Icon name="plus" />
                  <p className="text-sm">Add filter</p>
                </div>
              }
              dropdownAnchor="bottom start"
              options={[
                {
                  label: "Add filter rule",
                  onClick: () => onAddFilterClauseToGroup(path),
                },
                {
                  label: "Add filter group",
                  onClick: () => onAddFilterGroupToGroup(path),
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Recursive component to render either a Clause or a Group
function FilterNode({
  node,
  path,
  table,
  onUpdateFilterClauseOperator,
  onUpdateFilterClauseValue,
  onUpdateFilterClauseKey,
  onUpdateFilterGroupLogicOperator,
  onAddFilterClauseToGroup,
  onAddFilterGroupToGroup,
  onRemoveFilterNode,
  disabled,
}: {
  node: NonNullable<GlobalFiltering.EditableAdvancedFilterModel>;
  path: string[];
  table: TanStackTable;
  onUpdateFilterClauseOperator: (
    path: string[],
    operator: UI.Table.ColumnFilterOperator
  ) => void;
  onUpdateFilterClauseValue: (path: string[], value: unknown) => void;
  onUpdateFilterClauseKey: (path: string[], key: string | null) => void;
  onUpdateFilterGroupLogicOperator: (
    path: string[],
    logicOperator: UI.Table.ColumnFilterLogicOperator
  ) => void;
  onAddFilterClauseToGroup: (path: string[]) => void;
  onAddFilterGroupToGroup: (path: string[]) => void;
  onRemoveFilterNode: (path: string[]) => void;
  disabled: boolean;
}) {
  if ("logicOperator" in node) {
    return (
      <FilterGroupSection
        group={node}
        path={path}
        table={table}
        onUpdateFilterGroupLogicOperator={onUpdateFilterGroupLogicOperator}
        onAddFilterClauseToGroup={onAddFilterClauseToGroup}
        onAddFilterGroupToGroup={onAddFilterGroupToGroup}
        onUpdateFilterClauseOperator={onUpdateFilterClauseOperator}
        onUpdateFilterClauseValue={onUpdateFilterClauseValue}
        onUpdateFilterClauseKey={onUpdateFilterClauseKey}
        onRemoveFilterNode={onRemoveFilterNode}
        disabled={disabled}
      />
    );
  } else {
    return (
      <FilterClauseRow
        clause={node}
        path={path}
        table={table}
        onUpdateFilterClauseOperator={onUpdateFilterClauseOperator}
        onUpdateFilterClauseValue={onUpdateFilterClauseValue}
        onUpdateFilterClauseKey={onUpdateFilterClauseKey}
        onRemoveFilterNode={onRemoveFilterNode}
        disabled={disabled}
      />
    );
  }
}

// The main panel content inside the popover
function FilterColumnsPanel({
  table,
  filterModel,
  setFilterModel,
  resetFilterModel,
  className = "",
  paginated,
  isServerValueStale,
  loading,
  onTablePageChangeHook,
  appliedAndDisplayFilterModelsAreEqual,
}: {
  table: TanStackTable;
  filterModel: ReturnType<typeof GlobalFiltering.useAdvancedFiltering>["draft"];
  setFilterModel: ReturnType<
    typeof GlobalFiltering.useAdvancedFiltering
  >["set"];
  resetFilterModel: ReturnType<
    typeof GlobalFiltering.useAdvancedFiltering
  >["reset"];
  className?: string;
  paginated: boolean;
  isServerValueStale: boolean;
  loading: UI.Stale.Option;
  onTablePageChangeHook: () => void;
  appliedAndDisplayFilterModelsAreEqual: boolean;
}) {
  const handleAddTopLevelFilter = useCallback(() => {
    if (filterModel === null) {
      setFilterModel(createDefaultGroup());
    } else {
      if ("logicOperator" in filterModel) {
        setFilterModel({
          ...filterModel,
          filters: [...filterModel.filters, createDefaultClause()],
        });
      } else {
        setFilterModel({
          logicOperator: UI.Table.COLUMN_FILTER_LOGIC_OPERATOR.AND,
          filters: [filterModel, createDefaultClause()],
          id: uuid(),
        });
      }
    }
  }, [filterModel, setFilterModel]);

  const handleAddTopLevelGroup = useCallback(() => {
    if (filterModel === null) {
      const group = createDefaultGroup();
      group.filters = [createDefaultGroup()];
      setFilterModel(group);
    } else if ("logicOperator" in filterModel) {
      setFilterModel({
        ...filterModel,
        filters: [...filterModel.filters, createDefaultGroup()],
      });
    } else {
      setFilterModel({
        logicOperator: UI.Table.COLUMN_FILTER_LOGIC_OPERATOR.AND,
        filters: [filterModel, createDefaultGroup()],
        id: uuid(),
      });
    }
  }, [filterModel, setFilterModel]);

  const updateFilterClauseOperator = useCallback(
    (path: string[], operator: UI.Table.ColumnFilterOperator) => {
      const copy = GlobalFiltering.copyAdvancedFilterModel(filterModel);
      const node = GlobalFiltering.findFilterModelNode(copy, path);

      if (node === null || "logicOperator" in node) {
        return;
      }

      node.operator = operator;

      if (
        operator === UI.Table.COLUMN_FILTER_OPERATOR.IS_NOT_EMPTY ||
        operator === UI.Table.COLUMN_FILTER_OPERATOR.IS_EMPTY
      ) {
        node.value = null;
      }

      setFilterModel(copy);
    },
    [filterModel, setFilterModel]
  );

  const updateFilterClauseValue = useCallback(
    (path: string[], value: unknown) => {
      const copy = GlobalFiltering.copyAdvancedFilterModel(filterModel);
      const node = GlobalFiltering.findFilterModelNode(copy, path);

      if (node === null || "logicOperator" in node) {
        return;
      }

      node.value = value;

      setFilterModel(copy);
    },
    [filterModel, setFilterModel]
  );

  const updateFilterClauseKey = useCallback(
    (path: string[], key: string | null) => {
      const copy = GlobalFiltering.copyAdvancedFilterModel(filterModel);
      const node = GlobalFiltering.findFilterModelNode(copy, path);

      if (node === null || "logicOperator" in node) {
        return;
      }

      const allColumns = table.getAllColumns();
      const column = allColumns.find((col) => col.id === key);
      const oldColumn = allColumns.find((col) => col.id === node.key);

      const validOperatorsForColumn =
        GlobalFiltering.COLUMN_FORMAT_TO_FILTER_OPERATORS[
          column?.columnDef.meta?.format ?? UI.Table.COLUMN_FORMAT.string
        ];

      let newOperator = node.operator;
      if (!validOperatorsForColumn.includes(node.operator)) {
        newOperator = validOperatorsForColumn[0];
      }

      const oldOperatorInputType = GlobalFiltering.getOperatorInputType(
        node.operator,
        oldColumn?.columnDef.meta?.format
      );
      const newOperatorInputType = GlobalFiltering.getOperatorInputType(
        node.operator,
        column?.columnDef.meta?.format
      );

      let newValue = node.value;
      // Wipe the value in the following cases:
      // - The operator input type has changed.
      // - The column format is tag, since it's likely the new column
      // has different tag options than the old column.
      if (oldOperatorInputType !== newOperatorInputType) {
        newValue = null;
      } else if (
        newOperatorInputType ===
        GlobalFiltering.OPERATOR_INPUT_TYPE.MULTI_SELECT
      ) {
        newValue = null;
      }

      node.key = key;
      node.operator = newOperator;
      node.value = newValue;
      setFilterModel(copy);
    },
    [table, filterModel, setFilterModel]
  );

  const updateFilterGroupLogicOperator = useCallback(
    (path: string[], logicOperator: UI.Table.ColumnFilterLogicOperator) => {
      const copy = GlobalFiltering.copyAdvancedFilterModel(filterModel);
      const node = GlobalFiltering.findFilterModelNode(copy, path);

      if (node === null || "logicOperator" in node === false) {
        return;
      }

      node.logicOperator = logicOperator;

      setFilterModel(copy);
    },
    [filterModel, setFilterModel]
  );

  const addFilterClauseToGroup = useCallback(
    (path: string[]) => {
      const copy = GlobalFiltering.copyAdvancedFilterModel(filterModel);
      const node = GlobalFiltering.findFilterModelNode(copy, path);

      if (node === null || "logicOperator" in node === false) {
        return;
      }

      node.filters.push(createDefaultClause());

      setFilterModel(copy);
    },
    [filterModel, setFilterModel]
  );

  const addFilterGroupToGroup = useCallback(
    (path: string[]) => {
      const copy = GlobalFiltering.copyAdvancedFilterModel(filterModel);
      const node = GlobalFiltering.findFilterModelNode(copy, path);

      if (node === null || "logicOperator" in node === false) {
        return;
      }

      node.filters.push(createDefaultGroup());
      setFilterModel(copy);
    },
    [filterModel, setFilterModel]
  );

  const onRemoveFilterNode = useCallback(
    (path: string[]) => {
      if (path.length === 1) {
        setFilterModel(null);
      } else {
        const copy = GlobalFiltering.copyAdvancedFilterModel(filterModel);
        const parentNode = GlobalFiltering.findFilterModelNode(
          copy,
          path.slice(0, -1)
        );

        if (parentNode === null || "logicOperator" in parentNode === false) {
          return;
        }

        parentNode.filters = parentNode.filters.filter(
          (filter) => filter.id !== path[path.length - 1]
        );

        if (parentNode.filters.length === 0) {
          onRemoveFilterNode(path.slice(0, -1));
          return;
        }

        setFilterModel(copy);
      }
    },
    [filterModel, setFilterModel]
  );

  return (
    <div className={classNames("flex flex-col space-y-4", className)}>
      <div className="flex justify-between items-center">
        <Toolbar.Header loading={loading}>Filter by</Toolbar.Header>
        <div className="flex flex-row gap-x-2">
          <Button
            variant="ghost"
            className="text-sm text-brand-neutral-2 hover:text-brand-neutral"
            onClick={() => {
              resetFilterModel();
              if (paginated) {
                onTablePageChangeHook();
              }
            }}
            disabled={
              !isServerValueStale || loading === UI.Stale.OPTION.UPDATE_DISABLED
            }
          >
            Reset to default
          </Button>
          {paginated && (
            <Button
              variant="primary"
              onClick={() => {
                if (paginated) {
                  onTablePageChangeHook();
                }
              }}
              size="sm"
              className="py-1"
              disabled={
                !isServerValueStale ||
                loading === UI.Stale.OPTION.UPDATE_DISABLED ||
                !appliedAndDisplayFilterModelsAreEqual
              }
            >
              Apply filters
            </Button>
          )}
        </div>
      </div>
      {filterModel !== null && (
        <div
          className="flex flex-col space-y-4 overflow-x-auto pb-4 pt-1 -mt-1 -mx-4 px-4"
          style={{
            scrollbarWidth: "thin",
          }}
        >
          <FilterNode
            node={filterModel}
            path={[filterModel.id]} // Root path
            table={table}
            onUpdateFilterClauseOperator={updateFilterClauseOperator}
            onUpdateFilterClauseValue={updateFilterClauseValue}
            onUpdateFilterClauseKey={updateFilterClauseKey}
            onUpdateFilterGroupLogicOperator={updateFilterGroupLogicOperator}
            onAddFilterClauseToGroup={addFilterClauseToGroup}
            onAddFilterGroupToGroup={addFilterGroupToGroup}
            onRemoveFilterNode={onRemoveFilterNode}
            disabled={loading === UI.Stale.OPTION.UPDATE_DISABLED}
          />
        </div>
      )}
      <div>
        <DropdownMenu
          labelVariant="ghost"
          label={
            <div
              className={classNames(
                "flex flex-row items-center space-x-1 border border-brand-neutral rounded-brand p-1.5 px-2 bg-brand-io",
                {
                  "opacity-50 cursor-not-allowed pointer-events-none":
                    loading === UI.Stale.OPTION.UPDATE_DISABLED,
                }
              )}
            >
              <Icon name="plus" />
              <p className="text-sm">Add filter</p>
            </div>
          }
          dropdownAnchor="bottom start"
          options={[
            {
              label: "Add filter rule",
              onClick: () => handleAddTopLevelFilter(),
            },
            {
              label: "Add filter group",
              onClick: () => handleAddTopLevelGroup(),
            },
          ]}
        />
      </div>
    </div>
  );
}

function FilterColumnsPopover({
  table,
  filterModel,
  setFilterModel,
  resetFilterModel,
  filterable,
  paginated,
  isServerValueStale,
  onTablePageChangeHook,
  loading,
  appliedFilterModel,
}: {
  table: TanStackTable;
  filterModel: ReturnType<typeof GlobalFiltering.useAdvancedFiltering>["draft"];
  setFilterModel: ReturnType<
    typeof GlobalFiltering.useAdvancedFiltering
  >["set"];
  resetFilterModel: ReturnType<
    typeof GlobalFiltering.useAdvancedFiltering
  >["reset"];
  filterable: boolean;
  paginated: boolean;
  isServerValueStale: boolean;
  loading: UI.Stale.Option;
  onTablePageChangeHook: () => void;
  appliedFilterModel: ReturnType<
    typeof GlobalFiltering.useAdvancedFiltering
  >["applied"];
}) {
  const filterTooltipContent = useMemo(() => {
    if (filterModel !== null) {
      return "Filters active";
    }
    return "Filter";
  }, [filterModel]);

  const appliedAndDisplayFilterModelsAreEqual = useMemo(() => {
    // If not paginated, always just return true since we only
    // use this variable to disable the "apply filters" button
    // when the two are not equal.
    if (!paginated) {
      return true;
    }

    return GlobalFiltering.advancedFilterModelValuesAreEqual(
      appliedFilterModel,
      filterModel
    );
  }, [appliedFilterModel, filterModel, paginated]);

  if (!filterable) {
    return null;
  }

  return (
    <Popover.Root>
      <Popover.Trigger>
        <div
          data-tooltip-id="top-tooltip-offset4"
          data-tooltip-content={filterTooltipContent}
          data-tooltip-class-name="hidden sm:block"
        >
          <Icon
            name="filter" // Using a generic filter icon
            color={filterModel !== null ? "brand-primary" : "brand-neutral-2"}
          />
        </div>
      </Popover.Trigger>
      <Popover.Panel>
        <FilterColumnsPanel
          table={table}
          filterModel={filterModel}
          setFilterModel={setFilterModel}
          resetFilterModel={resetFilterModel}
          className="w-[40rem]" // Adjust width as needed
          paginated={paginated}
          isServerValueStale={isServerValueStale}
          loading={loading}
          onTablePageChangeHook={onTablePageChangeHook}
          appliedAndDisplayFilterModelsAreEqual={
            appliedAndDisplayFilterModelsAreEqual
          }
        />
      </Popover.Panel>
    </Popover.Root>
  );
}

export { FilterColumnsPopover, FilterColumnsPanel };
