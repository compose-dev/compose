import { u as uPublic } from "@composehq/ts-public";

const TRACKED_EVENT_OPERATORS = {
  EQUALS: "EQUALS",
} as const;

type TrackedEventOperator =
  (typeof TRACKED_EVENT_OPERATORS)[keyof typeof TRACKED_EVENT_OPERATORS];

const TRACKED_EVENT_LOGIC_OPERATORS = {
  AND: "AND",
  OR: "OR",
} as const;

type TrackedEventLogicOperator =
  (typeof TRACKED_EVENT_LOGIC_OPERATORS)[keyof typeof TRACKED_EVENT_LOGIC_OPERATORS];

interface TrackedEventRule {
  event: string;
  operator: TrackedEventOperator;
  type: uPublic.log.Type;
}

interface TrackedEventGroup {
  logicOperator: TrackedEventLogicOperator;
  events: TrackedEventModel[];
}

type TrackedEventModel = TrackedEventRule | TrackedEventGroup;

function getTrackedEventRules(
  model: TrackedEventModel,
  depth: number = 0
): TrackedEventRule[] {
  if (depth > 10) {
    throw new Error("Tracked event model is too deep. Max depth is 10.");
  }

  if ("logicOperator" in model) {
    return model.events.flatMap((event) =>
      getTrackedEventRules(event, depth + 1)
    );
  }

  return [model];
}

export {
  TRACKED_EVENT_OPERATORS,
  TRACKED_EVENT_LOGIC_OPERATORS,
  getTrackedEventRules,
};

export type {
  TrackedEventOperator,
  TrackedEventLogicOperator,
  TrackedEventRule,
  TrackedEventGroup,
  TrackedEventModel,
};
