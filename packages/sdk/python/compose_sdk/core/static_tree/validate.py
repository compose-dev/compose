# type: ignore

from typing import Union
from ..ui import INTERACTION_TYPE, TYPE, ComponentReturn

MAX_DEPTH = 100


def validate_static_layout_recursive(
    layout: ComponentReturn, parent_form_id: str, depth: int
) -> Union[str, dict[str, bool]]:
    """
    Internal recursive function for validating a static layout. Checks:
    - That the component ID is a string
    - That all components have unique IDs
    - That a form is not inside another form
    - That the component tree does not exceed a depth of 100 (to prevent stack overflow)
    """

    if not isinstance(layout["model"]["id"], str):
        return "Component IDs must be a string"

    if parent_form_id is not None and layout["type"] == TYPE.LAYOUT_FORM:
        return "Cannot render a form inside another form"

    if depth > MAX_DEPTH:
        return f"Maximum component tree depth of {MAX_DEPTH} exceeded"

    ids = {layout["model"]["id"]: True}

    if layout["interactionType"] != INTERACTION_TYPE.LAYOUT:
        return ids

    children = (
        layout["model"]["children"]
        if isinstance(layout["model"]["children"], list)
        else [layout["model"]["children"]]
    )

    new_form_id = (
        layout["model"]["id"] if layout["type"] == TYPE.LAYOUT_FORM else parent_form_id
    )

    for child in children:
        child_ids = validate_static_layout_recursive(child, new_form_id, depth + 1)

        if isinstance(child_ids, str):
            return child_ids

        merged_ids = {**ids, **child_ids}

        if len(merged_ids) != len(ids) + len(child_ids):
            duplicate_id = next((id for id in child_ids if id in ids), None)
            return f"Duplicate component ID found: '{duplicate_id or '<Unknown ID>'}'. All component IDs must be unique."

        ids = merged_ids

    return ids


def validate_static_layout(layout) -> Union[str, None]:
    result = validate_static_layout_recursive(layout, None, 0)

    if isinstance(result, str):
        return result

    return None
