import { UI } from "@composehq/ts-public";

/**
 * A cache of the previous stringified component state.
 *
 * Enables two things:
 *
 * 1. Cache lookup instead of recomputing the stringified component state.
 * 2. Avoids update-by-reference bugs when underlying data objects that
 *    are used in the component state change, since the cache is stringified.
 */
class ComponentUpdateCache {
  private cache: Map<string, string>;

  constructor() {
    this.cache = new Map();
  }

  get(renderId: string, componentId: string) {
    return this.cache.get(`${renderId}-${componentId}`);
  }

  set(renderId: string, componentId: string, value: string) {
    this.cache.set(`${renderId}-${componentId}`, value);
  }

  delete(renderId: string, componentId: string) {
    this.cache.delete(`${renderId}-${componentId}`);
  }

  clearRender(renderId: string) {
    this.cache.forEach((value, key) => {
      if (key.startsWith(renderId)) {
        this.cache.delete(key);
      }
    });
  }

  // For now, we only cache components that have high-probability of
  // having update-by-reference bugs. Furthermore, we don't currently
  // have a way to cache non-input components since they don't have
  // a stable reference ID.
  shouldCache(component: { type: UI.Type }) {
    return (
      component.type === UI.TYPE.INPUT_TABLE ||
      component.type === UI.TYPE.INPUT_SELECT_DROPDOWN_MULTI ||
      component.type === UI.TYPE.INPUT_SELECT_DROPDOWN_SINGLE ||
      component.type === UI.TYPE.INPUT_RADIO_GROUP ||
      component.type === UI.TYPE.INPUT_JSON ||
      component.type === UI.TYPE.BUTTON_BAR_CHART
    );
  }
}

export { ComponentUpdateCache };
