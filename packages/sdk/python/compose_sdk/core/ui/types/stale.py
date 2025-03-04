from typing import Literal


class Stale:
    FALSE = False
    INITIALLY_STALE = "INITIALLY_STALE"
    UPDATE_DISABLED = "UPDATE_DISABLED"
    UPDATE_NOT_DISABLED = "UPDATE_NOT_DISABLED"
    TYPE = Literal[False, "INITIALLY_STALE", "UPDATE_DISABLED", "UPDATE_NOT_DISABLED"]
