# type: ignore

import datetime

from typing import Union, Callable, List
from ...ui import (
    INTERACTION_TYPE,
    TYPE,
    SelectOptionValue,
    SelectOptions,
    ComponentReturn,
    ValidatorResponse,
    VoidResponse,
    ComponentStyle,
)
from ...file import File
from ...date_utils import DateUtils
from ..base import MULTI_SELECTION_MIN_DEFAULT, MULTI_SELECTION_MAX_DEFAULT
from .tableComponent import table, dataframe
from ...types import Json


def input_text(
    id: str,
    *,
    label: str = None,
    required: bool = True,
    description: str = None,
    initial_value: Union[str, None] = None,
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[Union[str, None]], ValidatorResponse],
    ] = None,
    on_enter: Union[
        Callable[[], VoidResponse],
        Callable[[Union[str, None]], VoidResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": {
                "initialValue": initial_value,
                "hasOnEnterHook": on_enter is not None,
            },
        },
        "hooks": {
            "validate": validate,
            "onEnter": on_enter,
        },
        "type": TYPE.INPUT_TEXT,
        "interactionType": INTERACTION_TYPE.INPUT,
    }


def input_email(
    id: str,
    *,
    label: str = None,
    required: bool = True,
    description: str = None,
    initial_value: Union[str, None] = None,
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[Union[str, None]], ValidatorResponse],
    ] = None,
    on_enter: Union[
        Callable[[], VoidResponse],
        Callable[[Union[str, None]], VoidResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": {
                "initialValue": initial_value,
                "hasOnEnterHook": on_enter is not None,
            },
        },
        "hooks": {
            "validate": validate,
            "onEnter": on_enter,
        },
        "type": TYPE.INPUT_EMAIL,
        "interactionType": INTERACTION_TYPE.INPUT,
    }


def input_url(
    id: str,
    *,
    label: Union[str, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_value: Union[str, None] = None,
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[Union[str, None]], ValidatorResponse],
    ] = None,
    on_enter: Union[
        Callable[[], VoidResponse],
        Callable[[Union[str, None]], VoidResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": {
                "initialValue": initial_value,
                "hasOnEnterHook": on_enter is not None,
            },
        },
        "hooks": {
            "validate": validate,
            "onEnter": on_enter,
        },
        "type": TYPE.INPUT_URL,
        "interactionType": INTERACTION_TYPE.INPUT,
    }


def input_number(
    id: str,
    *,
    label: str = None,
    required: bool = True,
    description: str = None,
    initial_value: Union[int, float, None] = None,
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[Union[int, float, None]], ValidatorResponse],
    ] = None,
    on_enter: Union[
        Callable[[], VoidResponse],
        Callable[[Union[int, float, None]], VoidResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": {
                "hasOnEnterHook": on_enter is not None,
                "initialValue": initial_value,
            },
        },
        "hooks": {
            "validate": validate,
            "onEnter": on_enter,
        },
        "type": TYPE.INPUT_NUMBER,
        "interactionType": INTERACTION_TYPE.INPUT,
    }


def input_password(
    id: str,
    *,
    label: Union[str, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_value: Union[str, None] = None,
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[Union[str, None]], ValidatorResponse],
    ] = None,
    on_enter: Union[
        Callable[[], VoidResponse],
        Callable[[Union[str, None]], VoidResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": {
                "hasOnEnterHook": on_enter is not None,
                "initialValue": initial_value,
            },
        },
        "hooks": {
            "validate": validate,
            "onEnter": on_enter,
        },
        "type": TYPE.INPUT_PASSWORD,
        "interactionType": INTERACTION_TYPE.INPUT,
    }


NullableDate = Union[datetime.date, datetime.datetime, None]


def input_date(
    id: str,
    *,
    label: Union[str, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_value: NullableDate = None,
    min: NullableDate = None,
    max: NullableDate = None,
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[Union[datetime.date, None]], ValidatorResponse],
    ] = None,
    on_enter: Union[
        Callable[[], VoidResponse],
        Callable[[Union[datetime.date, None]], VoidResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:

    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": {
                "min": DateUtils.convert_date(min),
                "max": DateUtils.convert_date(max),
                "hasOnEnterHook": on_enter is not None,
                "initialValue": DateUtils.convert_date(initial_value),
            },
        },
        "hooks": {
            "validate": validate,
            "onEnter": on_enter,
        },
        "type": TYPE.INPUT_DATE,
        "interactionType": INTERACTION_TYPE.INPUT,
    }


NullableTime = Union[datetime.time, datetime.datetime, None]


def input_time(
    id: str,
    *,
    label: Union[str, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_value: NullableTime = None,
    min: NullableTime = None,
    max: NullableTime = None,
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[Union[datetime.time, None]], ValidatorResponse],
    ] = None,
    on_enter: Union[
        Callable[[], VoidResponse],
        Callable[[Union[datetime.time, None]], VoidResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:

    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": {
                "min": DateUtils.convert_time(min),
                "max": DateUtils.convert_time(max),
                "hasOnEnterHook": on_enter is not None,
                "initialValue": DateUtils.convert_time(initial_value),
            },
        },
        "hooks": {
            "validate": validate,
            "onEnter": on_enter,
        },
        "type": TYPE.INPUT_TIME,
        "interactionType": INTERACTION_TYPE.INPUT,
    }


NullableDatetime = Union[datetime.datetime, None]


def input_datetime(
    id: str,
    *,
    label: Union[str, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_value: NullableDatetime = None,
    min: NullableDatetime = None,
    max: NullableDatetime = None,
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[NullableDatetime], ValidatorResponse],
    ] = None,
    on_enter: Union[
        Callable[[], VoidResponse],
        Callable[[NullableDatetime], VoidResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:

    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": {
                "min": DateUtils.convert_datetime(min),
                "max": DateUtils.convert_datetime(max),
                "hasOnEnterHook": on_enter is not None,
                "initialValue": DateUtils.convert_datetime(initial_value),
            },
        },
        "hooks": {
            "validate": validate,
            "onEnter": on_enter,
        },
        "type": TYPE.INPUT_DATE_TIME,
        "interactionType": INTERACTION_TYPE.INPUT,
    }


def radio_group(
    id: str,
    options: SelectOptions,
    *,
    label: Union[str, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_value: Union[SelectOptionValue, None] = None,
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[Union[SelectOptionValue, None]], ValidatorResponse],
    ] = None,
    on_change: Union[
        Callable[[], VoidResponse],
        Callable[[Union[SelectOptionValue, None]], VoidResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    if not isinstance(options, list):
        raise TypeError(
            f"options must be a list for radio group, got {type(options).__name__}"
        )

    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": {
                "initialValue": initial_value,
                "hasOnSelectHook": on_change is not None,
                "options": options,
            },
        },
        "hooks": {
            "validate": validate,
            "onSelect": on_change,
        },
        "type": TYPE.INPUT_RADIO_GROUP,
        "interactionType": INTERACTION_TYPE.INPUT,
    }


def checkbox(
    id: str,
    *,
    label: Union[str, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_value: bool = False,
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[bool], ValidatorResponse],
    ] = None,
    on_change: Union[
        Callable[[], VoidResponse],
        Callable[[bool], VoidResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": {
                "initialValue": initial_value,
                "hasOnSelectHook": on_change is not None,
            },
        },
        "hooks": {
            "validate": validate,
            "onSelect": on_change,
        },
        "type": TYPE.INPUT_CHECKBOX,
        "interactionType": INTERACTION_TYPE.INPUT,
    }


def select_dropdown_single(
    id: str,
    options: SelectOptions,
    *,
    label: Union[str, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_value: Union[SelectOptionValue, None] = None,
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[Union[SelectOptionValue, None]], ValidatorResponse],
    ] = None,
    on_change: Union[
        Callable[[], VoidResponse],
        Callable[[Union[SelectOptionValue, None]], VoidResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    if not isinstance(options, list):
        raise TypeError(
            f"options must be a list for select dropdown, got {type(options).__name__}"
        )

    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": {
                "hasOnSelectHook": on_change is not None,
                "options": options,
                "initialValue": initial_value,
            },
        },
        "hooks": {
            "validate": validate,
            "onSelect": on_change,
        },
        "type": TYPE.INPUT_SELECT_DROPDOWN_SINGLE,
        "interactionType": INTERACTION_TYPE.INPUT,
    }


def select_dropdown_multi(
    id: str,
    options: SelectOptions,
    *,
    label: Union[str, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_value: List[SelectOptionValue] = [],
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[List[SelectOptionValue]], ValidatorResponse],
    ] = None,
    on_change: Union[
        Callable[[], VoidResponse],
        Callable[[List[SelectOptionValue]], VoidResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
    min_selections: int = MULTI_SELECTION_MIN_DEFAULT,
    max_selections: int = MULTI_SELECTION_MAX_DEFAULT,
) -> ComponentReturn:
    if not isinstance(options, list):
        raise TypeError(
            f"options must be a list for select dropdown, got {type(options).__name__}"
        )

    if not isinstance(initial_value, list):
        raise TypeError(
            f"initial_value must be a list for multiselect box, got {type(initial_value).__name__}"
        )

    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": {
                "initialValue": initial_value,
                "hasOnSelectHook": on_change is not None,
                "options": options,
                "minSelections": min_selections,
                "maxSelections": max_selections,
            },
        },
        "hooks": {
            "validate": validate,
            "onSelect": on_change,
        },
        "type": TYPE.INPUT_SELECT_DROPDOWN_MULTI,
        "interactionType": INTERACTION_TYPE.INPUT,
    }


def input_file_drop(
    id: str,
    *,
    label: str = None,
    required: bool = True,
    description: str = None,
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[List[File]], ValidatorResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
    on_change: Union[
        Callable[[], VoidResponse],
        Callable[[List[File]], VoidResponse],
    ] = None,
    accepted_file_types: List[str] = None,
    min_count: int = MULTI_SELECTION_MIN_DEFAULT,
    max_count: int = MULTI_SELECTION_MAX_DEFAULT,
) -> ComponentReturn:
    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": {
                "hasOnFileChangeHook": on_change is not None,
                "acceptedFileTypes": accepted_file_types,
                "minCount": min_count,
                "maxCount": max_count,
            },
        },
        "hooks": {
            "validate": validate,
            "onFileChange": on_change,
        },
        "type": TYPE.INPUT_FILE_DROP,
        "interactionType": INTERACTION_TYPE.INPUT,
    }


def input_text_area(
    id: str,
    *,
    label: Union[str, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_value: Union[str, None] = None,
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[Union[str, None]], ValidatorResponse],
    ] = None,
    on_enter: Union[
        Callable[[], VoidResponse],
        Callable[[Union[str, None]], VoidResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": {
                "initialValue": initial_value,
                "hasOnEnterHook": on_enter is not None,
            },
        },
        "hooks": {
            "validate": validate,
            "onEnter": on_enter,
        },
        "type": TYPE.INPUT_TEXT_AREA,
        "interactionType": INTERACTION_TYPE.INPUT,
    }


def input_json(
    id: str,
    *,
    label: Union[str, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_value: Union[Json, None] = None,
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[Union[Json, None]], ValidatorResponse],
    ] = None,
    on_enter: Union[
        Callable[[], VoidResponse],
        Callable[[Union[Json, None]], VoidResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
) -> ComponentReturn:
    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": {
                "initialValue": initial_value,
                "hasOnEnterHook": on_enter is not None,
            },
        },
        "hooks": {
            "validate": validate,
            "onEnter": on_enter,
        },
        "type": TYPE.INPUT_JSON,
        "interactionType": INTERACTION_TYPE.INPUT,
    }
