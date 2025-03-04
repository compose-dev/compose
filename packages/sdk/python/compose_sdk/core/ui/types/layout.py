from typing import Literal, Union
from typing_extensions import Annotated

LAYOUT_DIRECTION = Literal[
    "vertical",
    "vertical-reverse",
    "horizontal",
    "horizontal-reverse",
]

LAYOUT_DIRECTION_DEFAULT: LAYOUT_DIRECTION = "vertical"

LAYOUT_JUSTIFY = Literal[
    "start",
    "end",
    "center",
    "between",
    "around",
    "evenly",
]

LAYOUT_JUSTIFY_DEFAULT: LAYOUT_JUSTIFY = "start"

LAYOUT_ALIGN = Literal[
    "start",
    "end",
    "center",
    "baseline",
    "stretch",
]

LAYOUT_ALIGN_DEFAULT: LAYOUT_ALIGN = "start"

LAYOUT_SPACING = Union[
    Literal[
        "0px",
        "2px",
        "4px",
        "8px",
        "12px",
        "16px",
        "20px",
        "24px",
        "28px",
        "32px",
        "40px",
        "48px",
        "56px",
        "64px",
        "72px",
        "80px",
        "88px",
        "96px",
        "104px",
        "112px",
        "120px",
        "128px",
        "136px",
        "144px",
        "152px",
        "160px",
    ],
    Annotated[str, lambda s: s.endswith("px")],  # type: ignore[unused-ignore]
]

LAYOUT_SPACING_DEFAULT: LAYOUT_SPACING = "16px"
