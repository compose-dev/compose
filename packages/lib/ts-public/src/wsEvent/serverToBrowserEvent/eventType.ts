import { TYPE as SDK_TO_BROWSER_TYPE } from "../sdkToBrowserEvent";

/**
 * Server -> Browser events.
 *
 * The vast majority of events are inherited from SDK -> Browser events.
 *
 * Allowed prefixes for events: 0, 1, 2, 3, 4
 * - e.g. 00, 01, ..., 49
 * - 5...9 beginning types are reserved for SDK -> Server events.
 */
export const TYPE = {
  ...SDK_TO_BROWSER_TYPE,
  SDK_CONNECTION_STATUS_CHANGED: "11",
  REPORT_ACTIVE_COMPANY_CONNECTIONS: "12",
  JSON_PARSE_ERROR: "13",
  ENVIRONMENT_INITIALIZED: "14",
} as const;

export type Type = (typeof TYPE)[keyof typeof TYPE];

export interface BaseData {
  type: Type;
}
