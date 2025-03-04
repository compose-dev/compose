from typing import (
    Union,
    Dict,
    List,
    Any,
    Callable,
    get_type_hints,
)
from .types import (
    ComponentStyle,
    TableColumns,
    TableActions,
    TableActionsWithoutOnClick,
    TableActionsOnClick,
    SelectOptionValue,
    Annotation,
)
import datetime


def add_type_hints_as_class_attributes(cls: Any) -> Any:
    hints = get_type_hints(cls)
    for name, hint in hints.items():
        setattr(cls, name, hint)
    return cls


@add_type_hints_as_class_attributes
class DISPLAY_UTILS:
    JsonValue = Union[str, int, float, bool, None, Dict[str, Any], List[Any]]
    Json = Union[Dict[str, JsonValue], List[JsonValue]]


@add_type_hints_as_class_attributes
class Nullable:
    NoArgumentsCallable = Union[Callable[[], Any], None]
    Callable = Union[Callable[..., Any], None]
    Str = Union[str, None]
    Bool = Union[bool, None]
    Int = Union[int, None]
    Float = Union[float, None]
    Number = Union[int, float, None]
    Date = Union[datetime.date, datetime.datetime, None]
    Time = Union[datetime.time, datetime.datetime, None]
    Datetime = Union[datetime.datetime, None]
    Style = Union[ComponentStyle, None]
    Annotations = Union[List[Annotation], None]
    TableColumns = Union[TableColumns, None]
    TableActions = Union[TableActions, None]
    TableActionsWithoutOnClick = Union[TableActionsWithoutOnClick, None]
    TableActionsOnClick = Union[TableActionsOnClick, None]

    SelectOptionValue = Union[SelectOptionValue, None]

    class List:
        Str = Union[List[str], None]
        Int = Union[List[int], None]
        Float = Union[List[float], None]
        Bool = Union[List[bool], None]
