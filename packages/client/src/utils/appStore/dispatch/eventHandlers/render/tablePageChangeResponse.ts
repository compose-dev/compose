import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";
import { ServerToBrowserEvent, UI } from "@composehq/ts-public";
import { getStaleStateKey } from "../../../utils";

interface TablePageChangeResponseEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.TABLE_PAGE_CHANGE_RESPONSE;
  properties: {
    renderId: string;
    componentId: string;
    data: UI.Table.DataRow[];
    totalRecords: number;
    offset: number;
    searchQuery: ServerToBrowserEvent.TablePageChangeResponseV2.Data["searchQuery"];
    sortBy?: ServerToBrowserEvent.TablePageChangeResponseV2.Data["sortBy"];
    filterBy?: ServerToBrowserEvent.TablePageChangeResponseV2.Data["filterBy"];
    viewBy?: ServerToBrowserEvent.TablePageChangeResponseV2.Data["viewBy"];
    stale: UI.Stale.Option;
  };
}

function tablePageChangeResponse(
  state: AppStore,
  event: TablePageChangeResponseEvent
): Partial<AppStore> {
  if (event.properties.renderId in state.flattenedModel === false) {
    return {
      error: {
        message: `Found renderId (${event.properties.renderId}) in table page change response, but missing in client side render tree.`,
        severity: "warning",
      },
    };
  }

  const component =
    state.flattenedModel[event.properties.renderId][
      event.properties.componentId
    ];

  if (!component || component.type !== UI.TYPE.INPUT_TABLE) {
    return {
      error: {
        message: `Found table componentId (${event.properties.componentId}) in table page change response, but missing in client side render tree.`,
        severity: "warning",
      },
    };
  }

  const staleStateKey = getStaleStateKey({
    renderId: event.properties.renderId,
    componentId: event.properties.componentId,
  });

  return {
    flattenedModel: {
      ...state.flattenedModel,
      [event.properties.renderId]: {
        ...state.flattenedModel[event.properties.renderId],
        [event.properties.componentId]: {
          ...component,
          model: {
            ...component.model,
            properties: {
              ...component.model.properties,
              data: event.properties.data,
              offset: event.properties.offset,
              totalRecords: event.properties.totalRecords,
              searchQuery: event.properties.searchQuery,
              sortBy: event.properties.sortBy,
              filterBy: event.properties.filterBy,
              viewBy: event.properties.viewBy,
            },
          },
        },
      },
    },
    stale: {
      ...state.stale,
      [staleStateKey]: event.properties.stale,
    },
  };
}

export { tablePageChangeResponse, type TablePageChangeResponseEvent };
