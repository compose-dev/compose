import { m } from "@compose/ts";

import { AnalyticsEvent, ANALYTICS_EVENT } from "./eventType";

// eslint-disable-next-line @typescript-eslint/ban-types
type DistinctId = "ANONYMOUS_USER" | (string & {});

abstract class AnalyticsService {
  event: typeof ANALYTICS_EVENT = ANALYTICS_EVENT;
  anonymousUserId: DistinctId = "ANONYMOUS_USER";

  constructor() {}

  abstract capture(
    event: AnalyticsEvent,
    distinctId: DistinctId,
    companyId: string,
    properties: Record<
      string,
      string | number | boolean | Array<string | number | boolean>
    >
  ): void;

  abstract identifyUser(
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    companyId: string,
    accountType: m.User.AccountType,
    permission: m.User.DB["permission"]
  ): void;

  abstract identifyCompany(companyId: string, companyName: string): void;

  abstract shutdown(): Promise<void>;
}

class AnalyticsServiceStub extends AnalyticsService {
  constructor() {
    super();
  }

  capture(
    _event: AnalyticsEvent,
    _distinctId: DistinctId,
    _companyId: string,
    _properties: Record<
      string,
      string | number | boolean | Array<string | number | boolean>
    >
  ) {
    return;
  }

  identifyUser(
    _userId: string,
    _firstName: string,
    _lastName: string,
    _email: string,
    _companyId: string,
    _accountType: m.User.AccountType,
    _permission: m.User.DB["permission"]
  ) {
    return;
  }

  identifyCompany(_companyId: string, _companyName: string) {
    return;
  }

  async shutdown() {
    return;
  }
}

export { AnalyticsService, AnalyticsServiceStub };
