class SDK_TO_SERVER_EVENT_TYPE:
    APP_ERROR = "aa"
    INITIALIZE = "ab"
    RENDER_UI = "ac"
    FORM_VALIDATION_ERROR = "ad"
    RERENDER_UI = "ae"
    PAGE_CONFIG = "af"
    EXECUTION_EXISTS_RESPONSE = "ag"
    INPUT_VALIDATION_ERROR = "ah"
    FILE_TRANSFER = "ai"
    LINK = "aj"
    FORM_SUBMISSION_SUCCESS = "ak"
    RELOAD_PAGE = "al"
    CONFIRM = "am"
    TOAST = "an"
    RERENDER_UI_V2 = "ao"
    SET_INPUTS = "ap"
    CLOSE_MODAL = "aq"
    UPDATE_LOADING = "ar"
    TABLE_PAGE_CHANGE_RESPONSE = "as"
    STALE_STATE_UPDATE = "at"

    # new version where `executionId` is added to the header
    APP_ERROR_V2 = "au"
    RENDER_UI_V2 = "av"
    FORM_VALIDATION_ERROR_V2 = "aw"
    PAGE_CONFIG_V2 = "ax"
    EXECUTION_EXISTS_RESPONSE_V2 = "ay"
    INPUT_VALIDATION_ERROR_V2 = "az"
    LINK_V2 = "ba"
    FORM_SUBMISSION_SUCCESS_V2 = "bb"
    RELOAD_PAGE_V2 = "bc"
    CONFIRM_V2 = "bd"
    TOAST_V2 = "be"
    RERENDER_UI_V3 = "bf"
    SET_INPUTS_V2 = "bg"
    CLOSE_MODAL_V2 = "bh"
    UPDATE_LOADING_V2 = "bi"
    TABLE_PAGE_CHANGE_RESPONSE_V2 = "bj"
    STALE_STATE_UPDATE_V2 = "bk"
    FILE_TRANSFER_V2 = "bl"


SDK_TO_SERVER_EVENT_TYPE_TO_PRETTY = {
    "aa": "App Error",
    "ab": "Initialize",
    "ac": "Render UI",
    "ad": "Form Validation Error",
    "ae": "Rerender UI",
    "af": "Page Config",
    "ag": "Execution Exists Response",
    "ah": "Input Validation Error",
    "ai": "File Transfer",
    "aj": "Link",
    "ak": "Form Submission Success",
    "al": "Reload Page",
    "am": "Confirm",
    "an": "Toast",
    "ao": "Rerender UI V2",
    "ap": "Set Inputs",
    "aq": "Close Modal",
    "ar": "Update Loading",
    "as": "Table Page Change Response",
    "at": "Stale State Update",
    "au": "App Error V2",
    "av": "Render UI V2",
    "aw": "Form Validation Error V2",
    "ax": "Page Config V2",
    "ay": "Execution Exists Response V2",
    "az": "Input Validation Error V2",
    "ba": "Link V2",
    "bb": "Form Submission Success V2",
    "bc": "Reload Page V2",
    "bd": "Confirm V2",
    "be": "Toast V2",
    "bf": "Rerender UI V3",
    "bg": "Set Inputs V2",
    "bh": "Close Modal V2",
    "bi": "Update Loading V2",
    "bj": "Table Page Change Response V2",
    "bk": "Stale State Update V2",
    "bl": "File Transfer V2",
}


class SERVER_TO_SDK_EVENT_TYPE:
    START_EXECUTION = "aa"
    ON_CLICK_HOOK = "ab"
    ON_SUBMIT_FORM_HOOK = "ac"
    FILE_TRANSFER = "ad"
    CHECK_EXECUTION_EXISTS = "ae"
    ON_ENTER_HOOK = "af"
    ON_SELECT_HOOK = "ag"
    ON_FILE_CHANGE_HOOK = "ah"
    ON_TABLE_ROW_ACTION_HOOK = "ai"
    ON_CONFIRM_RESPONSE_HOOK = "aj"
    BROWSER_SESSION_ENDED = "ak"
    ON_CLOSE_MODAL = "al"
    ON_TABLE_PAGE_CHANGE_HOOK = "am"


class EventType:
    SdkToServer = SDK_TO_SERVER_EVENT_TYPE
    SdkToServerPretty = SDK_TO_SERVER_EVENT_TYPE_TO_PRETTY
    ServerToSdk = SERVER_TO_SDK_EVENT_TYPE
