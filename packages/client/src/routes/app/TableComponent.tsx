import { UI, u as uPub } from "@composehq/ts-public";
import { appStore } from "~/utils/appStore";
import Table from "~/components/table";
import { useCallback, useMemo } from "react";
import { IOComponent } from "~/components/io-component";
import { useWSContext } from "~/utils/wsContext";
import { BrowserToServerEvent } from "@compose/ts";
import { classNames } from "~/utils/classNames";

function guessColumns(
  data: UI.Components.InputTable["model"]["properties"]["data"],
  columns: UI.Components.InputTable["model"]["properties"]["columns"],
  defaultOverflow: NonNullable<
    UI.Components.InputTable["model"]["properties"]["overflow"]
  >
): React.ComponentProps<typeof Table.Root>["columns"] {
  if (data.length === 0) {
    return [];
  }

  // If columns are explicitly set, use them. We'll use whatever is
  // explicitly set and infer whatever is not.
  if (columns !== null && columns !== undefined && Array.isArray(columns)) {
    return columns.map((column) => {
      const key = typeof column === "string" ? column : column.key;

      const originalKey =
        typeof column === "string"
          ? column
          : column.original
            ? column.original
            : column.key;

      const label =
        typeof column === "string"
          ? uPub.string.prettifyKey(key)
          : (column.label ?? uPub.string.prettifyKey(originalKey));

      const format =
        typeof column === "string"
          ? Table.guessColumnFormat(data, key)
          : (column.format ?? Table.guessColumnFormat(data, key));

      const tagColors =
        format === UI.Table.COLUMN_FORMAT.tag
          ? Table.guessTagColors(
              typeof column === "string" ? {} : (column.tagColors ?? {}),
              data,
              key
            )
          : {};

      const width =
        typeof column === "string" ? undefined : (column.width ?? undefined);

      const overflow =
        typeof column === "string"
          ? defaultOverflow
          : (column.overflow ?? defaultOverflow);

      const hidden =
        typeof column === "string" ? false : (column.hidden ?? false);

      return {
        id: key,
        accessorKey: key,
        label,
        format,
        width,
        tagColors,
        overflow,
        hidden,
        original: typeof column === "string" ? undefined : column.original,
      };
    });
  }

  const keys = Object.keys(data[0]);

  return keys.map((key) => ({
    id: key,
    label: uPub.string.prettifyKey(key),
    accessorKey: key,
    format: Table.guessColumnFormat(data, key),
    tagColors: {},
    overflow: defaultOverflow,
    hidden: false,
    original: key,
  }));
}

export default function TableComponent({
  componentId,
  renderId,
  environmentId,
  hasError = false,
  errorMessage = null,
  disabled = false,
}: {
  componentId: string;
  renderId: string;
  environmentId: string | null;
  hasError?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
}) {
  const { sendWSJsonMessage } = useWSContext();

  const component = appStore.use(
    (state) =>
      state.flattenedModel[renderId][componentId] as Extract<
        appStore.FrontendComponentModel.All,
        { type: typeof UI.TYPE.INPUT_TABLE }
      >
  );

  const componentOutput = appStore.use(
    (state) =>
      state.flattenedOutput[renderId][componentId] as Extract<
        appStore.FrontendComponentOutput.All,
        { type: typeof UI.TYPE.INPUT_TABLE }
      >
  );

  const componentLoading = appStore.use((state) => {
    return state.stale[appStore.getStaleStateKey({ renderId, componentId })];
  });

  const dispatch = appStore.use((state) => state.dispatch);
  const executionId = appStore.use((state) => state.executionId);

  const onTableRowActionHook = useCallback(
    (rowIdx: number, actionIdx: number) => {
      if (!executionId || !environmentId) {
        return;
      }

      if (component.type !== UI.TYPE.INPUT_TABLE) {
        return;
      }

      if (component.model.properties.actions === null) {
        return;
      }

      const tableVersion = component.model.properties.v || 1;

      const correctedIdx = rowIdx + (component.model.properties.offset ?? 0);

      sendWSJsonMessage(
        {
          type: BrowserToServerEvent.WS.TYPE.ON_TABLE_ROW_ACTION_HOOK,
          componentId,
          renderId,
          executionId,
          actionIdx,
          value:
            tableVersion > 1
              ? correctedIdx
              : component.model.properties.data[correctedIdx],
        },
        environmentId
      );
    },
    [
      component.model.properties.data,
      component.model.properties.actions,
      component.model.properties.v,
      component.model.properties.offset,
      component.type,
      componentId,
      environmentId,
      executionId,
      renderId,
      sendWSJsonMessage,
    ]
  );

  const onTablePageChangeHook = useCallback(
    (
      searchQuery: string | null,
      offset: number,
      pageSize: number,
      sortBy: UI.Table.ColumnSort<UI.Table.DataRow[]>[]
    ) => {
      if (!executionId || !environmentId) {
        return;
      }

      sendWSJsonMessage(
        {
          type: BrowserToServerEvent.WS.TYPE.ON_TABLE_PAGE_CHANGE_HOOK,
          componentId,
          renderId,
          executionId,
          offset,
          searchQuery,
          sortBy,
          pageSize,
        },
        environmentId
      );

      dispatch({
        type: appStore.EVENT_TYPE.UPDATE_COMPONENT_STALE_STATE,
        properties: {
          componentId,
          renderId,
          stale: UI.Stale.OPTION.UPDATE_DISABLED,
        },
      });
    },
    [
      componentId,
      environmentId,
      executionId,
      renderId,
      sendWSJsonMessage,
      dispatch,
    ]
  );

  const columns = useMemo(() => {
    let cols: React.ComponentProps<typeof Table.Root>["columns"] = [];

    // The default overflow behavior for columns. First, try to use the
    // user provided overflow behavior. If that's not set, use ellipsis
    // for v3+ and dynamic for v2 and below.
    const defaultOverflow = component.model.properties.overflow
      ? component.model.properties.overflow
      : component.model.properties.v && component.model.properties.v >= 3
        ? UI.Table.OVERFLOW_BEHAVIOR.ELLIPSIS
        : UI.Table.OVERFLOW_BEHAVIOR.DYNAMIC;

    cols = guessColumns(
      component.model.properties.data,
      component.model.properties.columns,
      defaultOverflow
    );

    const allColumnsHaveFixedWidth = cols.every(
      (col) => col.width !== undefined
    );

    if (allColumnsHaveFixedWidth && cols.length > 0) {
      cols[cols.length - 1] = {
        ...cols[cols.length - 1],
        expand: true,
      };
    }

    return cols;
  }, [
    component.model.properties.columns,
    component.model.properties.data,
    component.model.properties.overflow,
    component.model.properties.v,
  ]);

  return (
    <div
      className={classNames(
        "flex self-stretch flex-col items-start overflow-x-auto w-full"
      )}
    >
      {component.model.label !== null && (
        <IOComponent.Label>{component.model.label}</IOComponent.Label>
      )}
      {component.model.description !== null && (
        <IOComponent.Description>
          {component.model.description}
        </IOComponent.Description>
      )}
      <div className="self-stretch">
        <Table.Root
          id={componentId}
          data={component.model.properties.data}
          columns={columns}
          actions={component.model.properties.actions}
          onTableRowActionHook={onTableRowActionHook}
          offset={component.model.properties.offset}
          pageSize={component.model.properties.pageSize}
          totalRecords={
            component.model.properties.totalRecords ||
            component.model.properties.data.length
          }
          onTablePageChangeHook={onTablePageChangeHook}
          enableRowSelection={component.model.properties.allowSelect}
          rowSelections={componentOutput.output.internalValue}
          setRowSelections={(internalValue) => {
            dispatch({
              type: appStore.EVENT_TYPE.UPDATE_TABLE_INPUT_VALUE,
              properties: {
                componentId,
                internalValue,
                renderId,
              },
            });
          }}
          hasError={hasError}
          errorMessage={errorMessage}
          allowMultiSelection={component.model.properties.maxSelections > 1}
          disableRowSelection={disabled}
          serverSearchQuery={component.model.properties.searchQuery}
          paginated={component.model.properties.paged}
          loading={componentLoading}
          height={component.model.style?.height ?? undefined}
          sortBy={component.model.properties.sortBy}
          // We expect the SDK to return undefined if the table should be
          // multi-column sortable. Else, it'll explicitly return the
          // sortable option to use.
          sortable={component.model.properties.sortable}
          // We expect the SDK to return undefined if the table should be
          // searchable. Else, it'll explicitly return the searchable option
          // to use.
          disableSearch={component.model.properties.notSearchable}
          density={component.model.properties.density}
        />
      </div>
    </div>
  );
}
