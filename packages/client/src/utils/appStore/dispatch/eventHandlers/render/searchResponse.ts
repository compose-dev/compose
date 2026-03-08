import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import { type AppStore } from "../../../types";
import { ServerToBrowserEvent, UI } from "@composehq/ts-public";
import { formatSelectOptions } from "../../../utils/generatorToFrontendComponent";

interface SearchResponseEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.SEARCH_RESPONSE;
  properties: {
    renderId: string;
    componentId: string;
    options: ServerToBrowserEvent.SearchResponse.Data["options"];
  };
}

function searchResponse(
  state: AppStore,
  event: SearchResponseEvent,
): Partial<AppStore> {
  if (event.properties.renderId in state.flattenedModel === false) {
    return {};
  }

  const component =
    state.flattenedModel[event.properties.renderId][
      event.properties.componentId
    ];

  if (
    !component ||
    (component.type !== UI.TYPE.INPUT_SELECT_DROPDOWN_SINGLE &&
      component.type !== UI.TYPE.INPUT_SELECT_DROPDOWN_MULTI)
  ) {
    return {};
  }

  const options = formatSelectOptions(event.properties.options);

  const updatedComponent = {
    ...component,
    model: {
      ...component.model,
      properties: {
        ...component.model.properties,
        options,
      },
    },
  } as typeof component;

  return {
    flattenedModel: {
      ...state.flattenedModel,
      [event.properties.renderId]: {
        ...state.flattenedModel[event.properties.renderId],
        [event.properties.componentId]: updatedComponent,
      },
    },
  };
}

export { searchResponse, type SearchResponseEvent };
