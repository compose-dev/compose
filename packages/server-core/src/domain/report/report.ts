import { m, u } from "@compose/ts";
import { u as uPublic } from "@composehq/ts-public";

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

export {
  validateReportData,
  validateTrackedEventModel,
  validateSimplifiedTrackedEventModel,
};
