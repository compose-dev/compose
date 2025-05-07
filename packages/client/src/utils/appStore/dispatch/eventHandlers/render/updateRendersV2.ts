import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import {
  flattenComponent,
  generatorToFrontendModel,
  generatorToFrontendOutput,
} from "../../../utils";
import { type AppStore, DELETED_RENDER } from "../../../types";
import { ServerToBrowserEvent } from "@compose/ts";
import { UI } from "@composehq/ts-public";
import { shouldResetOutput } from "./utils";

interface UpdateRendersV2Event extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.UPDATE_RENDERS_V2;
  properties: {
    diff: ServerToBrowserEvent.RerenderUIV2.Data["diff"];
  };
}

function updateRendersV2(
  state: AppStore,
  event: UpdateRendersV2Event
): Partial<AppStore> {
  const flattenedModel: AppStore["flattenedModel"] = {
    ...state.flattenedModel,
  };

  const flattenedOutput: AppStore["flattenedOutput"] = {
    ...state.flattenedOutput,
  };

  const renderToRootComponent = {
    ...state.renderToRootComponent,
  };

  // Iterate through all the renders in the diff.
  for (const renderId in event.properties.diff) {
    if (renderId in state.renderToRootComponent === false) {
      return {
        ...state,
        error: {
          message: `Found renderId (${renderId}) in rerender instructions, but missing in client side render tree.`,
          severity: "warning",
        },
      };
    }

    if (state.renderToRootComponent[renderId] === DELETED_RENDER) {
      continue;
    }

    // Since we'll be making edits to the flattened render tree, we need to
    // make a copy of the existing flattened render tree so that we don't
    // inadvertently modify the original.
    flattenedModel[renderId] = {
      ...state.flattenedModel[renderId],
    };
    flattenedOutput[renderId] = {
      ...state.flattenedOutput[renderId],
    };

    const diff = event.properties.diff[renderId];

    if (diff.rootId !== renderToRootComponent[renderId]) {
      renderToRootComponent[renderId] = diff.rootId;
    }

    for (const deletedComponentId of diff.delete) {
      // Flatten the component so that we can also delete all the children,
      // in addition to the branch head component itself.
      const flattened = flattenComponent(
        flattenedModel[renderId][deletedComponentId]
      );
      const ids = Object.keys(flattened);

      for (const id of ids) {
        delete flattenedModel[renderId][id];
        delete flattenedOutput[renderId][id];
      }
    }

    for (const addedComponentId in diff.add) {
      // Added components may be layouts with children, so we should flatten them and
      // add the children.
      const flattened = flattenComponent(diff.add[addedComponentId]);

      for (const id in flattened) {
        flattenedModel[renderId][id] = generatorToFrontendModel(
          flattened[id],
          diff.metadata
        );
        flattenedOutput[renderId][id] = generatorToFrontendOutput(
          flattened[id]
        );
      }
    }

    for (const updatedComponentId in diff.update) {
      const oldModel = flattenedModel[renderId][updatedComponentId];

      const hydrated = {
        type: oldModel.type,
        interactionType: oldModel.interactionType,
        model: {
          ...diff.update[updatedComponentId],
          id: updatedComponentId,
        },
      } as UI.ComponentGenerators.All;

      if (oldModel.interactionType === UI.INTERACTION_TYPE.LAYOUT) {
        // @ts-expect-error don't want to deal with typescript here
        hydrated.model.children = diff.update[updatedComponentId].children.map(
          // this should just be a list of children IDs, but till now, we've
          // just nested the entire child component, so we need to do the same
          // here by putting the ID where it's expected to be.
          (id: string) => ({
            model: {
              id,
            },
          })
        );
      }

      flattenedModel[renderId][updatedComponentId] = generatorToFrontendModel(
        hydrated,
        diff.metadata
      );

      if (
        shouldResetOutput(
          state.flattenedModel[renderId][updatedComponentId],
          hydrated
        )
      ) {
        flattenedOutput[renderId][updatedComponentId] =
          generatorToFrontendOutput(hydrated);
      }
    }
  }

  return {
    renderToRootComponent,
    flattenedModel,
    flattenedOutput,
  };
}

export { updateRendersV2, type UpdateRendersV2Event };
