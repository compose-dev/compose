import { u } from "@compose/ts";
import { UI } from "@composehq/ts-public";

import { AppRunnerBaseEvent, APP_RUNNER_EVENT_TYPE } from "../../types";
import {
  flattenComponent,
  generatorToFrontendModel,
  generatorToFrontendOutput,
  getComponentMetadata,
} from "../../../utils";
import { type AppStore } from "../../../types";

interface AddRenderEvent extends AppRunnerBaseEvent {
  type: typeof APP_RUNNER_EVENT_TYPE.ADD_RENDER;
  properties: {
    renderId: string;
    ui: UI.ComponentGenerators.All;
    renders: (string | null)[];
    appearance?: UI.RenderAppearance;
    modalHeader?: string;
    modalWidth?: UI.ModalWidth;
  };
}

function addRender(state: AppStore, event: AddRenderEvent): Partial<AppStore> {
  const flattened = flattenComponent(event.properties.ui);

  const metadata = getComponentMetadata(
    event.properties.ui.model.id,
    null,
    flattened
  );

  // TODO: Deal with this error handling
  if (typeof metadata === "string") {
    throw new Error("Metadata is a string");
  }

  const formattedModels = u.object.mapValues(flattened, (component) =>
    generatorToFrontendModel(component, metadata)
  );

  const formattedOutputs = u.object.mapValues(flattened, (component) =>
    generatorToFrontendOutput(component)
  );

  return {
    renders: event.properties.renders,
    renderToRootComponent: {
      ...state.renderToRootComponent,
      [event.properties.renderId]: event.properties.ui.model.id,
    },
    flattenedOutput: {
      ...state.flattenedOutput,
      [event.properties.renderId]: formattedOutputs,
    },
    flattenedModel: {
      ...state.flattenedModel,
      [event.properties.renderId]: formattedModels,
    },
    renderToMetadata: {
      ...state.renderToMetadata,
      [event.properties.renderId]: {
        appearance: event.properties.appearance || UI.RENDER_APPEARANCE.DEFAULT,
        modalHeader: event.properties.modalHeader,
        modalWidth: event.properties.modalWidth,
      },
    },
  };
}

export { addRender, type AddRenderEvent };
