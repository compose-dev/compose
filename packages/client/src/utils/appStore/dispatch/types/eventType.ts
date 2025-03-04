const APP_RUNNER_EVENT_TYPE = {
  // Render events
  ADD_RENDER: "ADD_RENDER",
  UPDATE_RENDERS: "UPDATE_RENDERS",
  UPDATE_RENDERS_V2: "UPDATE_RENDERS_V2",
  CLOSE_MODAL: "CLOSE_MODAL",
  TABLE_PAGE_CHANGE_RESPONSE: "TABLE_PAGE_CHANGE_RESPONSE",
  UPDATE_COMPONENT_STALE_STATE: "UPDATE_COMPONENT_STALE_STATE",

  // Input events
  UPDATE_TEXT_INPUT_VALUE: "UPDATE_TEXT_INPUT_VALUE",
  UPDATE_NUMBER_INPUT_VALUE: "UPDATE_NUMBER_INPUT_VALUE",
  UPDATE_SELECT_SINGLE_INPUT_VALUE: "UPDATE_SELECT_SINGLE_INPUT_VALUE",
  UPDATE_SELECT_MULTI_INPUT_VALUE: "UPDATE_SELECT_MULTI_INPUT_VALUE",
  UPDATE_TABLE_INPUT_VALUE: "UPDATE_TABLE_INPUT_VALUE",
  UPDATE_FILE_UPLOAD_INPUT_VALUE: "UPDATE_FILE_UPLOAD_INPUT_VALUE",
  UPDATE_DATE_INPUT_VALUE: "UPDATE_DATE_INPUT_VALUE",
  UPDATE_TIME_INPUT_VALUE: "UPDATE_TIME_INPUT_VALUE",
  UPDATE_DATE_TIME_INPUT_VALUE: "UPDATE_DATE_TIME_INPUT_VALUE",
  UPDATE_CHECKBOX_INPUT_VALUE: "UPDATE_CHECKBOX_INPUT_VALUE",

  // Form submission events
  SHOW_FORM_LOCAL_ERRORS: "SHOW_FORM_LOCAL_ERRORS",
  SHOW_INPUT_LOCAL_ERRORS: "SHOW_INPUT_LOCAL_ERRORS",
  REMOVE_FORM_REMOTE_ERRORS: "REMOVE_FORM_REMOTE_ERRORS",
  REMOVE_INPUT_REMOTE_ERRORS: "REMOVE_INPUT_REMOTE_ERRORS",
  ADD_REMOTE_FORM_VALIDATION_ERRORS: "ADD_REMOTE_FORM_VALIDATION_ERRORS",
  ADD_REMOTE_INPUT_VALIDATION_ERRORS: "ADD_REMOTE_INPUT_VALIDATION_ERRORS",
  FORM_SUBMISSION_SUCCESS: "FORM_SUBMISSION_SUCCESS",
  SET_INPUTS: "SET_INPUTS",

  // Page confirm events
  ADD_PAGE_CONFIRM: "ADD_PAGE_CONFIRM",
  REMOVE_PAGE_CONFIRM: "REMOVE_PAGE_CONFIRM",

  // Other (uncategorized) events
  RESTART_APP: "RESTART_APP",
  ADD_APP_ERROR: "ADD_APP_ERROR",
  REMOVE_APP_ERROR: "REMOVE_APP_ERROR",
  SET_PAGE_CONFIG: "SET_PAGE_CONFIG",
  WENT_OFFLINE: "WENT_OFFLINE",
  UPDATE_LOADING: "UPDATE_LOADING",
} as const;

type AppRunnerEventType =
  (typeof APP_RUNNER_EVENT_TYPE)[keyof typeof APP_RUNNER_EVENT_TYPE];

export { APP_RUNNER_EVENT_TYPE, type AppRunnerEventType };
