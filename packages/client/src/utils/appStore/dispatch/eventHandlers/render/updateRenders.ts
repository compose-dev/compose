import { UI } from "@composehq/ts-public";

import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import {
  flattenComponent,
  generatorToFrontendModel,
  generatorToFrontendOutput,
  getComponentMetadata,
} from "../../../utils";
import { type AppStore, DELETED_RENDER } from "../../../types";

interface UpdateRendersEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.UPDATE_RENDERS;
  properties: {
    diff: Record<string, UI.ComponentGenerators.All>;
  };
}

function updateRenders(
  state: AppStore,
  event: UpdateRendersEvent
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

  for (const renderId in event.properties.diff) {
    if (renderId in state.renderToRootComponent === false) {
      continue;
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

    const newRootComponent = event.properties.diff[renderId];

    if (newRootComponent.model.id !== renderToRootComponent[renderId]) {
      renderToRootComponent[renderId] = newRootComponent.model.id;
    }

    const newFlattenedRender = flattenComponent(newRootComponent);

    // First, delete the components that aren't in the new render tree
    for (const oldComponentId in flattenedModel[renderId]) {
      if (oldComponentId in newFlattenedRender === false) {
        delete flattenedModel[renderId][oldComponentId];
        delete flattenedOutput[renderId][oldComponentId];
      }
    }

    const metadata = getComponentMetadata(
      newRootComponent.model.id,
      null,
      newFlattenedRender
    );

    // TODO: Error handling for this
    if (typeof metadata === "string") {
      throw new Error("Metadata is a string");
    }

    // Next, either update components with the new data model if they
    // already exist. Or, insert a new component into the
    // flattened render tree if it doesn't exist yet.
    for (const newComponentId in newFlattenedRender) {
      // We should generate this for both new components and existing
      // components that are being updated since we do some transformations
      // on the component model in this function.
      const newComponentModel = generatorToFrontendModel(
        newFlattenedRender[newComponentId],
        metadata
      );
      const newComponentOutput = generatorToFrontendOutput(
        newFlattenedRender[newComponentId]
      );

      if (newComponentId in flattenedModel[renderId]) {
        // @ts-expect-error Same union type error
        flattenedModel[renderId][newComponentId] = {
          ...flattenedModel[renderId][newComponentId],
          model: newComponentModel.model,
          formId: metadata[newComponentId].formId,
        };

        // if (
        //   shouldResetOutput(
        //     state.flattenedModel[renderId][newComponentId],
        //     newFlattenedRender[newComponentId]
        //   )
        // ) {
        //   flattenedOutput[renderId][newComponentId] = newComponentOutput;
        // }
      } else {
        flattenedModel[renderId][newComponentId] = newComponentModel;
        flattenedOutput[renderId][newComponentId] = newComponentOutput;
      }
    }
  }

  return {
    renderToRootComponent,
    flattenedModel,
    flattenedOutput,
  };
}

export { updateRenders, type UpdateRendersEvent };
