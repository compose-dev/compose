from typing import TypedDict, Union
from ...ui import ComponentReturn, INTERACTION_TYPE, TYPE


class Metadata(TypedDict):
    formId: Union[str, None]


def get_component_metadata_recursive(
    layout: ComponentReturn, parent_form_id: Union[str, None]
) -> dict[str, Metadata]:
    if layout["interactionType"] != INTERACTION_TYPE.LAYOUT:
        return {layout["model"]["id"]: {"formId": parent_form_id}}

    children = (
        layout["model"]["children"]
        if isinstance(layout["model"]["children"], list)
        else [layout["model"]["children"]]
    )

    new_form_id = (
        layout["model"]["id"] if layout["type"] == TYPE.LAYOUT_FORM else parent_form_id
    )

    children_metadata = [
        get_component_metadata_recursive(child, new_form_id) for child in children
    ]

    # Merge all children metadata
    merged_metadata = {layout["model"]["id"]: {"formId": new_form_id}}

    for child_metadata in children_metadata:
        merged_metadata.update(child_metadata)  # type: ignore

    return merged_metadata  # type: ignore


def get_component_metadata(layout: ComponentReturn) -> dict[str, Metadata]:
    return get_component_metadata_recursive(layout, None)
