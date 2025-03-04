from enum import Enum


class TYPE(str, Enum):
    # INPUT TYPES
    INPUT_TEXT = "input-text"
    INPUT_NUMBER = "input-number"
    INPUT_EMAIL = "input-email"
    INPUT_URL = "input-url"
    INPUT_PASSWORD = "input-password"
    INPUT_RADIO_GROUP = "input-radio-group"
    INPUT_SELECT_DROPDOWN_SINGLE = "input-select-dropdown-single"
    INPUT_SELECT_DROPDOWN_MULTI = "input-select-dropdown-multi"
    INPUT_TABLE = "input-table"
    INPUT_FILE_DROP = "input-file-drop"
    INPUT_DATE = "input-date"
    INPUT_TIME = "input-time"
    INPUT_DATE_TIME = "input-date-time"
    INPUT_TEXT_AREA = "input-text-area"
    INPUT_CHECKBOX = "input-checkbox"

    # BUTTON TYPES
    BUTTON_DEFAULT = "button-default"
    BUTTON_FORM_SUBMIT = "button-form-submit"
    BUTTON_BAR_CHART = "btn-bar-chart"
    BUTTON_LINE_CHART = "btn-line-chart"

    # DISPLAY TYPES
    DISPLAY_TEXT = "display-text"
    DISPLAY_HEADER = "display-header"
    DISPLAY_JSON = "display-json"
    DISPLAY_SPINNER = "display-spinner"
    DISPLAY_CODE = "display-code"
    DISPLAY_IMAGE = "display-image"
    DISPLAY_MARKDOWN = "display-markdown"
    DISPLAY_PDF = "display-pdf"
    # A special type that's used to represent when a render returns None
    DISPLAY_NONE = "display-none"

    # LAYOUT TYPES
    LAYOUT_STACK = "layout-stack"
    LAYOUT_FORM = "layout-form"

    # PAGE TYPES
    # Special types that won't ever show up in the normal UI tree, but are used
    # by page actions. They aren't included in any of the union types
    # (e.g. UI.Components.All)
    PAGE_CONFIRM = "page-confirm"
