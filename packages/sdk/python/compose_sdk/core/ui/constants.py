from typing import (
    Union,
    Dict,
    List,
    Any,
    Callable,
    get_type_hints,
)
from .types import (
    TableColumns,
    TableActions,
    TableActionsWithoutOnClick,
    TableActionsOnClick,
    Annotation,
)


def add_type_hints_as_class_attributes(cls: Any) -> Any:
    hints = get_type_hints(cls)
    for name, hint in hints.items():
        setattr(cls, name, hint)
    return cls


@add_type_hints_as_class_attributes
class Nullable:
    NoArgumentsCallable = Union[Callable[[], Any], None]
    Callable = Union[Callable[..., Any], None]
    Annotations = Union[List[Annotation], None]
    TableColumns = Union[TableColumns, None]
    TableActions = Union[TableActions, None]
    TableActionsWithoutOnClick = Union[TableActionsWithoutOnClick, None]
    TableActionsOnClick = Union[TableActionsOnClick, None]

    class List:
        Str = Union[List[str], None]
        Int = Union[List[int], None]
        Float = Union[List[float], None]
        Bool = Union[List[bool], None]
