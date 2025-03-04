# type: ignore

from ..generator import display_none, ComponentInstance
from ..ui import TYPE, INTERACTION_TYPE, ComponentReturn
from .find_component import FindComponent
from ..utils import Utils


def configure_layout_form_submit_button_recursive(
    layout: ComponentReturn, _hide_submit_button: bool
) -> ComponentReturn:
    """
    Recursively manages form submit buttons in a layout.
    """
    hide_submit_button = _hide_submit_button

    # First, check if this is a submit button leaf node and handle accordingly
    if layout["type"] == TYPE.BUTTON_FORM_SUBMIT:
        if hide_submit_button:
            return display_none()

        return layout

    # If this branch is a form component leaf node, check if it has a
    # submit button. If it doesn't, check if we should add one.
    if layout["type"] == TYPE.LAYOUT_FORM:
        hide_submit_button = (
            layout["model"]["properties"].get("hideSubmitButton") is True
        )

        submit_button = FindComponent.by_type(layout, TYPE.BUTTON_FORM_SUBMIT)

        if submit_button is None:
            if hide_submit_button:
                return layout

            children_as_list = (
                layout["model"]["children"]
                if isinstance(layout["model"]["children"], list)
                else [layout["model"]["children"]]
            )

            new_children = [
                *children_as_list,
                ComponentInstance.submit_button(Utils.generate_id(), label="Submit"),
            ]

            return {**layout, "model": {**layout["model"], "children": new_children}}

        if not hide_submit_button:
            return layout

        # If we reach this point, it means we've found a submit button and the
        # user wants to hide it. Instead of returning, we'll continue the function
        # execution so that we recurse through the layout and remove the submit
        # buttons from the form.

    if layout["interactionType"] == INTERACTION_TYPE.LAYOUT:
        if isinstance(layout["model"]["children"], list):
            new_children = [
                configure_layout_form_submit_button_recursive(child, hide_submit_button)
                for child in layout["model"]["children"]
            ]
        else:
            new_children = configure_layout_form_submit_button_recursive(
                layout["model"]["children"], hide_submit_button
            )

        return {**layout, "model": {**layout["model"], "children": new_children}}

    return layout


def configure_layout_form_submit_button(layout: ComponentReturn) -> ComponentReturn:
    """
    Check if we need to add/remove submit buttons from forms in the layout. If so, do it.
    """
    hide_submit_button = (
        layout["type"] == TYPE.LAYOUT_FORM
        and layout["model"]["properties"].get("hideSubmitButton") is True
    )

    return configure_layout_form_submit_button_recursive(layout, hide_submit_button)
