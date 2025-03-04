import { TYPE as BROWSER_TO_SDK_TYPE } from "../browserToSdkEvent";

/**
 * Browser -> Server events. The vast majority of events are inherited from
 * Browser -> SDK events.
 *
 * Allowed prefixes for events: 0, 1, 2, 3, 4
 * - e.g. 00, 01, ..., 49
 * - 5...9 beginning types are reserved for Server -> SDK events.
 */
export const TYPE = {
  ...BROWSER_TO_SDK_TYPE,
} as const;

export type Type = (typeof TYPE)[keyof typeof TYPE];

export interface BaseData {
  type: Type;
}
