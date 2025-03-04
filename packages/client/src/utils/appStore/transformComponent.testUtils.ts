import {
  type FrontendComponentModel,
  type FrontendComponentOutput,
} from "./types";
import { compress, UI } from "@composehq/ts-public";
import {
  flattenComponent,
  getComponentMetadata,
  generatorToFrontendModel,
  generatorToFrontendOutput,
} from "./utils";
import { WSUtils } from "@composehq/ts-public";
import { u } from "@compose/ts";

/**
 * ONLY USED FOR TESTING.
 *
 * 1. Simulate a websocket transfer
 * 2. Transform the component from the SDK generator to frontend component
 * format.
 *
 * @param component - The generator to get the frontend component for.
 * @returns The frontend component.
 */
function transformComponent<T extends UI.ComponentGenerators.All>(
  component: T,
  options: {
    compress?: boolean;
  } = {}
): {
  componentGenerator: T;
  model: Extract<FrontendComponentModel.All, { type: T["type"] }>;
  output: Extract<FrontendComponentOutput.All, { type: T["type"] }>;
} {
  const compressed = options.compress ? compress.uiTree(component) : component;
  const transferredComponent = WSUtils.Message.simulateJSONTransfer(compressed);

  const flattened = flattenComponent(transferredComponent);
  const metadata = getComponentMetadata(
    transferredComponent.model.id,
    null,
    flattened
  );

  if (typeof metadata === "string") {
    throw new Error("Metadata is a string");
  }

  const formattedModel = u.object.mapValues(flattened, (transferredComponent) =>
    generatorToFrontendModel(transferredComponent, metadata)
  );

  const formattedOutput = u.object.mapValues(
    flattened,
    (transferredComponent) => generatorToFrontendOutput(transferredComponent)
  );

  return {
    componentGenerator: transferredComponent,
    model: formattedModel[transferredComponent.model.id] as Extract<
      FrontendComponentModel.All,
      { type: T["type"] }
    >,
    output: formattedOutput[transferredComponent.model.id] as Extract<
      FrontendComponentOutput.All,
      { type: T["type"] }
    >,
  };
}

export { transformComponent };
