import { TYPE as SDK_TO_BROWSER_TYPE } from "../sdkToBrowserEvent";

/**
 * SDK -> Server events. The vast majority of events are inherited from
 * SDK -> Browser events.
 *
 * ALL EVENT TYPES SHOULD BE REPLICATED IN THE PYTHON SDK
 *
 * Allowed prefixes for events: 5, 6, 7, 8, 9
 * - e.g. 50, 51, ..., 99
 * - 0...4 beginnings are reserved for server -> browser events.
 * - INITIALIZE is an exception, and comes from a previous implementation.
 */
export const TYPE = {
  ...SDK_TO_BROWSER_TYPE,
  INITIALIZE: "ab",
  WRITE_AUDIT_LOG: "50",
} as const;

export type Type = (typeof TYPE)[keyof typeof TYPE];

export interface BaseData {
  type: Type;
}
