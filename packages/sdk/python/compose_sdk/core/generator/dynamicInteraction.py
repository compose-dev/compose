from typing import Union, Any, Callable, TypeVar, List, Iterable
from .displayInteraction import display_none
from .layoutInteraction import layout_stack
from ..ui import (
    ComponentReturn,
    Nullable,
    LAYOUT_ALIGN,
    LAYOUT_DIRECTION,
    LAYOUT_JUSTIFY,
    LAYOUT_ALIGN_DEFAULT,
    LAYOUT_DIRECTION_DEFAULT,
    LAYOUT_JUSTIFY_DEFAULT,
    LAYOUT_SPACING,
    LAYOUT_SPACING_DEFAULT,
)
import inspect


def dynamic_cond(
    condition: Any,
    *,
    true: Union[ComponentReturn, None] = None,
    false: Union[ComponentReturn, None] = None,
) -> ComponentReturn:
    """
    Conditionally display a component based on a condition. Conditions are evaluated for truthiness.

    >>> page.add(lambda: ui.cond(
    ...     3 > 2,
    ...     true=ui.text("This is true"),
    ...     false=ui.text("This is false"),
    ... ))

    Required arguments:
    - `condition`: The condition to evaluate. The condition will be evaluated for truthiness.

    Optional keyword arguments:
    - `true`: The component to display if the condition is truthy. Will display nothing if not provided.
    - `false`: The component to display if the condition is falsey. Will display nothing if not provided.

    Returns the `true` component, `false` component, or nothing based on the condition and provided components.

    Read the full documentation: https://docs.composehq.com/components/dynamic/conditional
    """
    if condition:
        if true is None:
            return display_none()
        return true
    else:
        if false is None:
            return display_none()
        return false


T = TypeVar("T")


def dynamic_for_each(
    items: Iterable[T],
    generator: Union[
        Callable[[T, int], ComponentReturn],
        Callable[[T], ComponentReturn],
    ],
    *,
    direction: LAYOUT_DIRECTION = LAYOUT_DIRECTION_DEFAULT,
    justify: LAYOUT_JUSTIFY = LAYOUT_JUSTIFY_DEFAULT,
    align: LAYOUT_ALIGN = LAYOUT_ALIGN_DEFAULT,
    spacing: LAYOUT_SPACING = LAYOUT_SPACING_DEFAULT,
    style: Nullable.Style = None,
) -> ComponentReturn:
    """
    Map an iterable of items to a list of components. For example:

    >>> page.add(lambda: ui.for_each(
    ...     [0, 1, 2],
    ...     lambda item, index: ui.text(f"Item {item} at index {index}")
    ... ))

    Required arguments:
    - `items`: An iterable of items to map to components.
    - `generator`: A function that takes the item and (optionally) the index, and returns a component.

    Optional keyword arguments:
    - `direction`: Direction of the child components. Defaults to `vertical`.
    - `justify`: Main-axis alignment of the child components. Defaults to `start`.
    - `align`: Cross-axis alignment of the child components. Defaults to `start`.
    - `spacing`: Spacing between the child components. Defaults to `16px`.
    - `style`: CSS styles object applied directly to the container HTML element. Defaults to `None`.

    Read the full documentation: https://docs.composehq.com/components/dynamic/for-each

    Returns a configured `ui.stack` component with the mapped components as children.
    """
    param_count = len(inspect.signature(generator).parameters)

    if param_count == 1:
        mapped_items: List[ComponentReturn] = [
            generator(item) for item in items  # type: ignore
        ]
    elif param_count == 2:
        mapped_items = [
            generator(item, index) for index, item in enumerate(items)  # type: ignore
        ]
    else:
        raise ValueError("Generator must take 1 or 2 arguments")

    return layout_stack(
        mapped_items,
        direction=direction,
        justify=justify,
        align=align,
        spacing=spacing,
        style=style,
    )
