import base64
from typing import Union, List, Literal, Dict, Any
import io

from ..ui import (
    INTERACTION_TYPE,
    TYPE,
    Nullable,
    DISPLAY_UTILS,
    ComponentReturn,
    LanguageName,
    HeaderSize,
    TextColor,
    TextSize,
)
from ..utils import Utils


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
    style: Nullable.Style = None,
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
    style: Nullable.Style = None,
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
    json: DISPLAY_UTILS.Json,
    *,
    label: Nullable.Str = None,
    description: Nullable.Str = None,
    style: Nullable.Style = None,
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
    *, text: Nullable.Str = None, style: Nullable.Style = None
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
    style: Nullable.Style = None,
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


def display_image(src: str, *, style: Nullable.Style = None) -> ComponentReturn:
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


def display_markdown(markdown: str, *, style: Nullable.Style = None) -> ComponentReturn:
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
    label: Nullable.Str = None,
    description: Nullable.Str = None,
    annotations: Nullable.Annotations = None,
    scroll: Union[Literal["vertical", "horizontal"], None] = None,
    style: Nullable.Style = None,
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
