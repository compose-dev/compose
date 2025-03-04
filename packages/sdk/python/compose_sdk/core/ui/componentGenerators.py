from typing import Any, Dict, TypedDict

from .types import TYPE, INTERACTION_TYPE


class ComponentReturn(TypedDict):
    type: TYPE
    interactionType: INTERACTION_TYPE
    model: Dict[str, Any]
    hooks: Any
