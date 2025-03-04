/**
 * Browser -> SDK event types.
 *
 * ALL EVENT TYPES SHOULD BE REPLICATED IN THE PYTHON SDK
 *
 * All event types must be two letters.
 * - Ensure that each type is fixed to two bytes.
 * - Numbers are reserved for browser -> server OR server -> SDK only events.
 */
export const TYPE = {
  START_EXECUTION: "aa",
  ON_CLICK_HOOK: "ab",
  ON_SUBMIT_FORM_HOOK: "ac",
  FILE_TRANSFER: "ad",
  CHECK_EXECUTION_EXISTS: "ae",
  ON_ENTER_HOOK: "af",
  ON_SELECT_HOOK: "ag",
  ON_FILE_CHANGE_HOOK: "ah",
  ON_TABLE_ROW_ACTION_HOOK: "ai",
  ON_CONFIRM_RESPONSE_HOOK: "aj",
  BROWSER_SESSION_ENDED: "ak",
  ON_CLOSE_MODAL: "al",
  ON_TABLE_PAGE_CHANGE_HOOK: "am",
} as const;

export type Type = (typeof TYPE)[keyof typeof TYPE];
