from enum import Enum


class INTERACTION_TYPE(str, Enum):
    INPUT = "input"
    BUTTON = "button"
    DISPLAY = "display"
    LAYOUT = "layout"
    PAGE = "page"
