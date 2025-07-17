import { m, u } from "@compose/ts";

const DEFAULT_REPORT_NAME = "New Custom Report";
const shortenEventName = (eventName: string) => {
  return eventName.length > 20 ? eventName.substring(0, 20) + "..." : eventName;
};

const capitalizeWords = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function getDefaultReportName(
  trackedEventModel: m.Report.DB["data"]["trackedEventModel"]
) {
  const rules = m.Report.getTrackedEventRules(trackedEventModel);

  if (rules.length === 0) {
    return DEFAULT_REPORT_NAME;
  }

  return `${capitalizeWords(shortenEventName(rules[0].event))} Report`;
}

function getDefaultReportDescription(
  trackedEventModel: m.Report.DB["data"]["trackedEventModel"]
) {
  const rules = m.Report.getTrackedEventRules(trackedEventModel);

  if (rules.length === 0) {
    return `An empty report created on ${u.date.toString(new Date(), u.date.SerializedFormat["LLL d, yyyy"])}`;
  }

  if (rules.length === 1) {
    return `Tracks occurrences of the following event: ${rules[0].event}`;
  }

  return `Tracks occurrences of ${rules.length} events`;
}

const STEPS = {
  PICK_TRACKED_EVENTS: "pick-tracked-events",
};
type Step = (typeof STEPS)[keyof typeof STEPS];

export { getDefaultReportName, getDefaultReportDescription, STEPS, type Step };
