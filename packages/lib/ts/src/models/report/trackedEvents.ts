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

export { TRACKED_EVENT_OPERATORS, TRACKED_EVENT_LOGIC_OPERATORS };

export type {
  TrackedEventOperator,
  TrackedEventLogicOperator,
  TrackedEventRule,
  TrackedEventGroup,
  TrackedEventModel,
};
