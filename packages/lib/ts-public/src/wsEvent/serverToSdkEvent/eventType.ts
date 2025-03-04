import { TYPE as BROWSER_TO_SDK_TYPE } from "../browserToSdkEvent";

/**
 * Server -> SDK events. The vast majority of events are inherited from
 * Browser -> SDK events.
 *
 * ALL EVENT TYPES SHOULD BE REPLICATED IN THE PYTHON SDK
 *
 * Allowed prefixes for events: 5, 6, 7, 8, 9
 * - e.g. 50, 51, ..., 99
 * - 0...4 beginnings are reserved for Browser -> Server events.
 */
export const TYPE = {
  ...BROWSER_TO_SDK_TYPE,
} as const;

export type Type = (typeof TYPE)[keyof typeof TYPE];

export interface BaseData {
  type: Type;
}
