from typing import Union, Callable, Dict, Any, List
from ..ui import (
    INTERACTION_TYPE,
    TYPE,
    Nullable,
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
    style: Nullable.Style = None
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
    - `direction`: Direction of child components. Defaults to `vertical`.
    - `justify`: Main-axis alignment of child components. Defaults to `start`.
    - `align`: Cross-axis alignment of child components. Defaults to `start`.
    - `spacing`: Spacing between child components. Defaults to `16px`.
    - `style`: CSS styles object applied directly to the container HTML element. Defaults to `None`.

    Returns a configured container component with the provided children.

    Read the full documentation: https://docs.composehq.com/components/layout/stack
    """
    id = Utils.generate_id()

    return {
        "model": {
            "id": id,
            "children": children,
            "direction": direction,
            "justify": justify,
            "align": align,
            "spacing": spacing,
            "style": style,
            "properties": {},
        },
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
    style: Nullable.Style = None
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
    - `justify`: Main-axis alignment of child components. Defaults to `start`.
    - `align`: Cross-axis alignment of child components. Defaults to `start`.
    - `spacing`: Spacing between child components. Defaults to `16px`.
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
        style=style,
    )


def layout_distributed_row(
    children: Children,
    *,
    align: LAYOUT_ALIGN = "center",
    spacing: LAYOUT_SPACING = LAYOUT_SPACING_DEFAULT,
    style: Nullable.Style = None
) -> ComponentReturn:
    """A flexible container that distributes its children evenly in a row.

    ## Documentation
    https://docs.composehq.com/components/layout/distributed-row

    ## Parameters
    #### children
        - `Component` | `List[Component]`
        - Required
        - Child components to be distributed in the row.

    #### align
        - `'start' | 'end' | 'center' | 'stretch' | 'baseline'`
        - Optional
        - Cross-axis alignment of child components. Follows CSS flexbox `align-items`. Defaults to "center".

    #### spacing
        - `str`
        - Optional
        - Spacing between child components. Defaults to `16px`.

    #### style
        - `dict`
        - Optional
        - CSS styles object to directly style the row HTML element.

    ## Returns
    The configured distributed row component.

    ## Example
    >>> ui.distributed_row(
    ...     [
    ...         ui.text("Title"),
    ...         ui.button("action", label="Action"),
    ...     ],
    ...     align="center"
    ... )
    """
    return layout_stack(
        children,
        direction="horizontal",
        justify="between",
        align=align,
        spacing=spacing,
        style=style,
    )


def layout_card(
    children: Children,
    *,
    direction: LAYOUT_DIRECTION = LAYOUT_DIRECTION_DEFAULT,
    justify: LAYOUT_JUSTIFY = LAYOUT_JUSTIFY_DEFAULT,
    align: LAYOUT_ALIGN = LAYOUT_ALIGN_DEFAULT,
    spacing: LAYOUT_SPACING = LAYOUT_SPACING_DEFAULT,
    style: Nullable.Style = None
) -> ComponentReturn:
    """A flexible container that renders its children inside a card UI.

    ## Documentation
    https://docs.composehq.com/components/layout/card

    ## Parameters
    #### children
        - `Component` | `List[Component]`
        - Required
        - Child components to be rendered inside the card.

    #### direction
        - `'vertical' | 'vertical-reverse' | 'horizontal' | 'horizontal-reverse'`
        - Optional
        - Direction of child components. Follows CSS flexbox `flex-direction`. Defaults to "vertical".

    #### justify
        - `'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'`
        - Optional
        - Main-axis alignment of child components. Follows CSS flexbox `justify-content`. Defaults to "start".

    #### align
        - `'start' | 'end' | 'center' | 'stretch' | 'baseline'`
        - Optional
        - Cross-axis alignment of child components. Follows CSS flexbox `align-items`. Defaults to "start".

    #### spacing
        - `str`
        - Optional
        - Spacing between child components. Defaults to `16px`.

    #### style
        - `dict`
        - Optional
        - CSS styles object to directly style the card HTML element.

    ## Returns
    The configured card component.

    ## Example
    >>> ui.card(
    ...     [
    ...         ui.header("Card Title"),
    ...         ui.text("Card content goes here"),
    ...     ],
    ...     spacing="24px"
    ... )
    """

    stack = layout_stack(
        children,
        direction=direction,
        justify=justify,
        align=align,
        spacing=spacing,
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
    style: Nullable.Style = None,
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

    ## Documentation
    https://docs.composehq.com/components/layout/form

    ## Parameters
    #### id
        - `str`
        - Required
        - Unique identifier for the form.

    #### children
        - `Component` | `List[Component]`
        - Required
        - Child components to be grouped into the form.

    #### direction
        - `'vertical' | 'vertical-reverse' | 'horizontal' | 'horizontal-reverse'`
        - Optional
        - Direction of child components. Follows CSS flexbox `flex-direction`. Defaults to "vertical".

    #### justify
        - `'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'`
        - Optional
        - Main-axis alignment of child components. Follows CSS flexbox `justify-content`. Defaults to "start".

    #### align
        - `'start' | 'end' | 'center' | 'stretch' | 'baseline'`
        - Optional
        - Cross-axis alignment of child components. Follows CSS flexbox `align-items`. Defaults to "start".

    #### spacing
        - `str`
        - Optional
        - Spacing between child components. Defaults to `16px`.

    #### style
        - `dict`
        - Optional
        - CSS styles object to directly style the form HTML element.

    #### clear_on_submit
        - `bool`
        - Optional
        - Clear the form back to its initial state after submission. Defaults to `False`.

    #### hide_submit_button
        - `bool`
        - Optional
        - Hide the form submit button. Defaults to `False`.

    #### validate
        - `Callable[dict, str | None]`
        - Optional
        - Custom validation function to validate the form inputs. Return `None` if valid, or a string error message if invalid.

    #### on_submit
        - `Callable[dict, None]`
        - Optional
        - Function to be called when the form is submitted.


    ## Returns
    The configured form component.


    ## Example
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
    """

    model_properties = {
        "hasOnSubmitHook": on_submit is not None,
        "hasValidateHook": validate is not None,
        "clearOnSubmit": clear_on_submit,
    }

    if hide_submit_button:
        model_properties["hideSubmitButton"] = hide_submit_button

    return {
        "model": {
            "id": id,
            "children": children,
            "direction": direction,
            "justify": justify,
            "align": align,
            "spacing": spacing,
            "style": style,
            "properties": model_properties,
        },
        "hooks": {
            "validate": validate,
            "onSubmit": on_submit,
        },
        "type": TYPE.LAYOUT_FORM,
        "interactionType": INTERACTION_TYPE.LAYOUT,
    }
