from typing import Union, Callable, Dict, Any, List
from ..ui import (
    INTERACTION_TYPE,
    TYPE,
    LAYOUT_ALIGN,
    LAYOUT_DIRECTION,
    LAYOUT_JUSTIFY,
    LAYOUT_ALIGN_DEFAULT,
    LAYOUT_DIRECTION_DEFAULT,
    LAYOUT_JUSTIFY_DEFAULT,
    LAYOUT_SPACING,
    LAYOUT_SPACING_DEFAULT,
    ComponentReturn,
    ValidatorResponse,
    VoidResponse,
    ComponentStyle,
)
from ..utils import Utils

Children = Union[ComponentReturn, List[ComponentReturn]]


def layout_stack(
    children: Children,
    *,
    direction: LAYOUT_DIRECTION = LAYOUT_DIRECTION_DEFAULT,
    justify: LAYOUT_JUSTIFY = LAYOUT_JUSTIFY_DEFAULT,
    align: LAYOUT_ALIGN = LAYOUT_ALIGN_DEFAULT,
    spacing: LAYOUT_SPACING = LAYOUT_SPACING_DEFAULT,
    responsive: bool = True,
    style: Union[ComponentStyle, None] = None
) -> ComponentReturn:
    """A flexible container for arranging and styling its children. For example:

    >>> page.add(lambda: ui.stack(
    ...     [
    ...         ui.text("First item"),
    ...         ui.text("Second item"),
    ...     ],
    ...     spacing="24px"
    ... ))

    Required arguments:
    - `children`: The components to be arranged by the stack. Can be a single component or a list of components.

    Optional keyword arguments:
    - `direction`: Direction of child components. Options: `vertical`, `vertical-reverse`, `horizontal`, `horizontal-reverse`. Defaults to `vertical`.
    - `justify`: Main-axis alignment of child components. Options: `start`, `end`, `center`, `between`, `around`, `evenly`. Defaults to `start`.
    - `align`: Cross-axis alignment of child components. Options: `start`, `end`, `center`, `stretch`, `baseline`. Defaults to `start`.
    - `spacing`: Spacing between child components. Defaults to `16px`.
    - `responsive`: Whether the container should automatically adjust to a vertical layout on mobile devices. Defaults to `True`.
    - `style`: CSS styles object applied directly to the container HTML element. Defaults to `None`.

    Returns a configured container component with the provided children.

    Read the full documentation: https://docs.composehq.com/components/layout/stack
    """
    model: Dict[str, Any] = {
        "id": Utils.generate_id(),
        "children": children,
        "direction": direction,
        "justify": justify,
        "align": align,
        "spacing": spacing,
        "style": style,
        "properties": {},
    }

    if responsive is False:
        model["responsive"] = responsive

    return {
        "model": model,
        "hooks": None,
        "type": TYPE.LAYOUT_STACK,
        "interactionType": INTERACTION_TYPE.LAYOUT,
    }


def layout_row(
    children: Children,
    *,
    justify: LAYOUT_JUSTIFY = LAYOUT_JUSTIFY_DEFAULT,
    align: LAYOUT_ALIGN = LAYOUT_ALIGN_DEFAULT,
    spacing: LAYOUT_SPACING = LAYOUT_SPACING_DEFAULT,
    responsive: bool = True,
    style: Union[ComponentStyle, None] = None
) -> ComponentReturn:
    """A flexible container for arranging and styling its children in a horizontal row. For example:

    >>> page.add(lambda: ui.row(
    ...     [
    ...         ui.button("add"),
    ...         ui.button("edit"),
    ...     ],
    ...     spacing="24px"
    ... ))

    Required arguments:
    - `children`: The components to be arranged by the stack. Can be a single component or a list of components.

    Optional keyword arguments:
    - `justify`: Main-axis alignment of child components. Options: `start`, `end`, `center`, `between`, `around`, `evenly`. Defaults to `start`.
    - `align`: Cross-axis alignment of child components. Options: `start`, `end`, `center`, `stretch`, `baseline`. Defaults to `start`.
    - `spacing`: Spacing between child components. Defaults to `16px`.
    - `responsive`: Whether the container should automatically adjust to a vertical layout on mobile devices. Defaults to `True`.
    - `style`: CSS styles object applied directly to the container HTML element. Defaults to `None`.

    Returns a configured container component with the provided children.

    Read the full documentation: https://docs.composehq.com/components/layout/stack
    """

    return layout_stack(
        children,
        direction="horizontal",
        justify=justify,
        align=align,
        spacing=spacing,
        responsive=responsive,
        style=style,
    )


def layout_distributed_row(
    children: Children,
    *,
    align: LAYOUT_ALIGN = "center",
    spacing: LAYOUT_SPACING = LAYOUT_SPACING_DEFAULT,
    responsive: bool = True,
    style: Union[ComponentStyle, None] = None
) -> ComponentReturn:
    """A flexible container that distributes its children evenly in a row. Great for section headers with a title and action buttons.

    >>> page.add(lambda: ui.distributed_row(
    ...     [
    ...         ui.header("Users"),
    ...         ui.button("Add user"),
    ...     ]
    ... ))

    Required arguments:
    - `children`: The components to be distributed by the row. Can be a single component or a list of components.

    Optional keyword arguments:
    - `align`: Cross-axis alignment of child components. Options: `start`, `end`, `center`, `stretch`, `baseline`. Defaults to `center`.
    - `spacing`: Spacing between child components. Defaults to `16px`.
    - `responsive`: Whether the container should automatically adjust to a vertical layout on mobile devices. Defaults to `True`.
    - `style`: CSS styles object applied directly to the container HTML element. Defaults to `None`.

    Returns a configured distributed row component with the provided children.

    Read the full documentation: https://docs.composehq.com/components/layout/distributed-row
    """
    return layout_stack(
        children,
        direction="horizontal",
        justify="between",
        align=align,
        spacing=spacing,
        responsive=responsive,
        style=style,
    )


def layout_card(
    children: Children,
    *,
    direction: LAYOUT_DIRECTION = LAYOUT_DIRECTION_DEFAULT,
    justify: LAYOUT_JUSTIFY = LAYOUT_JUSTIFY_DEFAULT,
    align: LAYOUT_ALIGN = LAYOUT_ALIGN_DEFAULT,
    spacing: LAYOUT_SPACING = LAYOUT_SPACING_DEFAULT,
    responsive: bool = True,
    style: Union[ComponentStyle, None] = None
) -> ComponentReturn:
    """A flexible container that renders its children inside a card UI. Great for organizing content.

    >>> page.add(lambda: ui.card(
    ...     [
    ...         ui.header("User details"),
    ...         ui.json(user["data"]),
    ...     ]
    ... ))

    Required arguments:
    - `children`: The components to be rendered inside the card. Can be a single component or a list of components.

    Optional keyword arguments:
    - `direction`: Direction of child components. Options: `vertical`, `vertical-reverse`, `horizontal`, `horizontal-reverse`. Defaults to `vertical`.
    - `justify`: Main-axis alignment of child components. Options: `start`, `end`, `center`, `between`, `around`, `evenly`. Defaults to `start`.
    - `align`: Cross-axis alignment of child components. Options: `start`, `end`, `center`, `stretch`, `baseline`. Defaults to `start`.
    - `spacing`: Spacing between child components. Defaults to `16px`.
    - `responsive`: Whether the container should automatically adjust to a vertical layout on mobile devices. Defaults to `True`.
    - `style`: CSS styles object applied directly to the container HTML element. Defaults to `None`.

    Returns a configured card component with the provided children.

    Read the full documentation: https://docs.composehq.com/components/layout/card
    """

    stack = layout_stack(
        children,
        direction=direction,
        justify=justify,
        align=align,
        spacing=spacing,
        responsive=responsive,
        style=style,
    )

    return {
        **stack,
        "model": {
            **stack["model"],
            "appearance": "card",
        },
    }


def layout_form(
    id: str,
    children: Children,
    *,
    direction: LAYOUT_DIRECTION = LAYOUT_DIRECTION_DEFAULT,
    justify: LAYOUT_JUSTIFY = LAYOUT_JUSTIFY_DEFAULT,
    align: LAYOUT_ALIGN = LAYOUT_ALIGN_DEFAULT,
    spacing: LAYOUT_SPACING = LAYOUT_SPACING_DEFAULT,
    responsive: bool = True,
    style: Union[ComponentStyle, None] = None,
    clear_on_submit: bool = False,
    hide_submit_button: bool = False,
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[Dict[str, Any]], ValidatorResponse],
        None,
    ] = None,
    on_submit: Union[
        Callable[[], VoidResponse], Callable[[Dict[str, Any]], VoidResponse], None
    ] = None
) -> ComponentReturn:
    """Creates a form component that groups child components into a single form.

    >>> def handle_submit(form: Dict[str, Any]):
    ...     print(f"Name: {form['name']}, Email: {form['email']}")
    ...
    ... ui.form(
    ...     "signup-form",
    ...     [
    ...         ui.text_input("name"),
    ...         ui.email_input("email"),
    ...     ],
    ...     on_submit=handle_submit
    ... )

    Required arguments:
    - `id`: Unique identifier for the form.
    - `children`: Child components to be grouped into the form.

    Optional keyword arguments:
    - `on_submit`: Function to be called when the form is submitted. Passes the form data as a dictionary.
    - `validate`: Supply a custom validation function. Passes the form data as a dictionary. Return `None` if valid, or a string error message if invalid.
    - `clear_on_submit`: Clear the form back to its initial state after submission. Defaults to `False`.
    - `hide_submit_button`: Hide the form submit button. Defaults to `False`.
    - `direction`: Direction of child components. Options: `vertical`, `vertical-reverse`, `horizontal`, `horizontal-reverse`. Defaults to `vertical`.
    - `justify`: Main-axis alignment of child components. Options: `start`, `end`, `center`, `between`, `around`, `evenly`. Defaults to `start`.
    - `align`: Cross-axis alignment of child components. Options: `start`, `end`, `center`, `stretch`, `baseline`. Defaults to `start`.
    - `spacing`: Spacing between child components. Defaults to `16px`.
    - `responsive`: Whether the container should automatically adjust to a vertical layout on mobile devices. Defaults to `True`.
    - `style`: CSS styles object applied directly to the container HTML element. Defaults to `None`.

    Returns a configured form component.

    Read the full documentation: https://docs.composehq.com/components/layout/form
    """

    model_properties = {
        "hasOnSubmitHook": on_submit is not None,
        "hasValidateHook": validate is not None,
        "clearOnSubmit": clear_on_submit,
    }

    if hide_submit_button:
        model_properties["hideSubmitButton"] = hide_submit_button

    model: Dict[str, Any] = {
        "id": id,
        "children": children,
        "direction": direction,
        "justify": justify,
        "align": align,
        "spacing": spacing,
        "style": style,
        "properties": model_properties,
    }

    if responsive is False:
        model["responsive"] = responsive

    return {
        "model": model,
        "hooks": {
            "validate": validate,
            "onSubmit": on_submit,
        },
        "type": TYPE.LAYOUT_FORM,
        "interactionType": INTERACTION_TYPE.LAYOUT,
    }
