import { UI } from "@composehq/ts-public";
import { appStore } from "~/utils/appStore";
import Table from "~/components/table";
import { useCallback, useMemo } from "react";
import { IOComponent } from "~/components/io-component";
import { useWSContext } from "~/utils/wsContext";
import { BrowserToServerEvent, u } from "@compose/ts";
import { classNames } from "~/utils/classNames";

function guessColumns(
  data: UI.Components.InputTable["model"]["properties"]["data"],
  columns: UI.Components.InputTable["model"]["properties"]["columns"]
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
          ? u.string.prettifyKey(key)
          : (column.label ?? u.string.prettifyKey(originalKey));

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

      return {
        id: key,
        accessorKey: key,
        label,
        format,
        width,
        tagColors,
      };
    });
  }

  const keys = Object.keys(data[0]);

  return keys.map((key) => ({
    id: key,
    label: u.string.prettifyKey(key),
    accessorKey: key,
    format: Table.guessColumnFormat(data, key),
    tagColors: {},
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
    (searchQuery: string | null, offset: number, pageSize: number) => {
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
          sortKey: null,
          sortDirection: null,
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

    cols = guessColumns(
      component.model.properties.data,
      component.model.properties.columns
    );

    return cols;
  }, [component.model.properties.columns, component.model.properties.data]);

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
          disableSearch={component.model.properties.notSearchable}
          serverSearchQuery={component.model.properties.searchQuery}
          paginated={component.model.properties.paged}
          loading={componentLoading}
          height={component.model.style?.height ?? undefined}
        />
      </div>
    </div>
  );
}
