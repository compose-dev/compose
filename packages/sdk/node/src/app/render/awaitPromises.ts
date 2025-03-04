import { UI } from "@composehq/ts-public";
import { UIRenderStaticLayout } from "../constants";
import { ComponentTree } from "../utils";

async function awaitPromises(layout: UIRenderStaticLayout) {
  const count = ComponentTree.countByCondition(
    layout,
    (component) =>
      component.type === UI.TYPE.BUTTON_BAR_CHART ||
      component.type === UI.TYPE.BUTTON_LINE_CHART
  );

  if (count === 0) {
    return;
  }

  await ComponentTree.doForComponent(layout, async (component) => {
    if (component.type === UI.TYPE.BUTTON_BAR_CHART) {
      // @ts-ignore we know this is a promise
      component.model.properties.data = await component.model.properties.data;
    }
  });
}

export { awaitPromises };
