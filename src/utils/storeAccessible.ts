import { store } from "@store/index";

function defaultDispatch(_: any) {
  console.debug("[REDUX] Missing dispatch");
}

class StoreAccessible {
  /**
   * @protected
   */
  getStates() {
    return (store && store.getState()) || {};
  }

  /**
   * @protected
   */
  getState(moduleName?: string) {
    if (!moduleName) {
      return {};
    }
    const getStore: any = (store && store.getState()) || {};
    return getStore[moduleName] || {};
  }

  /**
   * @protected
   */
  dispatch(action: any) {
    return store && store.dispatch
      ? store.dispatch(action)
      : defaultDispatch(action);
  }
}

export default new StoreAccessible();
