import cloneDeep from "lodash.clonedeep";
import { SmartDebounce } from "./utils";

class State {
  private __onUpdate: (newState: any) => void;
  private __debouncer: SmartDebounce;

  constructor(onUpdate: (newState: any) => void) {
    this.__onUpdate = onUpdate;

    this.__debouncer = new SmartDebounce(10);

    this.createProxy = this.createProxy.bind(this);
  }

  createProxy(initialState: Record<string, any>) {
    // Copy the state to avoid mutating the initial state object,
    // which could lead to state being shared across app executions.
    const __state = cloneDeep(initialState);
    const self = this;

    const proxy: ProxyHandler<Record<string, any>> = {
      get(
        target: Record<string, any>,
        prop: string | symbol,
        receiver: any
      ): any {
        if (prop === "overwrite") {
          return (newState: Record<string, any>) => {
            Object.keys(target).forEach((key) => {
              delete target[key];
            });
            Object.assign(target, newState);
            self.__debouncer.run(() => self.__onUpdate(target));
          };
        }

        if (prop === "merge") {
          return (newState: Record<string, any>) => {
            Object.assign(target, newState);
            self.__debouncer.run(() => self.__onUpdate(target));
          };
        }

        return Reflect.get(target, prop, receiver);
      },
      set: (
        target: Record<string, any>,
        prop: string | symbol,
        value: any
      ): boolean => {
        if (prop === "overwrite") {
          throw new Error(
            "Cannot set 'overwrite' property.\n\nIt is a protected method that can be called to overwrite the entire state with a new state object. \n\nFor example: state.overwrite({ key: 'value', key2: 'value2' });"
          );
        }

        if (prop === "merge") {
          throw new Error(
            "Cannot set 'merge' property.\n\nIt is a protected method that can be called to merge the existing state with a new state. \n\nFor example: state.merge({ newKey: 'value', existingKey: 'overwriteValue' });"
          );
        }

        target[prop as string] = value;
        self.__debouncer.run(() => self.__onUpdate(target));
        return true;
      },
    };

    const state = new Proxy(__state, proxy);

    return {
      state,
      manualUpdate: () => self.__debouncer.run(() => self.__onUpdate(null)),
    };
  }

  cleanup() {
    this.__debouncer.cleanup();
  }
}

export default State;
