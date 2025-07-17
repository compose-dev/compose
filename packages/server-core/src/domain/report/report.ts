import { m, u } from "@compose/ts";
import { u as uPublic } from "@composehq/ts-public";
import { FastifyInstance } from "fastify";

import { AnalyticsEvent } from "../../services/analytics/eventType";

const REQUIRED_REPORT_DATA_FIELDS = [
  // Core fields
  "trackedEventModel",
  "includeProductionLogs",
  "includeDevelopmentLogs",
  "timeFrame",
  "dateRange",
  "selectedApps",
  "selectedUserEmails",
  "includeAnonymousUsers",

  // Editable flags
  "includeProductionLogsIsEditable",
  "includeDevelopmentLogsIsEditable",
  "timeFrameIsEditable",
  "selectedAppsIsEditable",
  "selectedUserEmailsIsEditable",
];

const REQUIRED_TRACKED_EVENT_FIELDS = ["event", "type", "operator"];

const REQUIRED_SELECTED_APP_FIELDS = ["route", "environmentId"];

function validateTrackedEventModel(
  model: m.Report.DB["data"]["trackedEventModel"]
) {
  if ("logicOperator" in model) {
    if (
      !u.object.hasValue(
        m.Report.TRACKED_EVENT_LOGIC_OPERATORS,
        model.logicOperator
      )
    ) {
      throw new Error(
        `Invalid tracked event logic operator: ${model.logicOperator}.`
      );
    }

    for (const event of model.events) {
      validateTrackedEventModel(event);
    }
  } else {
    for (const field of REQUIRED_TRACKED_EVENT_FIELDS) {
      if (!(field in model)) {
        throw new Error(`Missing required field in tracked event: ${field}.`);
      }
    }

    if (!u.object.hasValue(uPublic.log.TYPE, model.type)) {
      throw new Error(`Invalid tracked event type: ${model.type}.`);
    }

    if (!u.object.hasValue(m.Report.TRACKED_EVENT_OPERATORS, model.operator)) {
      throw new Error(`Invalid tracked event operator: ${model.operator}.`);
    }
  }
}

/**
 * Even though the data model allows for complex event models, for now we support
 * a flat list of events with AND logic. Eventually, we can remove this constraint.
 *
 * Valid simplified structure:
 *
 * {
 *   // must be AND
 *   logicOperator: "AND",
 *   // must be a list of event rules (no nested groups)
 *   events: [
 *     {
 *       event: "event1",
 *       type: "type1",
 *       operator: "operator1",
 *     },
 *     {
 *       event: "event2",
 *       type: "type2",
 *       operator: "operator2",
 *     },
 *     ...
 *   ],
 * }
 */
function validateSimplifiedTrackedEventModel(
  model: m.Report.DB["data"]["trackedEventModel"]
) {
  if ("operator" in model) {
    throw new Error("Expected a tracked event group, but got a rule.");
  }

  if (model.logicOperator !== m.Report.TRACKED_EVENT_LOGIC_OPERATORS.AND) {
    throw new Error("Expected AND logic, but got a different logic operator.");
  }

  for (const event of model.events) {
    if ("logicOperator" in event) {
      throw new Error("Expected a tracked event rule, but got a nested group.");
    }
  }
}

function validateReportData(data: m.Report.DB["data"]) {
  // Check all fields are present
  for (const field of REQUIRED_REPORT_DATA_FIELDS) {
    if (!(field in data)) {
      throw new Error(`Missing required field in report data: ${field}`);
    }
  }

  // Validate tracked event model
  validateTrackedEventModel(data.trackedEventModel);
  validateSimplifiedTrackedEventModel(data.trackedEventModel);

  // Validate environment types
  if (typeof data.includeProductionLogs !== "boolean") {
    throw new Error("includeProductionLogs must be a boolean.");
  }

  if (typeof data.includeDevelopmentLogs !== "boolean") {
    throw new Error("includeDevelopmentLogs must be a boolean.");
  }

  // Validate time frame
  if (!u.object.hasValue(m.Report.TIMEFRAMES, data.timeFrame)) {
    throw new Error(`Invalid time frame: ${data.timeFrame}.`);
  }

  // Validate date range
  if (data.timeFrame === m.Report.TIMEFRAMES.CUSTOM) {
    if (data.dateRange.start === null || data.dateRange.end === null) {
      throw new Error("Start and end date are required for custom timeframe.");
    }
  } else {
    if (data.dateRange.start !== null || data.dateRange.end !== null) {
      throw new Error("Date range is not allowed for non-custom timeframe.");
    }
  }

  // Validate selected apps
  for (const app of data.selectedApps) {
    for (const field of REQUIRED_SELECTED_APP_FIELDS) {
      if (!(field in app)) {
        throw new Error(`Missing required field in selected app: ${field}.`);
      }
    }
  }

  return true;
}

function getReportAnalyticsProperties(report: m.Report.DB) {
  const dateRangeStart = u.date.deserialize(report.data.dateRange.start);
  const dateRangeEnd = u.date.deserialize(report.data.dateRange.end);

  return {
    reportTitle: report.title,
    reportDescription: report.description,
    reportId: report.id,
    reportTimeframe: report.data.timeFrame,
    reportDateRangeStart: dateRangeStart
      ? u.date.toString(dateRangeStart, u.date.SerializedFormat["L/d/yyyy"])
      : null,
    reportDateRangeEnd: dateRangeEnd
      ? u.date.toString(dateRangeEnd, u.date.SerializedFormat["L/d/yyyy"])
      : null,
    reportTrackedEvents: m.Report.getTrackedEventRules(
      report.data.trackedEventModel
    ).map((rule) => rule.event),
    reportIncludeProductionLogs: report.data.includeProductionLogs,
    reportIncludeDevelopmentLogs: report.data.includeDevelopmentLogs,
    reportSelectedUserEmails: report.data.selectedUserEmails,
    reportIncludeAnonymousUsers: report.data.includeAnonymousUsers,
  };
}

/**
 * Captures a reporting event in 3rd party analytics.
 *
 * @param server - The Fastify instance.
 * @param dbUser - The user who performed the action.
 * @param analyticsEvent - The analytics event to capture.
 * @param reportId - The ID of the report.
 * @param reportTitle - The title of the report.
 * @param reportData - The data of the report.
 */
function captureReportEventInAnalytics(
  server: FastifyInstance,
  dbUser: m.User.DB,
  analyticsEvent: AnalyticsEvent,
  report: m.Report.DB
) {
  server.analytics.capture(
    analyticsEvent,
    dbUser.id,
    dbUser.companyId,
    getReportAnalyticsProperties(report)
  );
}

function captureReportShareEventInAnalytics(
  server: FastifyInstance,
  sharedByDbUser: m.User.DB,
  sharedWithDbUser: m.User.DB,
  analyticsEvent: AnalyticsEvent,
  report: m.Report.DB
) {
  server.analytics.capture(
    analyticsEvent,
    sharedByDbUser.id,
    sharedByDbUser.companyId,
    {
      ...getReportAnalyticsProperties(report),
      actingUserId: sharedByDbUser.id,
      actingUserEmail: sharedByDbUser.email,
      actedUponUserId: sharedWithDbUser.id,
      actedUponUserEmail: sharedWithDbUser.email,
    }
  );
}

/**
 * Validates that a request for logs is valid against a report's configuration.
 *
 * Throws an error if the request configuration is not allowed by the report
 * configuration.
 */
function validateLogsRequestAgainstReportConfiguration(
  report: m.Report.DB,
  timeFrame: m.Report.Timeframe,
  dateRange: m.Report.DB["data"]["dateRange"],
  includeProductionLogs: boolean,
  includeDevelopmentLogs: boolean,
  selectedApps: m.Report.DB["data"]["selectedApps"],
  trackedEventModel: m.Report.DB["data"]["trackedEventModel"],
  selectedUserEmails: m.Report.DB["data"]["selectedUserEmails"],
  includeAnonymousUsers: boolean
) {
  if (!report.data.timeFrameIsEditable) {
    if (timeFrame !== report.data.timeFrame) {
      throw new Error("Requested timeframe does not match report timeframe.");
    }

    if (timeFrame === m.Report.TIMEFRAMES.CUSTOM) {
      if (
        dateRange.start !== report.data.dateRange.start ||
        dateRange.end !== report.data.dateRange.end
      ) {
        throw new Error(
          "Requested date range does not match report date range."
        );
      }
    }
  }

  if (!report.data.includeProductionLogsIsEditable) {
    if (includeProductionLogs !== report.data.includeProductionLogs) {
      throw new Error(
        "Request to include production logs does not match report configuration."
      );
    }
  }

  if (!report.data.includeDevelopmentLogsIsEditable) {
    if (includeDevelopmentLogs !== report.data.includeDevelopmentLogs) {
      throw new Error(
        "Request to include development logs does not match report configuration."
      );
    }
  }

  if (!report.data.selectedAppsIsEditable) {
    if (selectedApps.length !== report.data.selectedApps.length) {
      throw new Error(
        "Request to filter logs by apps does not match report configuration."
      );
    }

    for (const app of selectedApps) {
      if (
        !report.data.selectedApps.some(
          (a) => a.route === app.route && a.environmentId === app.environmentId
        )
      ) {
        throw new Error(
          "Request to filter logs by apps does not match report configuration."
        );
      }
    }
  }

  if (!report.data.selectedUserEmailsIsEditable) {
    if (selectedUserEmails.length !== report.data.selectedUserEmails.length) {
      throw new Error(
        "Request to filter logs by user emails does not match report configuration."
      );
    }

    for (let i = 0; i < selectedUserEmails.length; i++) {
      if (selectedUserEmails[i] !== report.data.selectedUserEmails[i]) {
        throw new Error(
          "Request to filter logs by user emails does not match report configuration."
        );
      }
    }

    if (includeAnonymousUsers !== report.data.includeAnonymousUsers) {
      throw new Error(
        "Request to include anonymous users does not match report configuration."
      );
    }
  }

  const reportTrackedEvents = m.Report.getTrackedEventRules(
    report.data.trackedEventModel
  );
  const requestedTrackedEvents =
    m.Report.getTrackedEventRules(trackedEventModel);

  if (reportTrackedEvents.length !== requestedTrackedEvents.length) {
    throw new Error(
      "Request to filter logs by tracked events does not match report configuration."
    );
  }

  for (let i = 0; i < reportTrackedEvents.length; i++) {
    if (
      reportTrackedEvents[i].event !== requestedTrackedEvents[i].event ||
      reportTrackedEvents[i].type !== requestedTrackedEvents[i].type ||
      reportTrackedEvents[i].operator !== requestedTrackedEvents[i].operator
    ) {
      throw new Error(
        "Request to filter logs by tracked events does not match report configuration."
      );
    }
  }

  return true;
}

export {
  validateReportData,
  validateTrackedEventModel,
  validateSimplifiedTrackedEventModel,
  captureReportEventInAnalytics,
  captureReportShareEventInAnalytics,
  validateLogsRequestAgainstReportConfiguration,
};
