# type: ignore

from typing import TypedDict, List

from ...json import JSON
from ...ui import ComponentReturn, is_interactive_component, INTERACTION_TYPE, TYPE
from ...compress import Compress

from .apply_ids import apply_ids
from .metadata import get_component_metadata


class DiffMap(TypedDict):
    delete: List[str]
    add: dict[str, ComponentReturn]
    update: dict[str, ComponentReturn]
    id_map: dict[str, str]


def interactive_component_id_changed(
    old_component: ComponentReturn, new_component: ComponentReturn
) -> bool:
    if is_interactive_component(old_component):
        return old_component["model"]["id"] != new_component["model"]["id"]

    return False


def diff_static_layouts_recursive(
    old_layout: ComponentReturn, new_layout: ComponentReturn
) -> DiffMap:
    # Option 1: The component has changed entirely. In this case,
    # delete the old component and add the new component.
    interactive_id_changed = interactive_component_id_changed(old_layout, new_layout)
    if old_layout["type"] != new_layout["type"] or (
        interactive_id_changed and old_layout["type"] != TYPE.BUTTON_FORM_SUBMIT
    ):
        compressed = Compress.ui_tree(new_layout)

        return {
            "delete": [old_layout["model"]["id"]],
            "add": {new_layout["model"]["id"]: compressed},
            "update": {},
            "id_map": {},
        }

    # Option 2: The components are the same and not layout types, meaning
    # they are "leaf" components without children. In this case, we'll
    # stringify the models and compare to see if they're different.
    #
    # Technically, we only need to check one of the layouts, but we
    # check both to satisfy type safety.
    if (
        old_layout["interactionType"] != INTERACTION_TYPE.LAYOUT
        or new_layout["interactionType"] != INTERACTION_TYPE.LAYOUT
    ):
        # For non-input components, ids are regenerated on every render,
        # so we need to ignore them when comparing.
        old_model = JSON.remove_keys(old_layout["model"], ["id"])
        new_model = JSON.remove_keys(new_layout["model"], ["id"])

        if JSON.to_bytes(old_model) != JSON.to_bytes(new_model):
            compressed = Compress.ui_tree(new_layout)
            compressed_model = JSON.remove_keys(compressed["model"], ["id"])

            return {
                "delete": [],
                "add": {},
                "update": {old_layout["model"]["id"]: compressed_model},  # type: ignore
                "id_map": {new_layout["model"]["id"]: old_layout["model"]["id"]},
            }
        else:
            return {
                "delete": [],
                "add": {},
                "update": {},
                "id_map": {new_layout["model"]["id"]: old_layout["model"]["id"]},
            }

    # Option 3: The components are the same and are layout types, meaning
    # they have children. In this case, we need to compare both the
    # children and the models.
    update_obj: dict[str, dict] = {}
    add_obj: dict[str, ComponentReturn] = {}
    delete_arr: List[str] = []

    # We'll start by iterating through the children.
    old_children = (
        old_layout["model"]["children"]
        if isinstance(old_layout["model"]["children"], list)
        else [old_layout["model"]["children"]]
    )

    new_children = (
        new_layout["model"]["children"]
        if isinstance(new_layout["model"]["children"], list)
        else [new_layout["model"]["children"]]
    )

    # We'll iterate over the children with the longest length to ensure
    # we catch all the children.
    iterator_count = max(len(old_children), len(new_children))

    # Need to keep track of the new list of child IDs to attach to the
    # layout component.
    child_ids = []

    id_map: dict[str, str] = {}

    for i in range(iterator_count):
        old_child = old_children[i] if i < len(old_children) else None
        new_child = new_children[i] if i < len(new_children) else None

        # If both children exist, we'll compare them recursively.
        if old_child is not None and new_child is not None:
            child_diff = diff_static_layouts_recursive(old_child, new_child)

            if new_child["model"]["id"] in child_diff["add"]:
                child_ids.append(new_child["model"]["id"])
            else:
                child_ids.append(old_child["model"]["id"])

            update_obj = {**update_obj, **child_diff["update"]}  # type: ignore
            add_obj = {**add_obj, **child_diff["add"]}
            delete_arr = [*delete_arr, *child_diff["delete"]]
            id_map = {**id_map, **child_diff["id_map"]}

        # If the old child doesn't exist but the new child does, we'll add the new child.
        if old_child is None and new_child is not None:
            child_ids.append(new_child["model"]["id"])
            add_obj[new_child["model"]["id"]] = new_child

        # If the old child exists but the new child doesn't, we'll delete the old child.
        if old_child is not None and new_child is None:
            delete_arr.append(old_child["model"]["id"])

    # Next, we'll compare the models of the layouts themselves.
    children_did_change = len(child_ids) != len(old_children) or any(
        old_children[idx]["model"]["id"] != id for idx, id in enumerate(child_ids)
    )

    old_model = JSON.remove_keys(old_layout["model"], ["id", "children"])
    new_model = JSON.remove_keys(new_layout["model"], ["id", "children"])

    if JSON.to_bytes(old_model) != JSON.to_bytes(new_model) or children_did_change:
        compressed = Compress.ui_tree_without_recursion(new_layout)
        compressed_model = JSON.remove_keys(compressed["model"], ["id", "children"])

        update_obj[old_layout["model"]["id"]] = {
            **compressed_model,
            "children": child_ids,
        }

    id_map = {**id_map, new_layout["model"]["id"]: old_layout["model"]["id"]}

    return {
        "delete": delete_arr,
        "add": add_obj,
        "update": update_obj,  # type: ignore
        "id_map": id_map,
    }


def diff_static_layouts(old_layout: ComponentReturn, new_layout: ComponentReturn):
    """
    Diff two static layouts.

    NOTE: The deleted IDs covers the branches of the layout that have been
    deleted, but does not exhaustively list all the IDs that need to be deleted.
    For example, if an entire stack is deleted, then only the root stack ID is
    included in the `delete` array. It is up to the client to delete any
    stranded leaf nodes as a result of a deleted branch.
    """
    diff = diff_static_layouts_recursive(old_layout, new_layout)

    new_layout_with_ids_applied = apply_ids(new_layout, diff["id_map"])
    root_id = new_layout_with_ids_applied["model"]["id"]

    metadata = get_component_metadata(new_layout_with_ids_applied)

    is_empty = (
        len(diff["delete"]) == 0 and len(diff["add"]) == 0 and len(diff["update"]) == 0
    )

    return {
        **diff,
        "root_id": root_id,
        "metadata": metadata,
        "new_layout_with_ids_applied": new_layout_with_ids_applied,
        "did_change": not is_empty,
    }
