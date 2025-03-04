from .types import TYPE, INTERACTION_TYPE
from .componentGenerators import ComponentReturn


def is_interactive_component(component: ComponentReturn) -> bool:
    return (
        component["interactionType"] == INTERACTION_TYPE.INPUT
        or component["interactionType"] == INTERACTION_TYPE.BUTTON
        or component["type"] == TYPE.LAYOUT_FORM
    )
