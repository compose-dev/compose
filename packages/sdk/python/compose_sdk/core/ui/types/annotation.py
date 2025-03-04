from typing import Literal
from typing_extensions import NotRequired, TypedDict


class Annotation(TypedDict):
    """Represents an annotation on a PDF document."""

    x1: int
    """The x coordinate of the top left corner of the annotation."""

    y1: int
    """The y coordinate of the top left corner of the annotation."""

    x2: int
    """The x coordinate of the bottom right corner of the annotation."""

    y2: int
    """The y coordinate of the bottom right corner of the annotation."""

    appearance: NotRequired[Literal["box", "highlight"]]
    """
    The appearance of the annotation.
    Defaults to "highlight" if not specified.
    """

    label: NotRequired[str]
    """Optional label for the annotation."""

    page: NotRequired[int]
    """
    Which page number of the PDF the annotation is on.
    Defaults to 1 if not specified.
    """

    color: NotRequired[
        Literal["blue", "yellow", "green", "red", "purple", "orange", "gray"]
    ]
    """
    The color of the annotation.
    Defaults to "blue" if not specified.
    """
