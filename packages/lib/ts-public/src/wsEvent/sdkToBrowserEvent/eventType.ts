/**
 * SDK -> Browser event types.
 *
 * ALL EVENT TYPES SHOULD BE REPLICATED IN THE PYTHON SDK
 *
 * All event types must be two letters.
 * - Ensure that each type is fixed to two bytes.
 * - Numbers are reserved for server -> browser OR SDK -> server only events.
 */
export const TYPE = {
  APP_ERROR: "aa",
  RENDER_UI: "ac",
  FORM_VALIDATION_ERROR: "ad",
  RERENDER_UI: "ae",
  PAGE_CONFIG: "af",
  EXECUTION_EXISTS_RESPONSE: "ag",
  INPUT_VALIDATION_ERROR: "ah",
  FILE_TRANSFER: "ai",
  LINK: "aj",
  FORM_SUBMISSION_SUCCESS: "ak",
  RELOAD_PAGE: "al",
  CONFIRM: "am",
  TOAST: "an",
  RERENDER_UI_V2: "ao",
  SET_INPUTS: "ap",
  CLOSE_MODAL: "aq",
  UPDATE_LOADING: "ar",
  TABLE_PAGE_CHANGE_RESPONSE: "as",
  STALE_STATE_UPDATE: "at",

  // new version where `executionId` is added to the header
  APP_ERROR_V2: "au",
  RENDER_UI_V2: "av",
  FORM_VALIDATION_ERROR_V2: "aw",
  PAGE_CONFIG_V2: "ax",
  EXECUTION_EXISTS_RESPONSE_V2: "ay",
  INPUT_VALIDATION_ERROR_V2: "az",
  LINK_V2: "ba",
  FORM_SUBMISSION_SUCCESS_V2: "bb",
  RELOAD_PAGE_V2: "bc",
  CONFIRM_V2: "bd",
  TOAST_V2: "be",
  RERENDER_UI_V3: "bf",
  SET_INPUTS_V2: "bg",
  CLOSE_MODAL_V2: "bh",
  UPDATE_LOADING_V2: "bi",
  TABLE_PAGE_CHANGE_RESPONSE_V2: "bj",
  STALE_STATE_UPDATE_V2: "bk",
  FILE_TRANSFER_V2: "bl",
} as const;

export type Type = (typeof TYPE)[keyof typeof TYPE];

export interface BaseData {
  type: Type;
}
