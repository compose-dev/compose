import base64
from typing import Union, List, Literal, Dict, Any, Callable
import io
import inspect

from ..ui import (
    INTERACTION_TYPE,
    TYPE,
    Nullable,
    ComponentReturn,
    LanguageName,
    HeaderSize,
    TextColor,
    TextSize,
    ComponentStyle,
    NumberFormat,
)
from ..utils import Utils
from ..types import Json


def display_text(
    text: Union[
        str,
        int,
        float,
        ComponentReturn,
        List[Union[str, int, float, ComponentReturn]],
    ],
    *,
    color: Union[TextColor, None] = None,
    size: Union[TextSize, None] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    id = Utils.generate_id()

    model_properties = {
        "text": text,
    }

    optional_properties = {
        "color": color,
        "size": size,
    }

    for key, value in optional_properties.items():
        if value is not None:
            model_properties[key] = value

    return {
        "model": {"id": id, "style": style, "properties": model_properties},
        "hooks": None,
        "type": TYPE.DISPLAY_TEXT,
        "interactionType": INTERACTION_TYPE.DISPLAY,
    }


def display_header(
    text: str,
    *,
    color: Union[TextColor, None] = None,
    size: Union[HeaderSize, None] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    id = Utils.generate_id()

    model_properties = {
        "text": text,
    }

    optional_properties = {
        "color": color,
        "size": size,
    }

    for key, value in optional_properties.items():
        if value is not None:
            model_properties[key] = value

    return {
        "model": {"id": id, "style": style, "properties": model_properties},
        "hooks": None,
        "type": TYPE.DISPLAY_HEADER,
        "interactionType": INTERACTION_TYPE.DISPLAY,
    }


def display_json(
    json: Json,
    *,
    label: Union[str, None] = None,
    description: Union[str, None] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    id = Utils.generate_id()

    return {
        "model": {
            "id": id,
            "style": style,
            "properties": {
                "label": label,
                "description": description,
                "json": json,
            },
        },
        "hooks": None,
        "type": TYPE.DISPLAY_JSON,
        "interactionType": INTERACTION_TYPE.DISPLAY,
    }


def display_spinner(
    *, text: Union[str, None] = None, style: Union[ComponentStyle, None] = None
) -> ComponentReturn:
    id = Utils.generate_id()

    return {
        "model": {
            "id": id,
            "style": style,
            "properties": {
                "text": text,
            },
        },
        "hooks": None,
        "type": TYPE.DISPLAY_SPINNER,
        "interactionType": INTERACTION_TYPE.DISPLAY,
    }


def display_code(
    code: str,
    *,
    label: Union[str, None] = None,
    description: Union[str, None] = None,
    lang: Union[LanguageName, None] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    id = Utils.generate_id()

    model_properties = {
        "code": code,
    }

    optional_properties = {
        "label": label,
        "description": description,
        "lang": lang,
    }

    for key, value in optional_properties.items():
        if value is not None:
            model_properties[key] = value

    return {
        "model": {
            "id": id,
            "style": style,
            "properties": model_properties,
        },
        "hooks": None,
        "type": TYPE.DISPLAY_CODE,
        "interactionType": INTERACTION_TYPE.DISPLAY,
    }


def display_image(
    src: str, *, style: Union[ComponentStyle, None] = None
) -> ComponentReturn:
    id = Utils.generate_id()

    return {
        "model": {
            "id": id,
            "style": style,
            "properties": {
                "src": src,
            },
        },
        "hooks": None,
        "type": TYPE.DISPLAY_IMAGE,
        "interactionType": INTERACTION_TYPE.DISPLAY,
    }


def display_markdown(
    markdown: str, *, style: Union[ComponentStyle, None] = None
) -> ComponentReturn:
    id = Utils.generate_id()

    return {
        "model": {
            "id": id,
            "style": style,
            "properties": {
                "markdown": markdown,
            },
        },
        "hooks": None,
        "type": TYPE.DISPLAY_MARKDOWN,
        "interactionType": INTERACTION_TYPE.DISPLAY,
    }


def display_pdf(
    file: Union[bytes, io.BufferedIOBase],
    *,
    label: Union[str, None] = None,
    description: Union[str, None] = None,
    annotations: Nullable.Annotations = None,
    scroll: Union[Literal["vertical", "horizontal"], None] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    id = Utils.generate_id()

    if isinstance(file, io.BufferedIOBase):
        file.seek(0)
        file_content = file.read()
    elif isinstance(file, bytes):  # type: ignore[redundant-isinstance, unused-ignore]
        file_content = file
    else:
        raise TypeError(
            "The 'file' argument must be of type 'bytes' or a bytes-like object that supports the read() method (e.g., BytesIO). "
            "Please provide the PDF content as bytes or a bytes-like object."
        )

    # Convert bytes to base64
    base64_pdf = base64.b64encode(file_content).decode("utf-8")
    base64_pdf_with_prefix = f"data:application/pdf;base64,{base64_pdf}"

    model_properties: Dict[str, Any] = {
        "base64": base64_pdf_with_prefix,
    }

    optional_properties = {
        "label": label,
        "description": description,
        "annotations": annotations,
        "scroll": scroll,
    }

    for key, value in optional_properties.items():
        if value is not None:
            model_properties[key] = value

    return {
        "model": {
            "id": id,
            "style": style,
            "properties": model_properties,
        },
        "hooks": None,
        "type": TYPE.DISPLAY_PDF,
        "interactionType": INTERACTION_TYPE.DISPLAY,
    }


def display_divider(
    *,
    orientation: Union[Literal["horizontal", "vertical"], None] = None,
    thickness: Union[Literal["thin", "medium", "thick"], None] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    """Displays a divider line to visually separate content. For example:

    >>> page.add(lambda: ui.stack([
    ...     ui.text("First item"),
    ...     ui.divider(),
    ...     ui.text("Second item"),
    ... ]))

    Optional keyword arguments:
    - `orientation`: The orientation of the divider. Options: "horizontal" or "vertical". Defaults to "horizontal".
    - `thickness`: The thickness of the divider. Options: "thin" (1px), "medium" (2px), or "thick" (4px). Defaults to "thin".
    - `style`: CSS styles object applied directly to the divider HTML element. Defaults to `None`.

    Returns a configured divider component.

    Read the full documentation: https://docs.composehq.com/components/display/divider
    """
    id = Utils.generate_id()

    model_properties: Dict[str, Any] = {}

    optional_properties = {
        "orientation": orientation,
        "thickness": thickness,
    }

    for key, value in optional_properties.items():
        if value is not None:
            model_properties[key] = value

    return {
        "model": {"id": id, "style": style, "properties": model_properties},
        "hooks": None,
        "type": TYPE.DISPLAY_DIVIDER,
        "interactionType": INTERACTION_TYPE.DISPLAY,
    }


def display_statistic(
    label: Union[str, None] = None,
    value: Union[int, float, None] = None,
    *,
    description: Union[str, None] = None,
    format: Union[NumberFormat, None] = None,
    delta: Union[int, float, None] = None,
    decimals: Union[int, None] = None,
    prefix: Union[str, None] = None,
    suffix: Union[str, None] = None,
    delta_format: Union[NumberFormat, None] = None,
    delta_decimals: Union[int, None] = None,
    is_positive_delta: Union[
        bool, Callable[[], bool], Callable[[Union[int, float]], bool], None
    ] = None,
    label_color: Union[TextColor, None] = None,
    value_color: Union[TextColor, None] = None,
    description_color: Union[TextColor, None] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    """Displays a statistic with optional label, value, description, and delta indicators.

    >>> # Basic usage
    ... page.add(lambda: ui.statistic("Total Users", 1571))
    ...
    ... # With delta indicator
    ... page.add(lambda: ui.statistic(
    ...     "Total Revenue",
    ...     11251.7,
    ...     delta=0.54,
    ...     description="Compared to last month",
    ...     format="currency",
    ...     delta_format="percent",
    ... ))

    Required positional arguments:
    - `label`: The title for the statistic.
    - `value`: The numeric value to display.

    Optional keyword arguments:
    - `description`: Additional text description displayed below the value. Defaults to `None`.
    - `format`: Number formatting to apply to the value. Options: `standard`, `currency`, `percent`. Defaults to `standard`.
    - `delta`: A numeric value representing change (will display with up/down indicators). Defaults to `None`.
    - `decimals`: Round the value to a specific number of decimal places. By default, the value is not rounded.
    - `prefix`: Text to display before the value, e.g. a symbol. Defaults to `None`. Will display the USD currency symbol if `format` is `currency`.
    - `suffix`: Text to display after the value, e.g. a unit of measurement. Defaults to `None`.
    - `delta_format`: Number formatting to apply to the delta value. Options: `standard`, `currency`, `percent`. Defaults to `standard`.
    - `delta_decimals`: Round the delta value to a specific number of decimal places. By default, the delta value is not rounded.
    - `is_positive_delta`: Override the automatic determination of whether the delta is positive. Either a boolean or lambda function that returns a boolean. Defaults to `None`.
    - `label_color`: Color for the label text. Options: `text`, `text-secondary`, `primary`, `background`, `warning`, `danger`, `success`. Defaults to `text`.
    - `value_color`: Color for the main value text. Options: `text`, `text-secondary`, `primary`, `background`, `warning`, `danger`, `success`. Defaults to `text`.
    - `description_color`: Color for the description text. Options: `text`, `text-secondary`, `primary`, `background`, `warning`, `danger`, `success`. Defaults to `text-secondary`.
    - `style`: CSS styles object applied directly to the outermost statistic HTML element. Defaults to `None`.

    Returns a configured statistic component.

    Read the full documentation: https://docs.composehq.com/components/display/statistic
    """
    model_properties: Dict[str, Any] = {
        "label": label,
        "value": value,
    }

    optional_properties: Dict[str, Any] = {
        "description": description,
        "format": format,
        "delta": delta,
        "decimals": decimals,
        "prefix": prefix,
        "suffix": suffix,
        "deltaFormat": delta_format,
        "deltaDecimals": delta_decimals,
        "isPositiveDelta": is_positive_delta,
        "labelColor": label_color,
        "valueColor": value_color,
        "descriptionColor": description_color,
    }

    for key, value in optional_properties.items():
        if value is not None:
            model_properties[key] = value

    # Calculate the custom positive delta if it's a lambda function
    if "isPositiveDelta" in model_properties and callable(
        model_properties["isPositiveDelta"]
    ):
        # Check if the lambda function accepts an argument
        sig = inspect.signature(model_properties["isPositiveDelta"])

        # If the function accepts an argument, pass the delta value
        if len(sig.parameters) > 0:
            model_properties["isPositiveDelta"] = model_properties["isPositiveDelta"](
                delta
            )
        else:
            # Otherwise call it without arguments
            model_properties["isPositiveDelta"] = model_properties["isPositiveDelta"]()

    return {
        "model": {
            "id": Utils.generate_id(),
            "style": style,
            "properties": model_properties,
        },
        "hooks": None,
        "type": TYPE.DISPLAY_STATISTIC,
        "interactionType": INTERACTION_TYPE.DISPLAY,
    }


def display_none() -> ComponentReturn:
    id = Utils.generate_id()

    return {
        "model": {
            "id": id,
            "style": None,
            "properties": {},
        },
        "hooks": None,
        "type": TYPE.DISPLAY_NONE,
        "interactionType": INTERACTION_TYPE.DISPLAY,
    }
