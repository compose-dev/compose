/**
 * This class stores access lists between sessions and app executions.
 *
 * The use case is to authenticate that websocket messages sent between browser and SDK
 * are authorized.
 */
class Authorizations {
  /**
   * A record that maps a `browserSessionId` to the `environmentId` and `appRoute`
   * that the browser is authorized to access.
   */
  browserSessionAccessList: Record<
    string,
    { environmentId: string; appRoute: string; executionId?: string }
  >;

  /**
   * A record that maps an `executionId` to the `browserSessionId` and `environmentId`
   * that the execution corresponds to.
   */
  executionAccessList: Record<
    string,
    { browserSessionId: string; environmentId: string }
  >;

  constructor() {
    this.browserSessionAccessList = {};
    this.executionAccessList = {};
  }

  authorizeBrowser(
    browserSessionId: string,
    environmentId: string,
    appRoute: string
  ) {
    this.browserSessionAccessList[browserSessionId] = {
      environmentId,
      appRoute,
    };
  }

  authorizeBrowserAndExecution(
    browserSessionId: string,
    environmentId: string,
    appRoute: string,
    executionId: string
  ) {
    this.authorizeBrowser(browserSessionId, environmentId, appRoute);
    this.executionAccessList[executionId] = {
      browserSessionId,
      environmentId,
    };
  }

  validateExistingExecution(
    executionId: string,
    browserSessionId: string,
    environmentId: string
  ) {
    const executionAuthorization = this.executionAccessList[executionId];

    if (!executionAuthorization) {
      return false;
    }

    return (
      executionAuthorization.browserSessionId === browserSessionId &&
      executionAuthorization.environmentId === environmentId
    );
  }

  authorizeNewExecutionIfValid(
    browserSessionId: string,
    executionId: string,
    environmentId: string,
    appRoute: string
  ) {
    const browserAuthorization =
      this.browserSessionAccessList[browserSessionId];

    if (!browserAuthorization) {
      return false;
    }

    if (
      browserAuthorization.appRoute !== appRoute ||
      browserAuthorization.environmentId !== environmentId
    ) {
      return false;
    }

    this.executionAccessList[executionId] = {
      browserSessionId,
      environmentId,
    };
    this.browserSessionAccessList[browserSessionId].executionId = executionId;

    return true;
  }

  removeBrowserSession(browserSessionId: string) {
    if (!(browserSessionId in this.browserSessionAccessList)) {
      return;
    }

    const executionId =
      this.browserSessionAccessList[browserSessionId].executionId;
    if (executionId) {
      delete this.executionAccessList[executionId];
    }

    delete this.browserSessionAccessList[browserSessionId];
  }
}

export { Authorizations };
