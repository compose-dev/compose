from typing import Literal, Any, Union, Callable, List, Dict

from ..ui import (
    INTERACTION_TYPE,
    TYPE,
    Nullable,
    ComponentReturn,
    BUTTON_APPEARANCE,
    BUTTON_APPEARANCE_DEFAULT,
    ChartSeriesData,
    ChartSeriesDataKey,
    ChartSeriesGroupFnResult,
    ChartSeries,
    ChartAggregator,
    ChartBarOrientation,
    ChartBarGroupMode,
    ChartScale,
    chart_format_series_data,
)
from ..types import NullableStr


def _create_button(
    type: Literal[TYPE.BUTTON_DEFAULT, TYPE.BUTTON_FORM_SUBMIT],
    id: str,
    *,
    appearance: BUTTON_APPEARANCE = BUTTON_APPEARANCE_DEFAULT,
    style: Nullable.Style = None,
    label: NullableStr = None,
    on_click: Nullable.NoArgumentsCallable = None,
) -> ComponentReturn:
    return {
        "model": {
            "id": id,
            "style": style,
            "properties": {
                "label": label,
                "hasOnClickHook": on_click is not None,
                **(
                    {"appearance": appearance}
                    if appearance is not BUTTON_APPEARANCE_DEFAULT
                    else {}
                ),
            },
        },
        "hooks": {"onClick": on_click},
        "type": type,
        "interactionType": INTERACTION_TYPE.BUTTON,
    }


def button_default(
    id: str,
    *,
    appearance: BUTTON_APPEARANCE = BUTTON_APPEARANCE_DEFAULT,
    style: Nullable.Style = None,
    label: Nullable.Str = None,
    on_click: Nullable.NoArgumentsCallable = None,
) -> ComponentReturn:
    return _create_button(
        TYPE.BUTTON_DEFAULT,
        id,
        style=style,
        label=label,
        on_click=on_click,
        appearance=appearance,
    )


def button_form_submit(
    id: str,
    *,
    appearance: BUTTON_APPEARANCE = BUTTON_APPEARANCE_DEFAULT,
    style: Nullable.Style = None,
    label: Nullable.Str = None,
    on_click: Nullable.NoArgumentsCallable = None,
) -> ComponentReturn:
    return _create_button(
        TYPE.BUTTON_FORM_SUBMIT,
        id,
        style=style,
        label=label,
        on_click=on_click,
        appearance=appearance,
    )


def button_bar_chart(
    id: str,
    data: List[Dict[Any, Any]],
    *,
    label: NullableStr = None,
    description: NullableStr = None,
    group: Union[
        ChartSeriesDataKey,
        Callable[[], ChartSeriesGroupFnResult],
        Callable[[ChartSeriesData], ChartSeriesGroupFnResult],
        Callable[[ChartSeriesData, int], ChartSeriesGroupFnResult],
        None,
    ] = None,
    series: Union[
        None,
        List[ChartSeries],
    ] = None,
    aggregate: ChartAggregator = "sum",
    orientation: ChartBarOrientation = "vertical",
    group_mode: ChartBarGroupMode = "stacked",
    scale: ChartScale = "linear",
    style: Nullable.Style = None,
) -> ComponentReturn:
    """A bar chart component that can be clicked.

    ## Documentation
    https://docs.composehq.com/components/chart/bar-chart

    ## Parameters
    #### id
        - `str`
        - Required
        - Unique identifier for the bar chart.

    #### data
        - `List[Dict[str, Any]]`
        - Required
        - Data to be displayed in the chart. Should be a list of dictionaries containing the values to plot.

    #### label
        - `str`
        - Optional
        - Label text to display above the chart.

    #### description
        - `str`
        - Optional
        - Description text to display below the chart label.

    #### group
        - `str` | `Callable`
        - Optional
        - Key or function to group data by. If a function is provided, it should return the group label for each row that is passed to it.

    #### series
        - `List[Dict]`
        - Optional
        - List of series configurations. Each item should be a key from the data, or an object with the necessary fields to configure the series. See docs for more details.

    #### aggregate
        - `'sum' | 'avg' | 'min' | 'max' | 'count'`
        - Optional
        - How to aggregate values within groups. Defaults to 'sum'.

    #### orientation
        - `'vertical' | 'horizontal'`
        - Optional
        - Direction of the bars. Defaults to 'vertical'.

    #### group_mode
        - `'stacked' | 'grouped'`
        - Optional
        - How to display multiple series. Defaults to 'stacked'.

    #### scale
        - `'linear' | 'symlog'`
        - Optional
        - Scale type for the value axis. Defaults to 'linear'.

    #### style
        - `dict`
        - Optional
        - CSS styles object to directly style the chart HTML element.

    ## Returns
    The configured bar chart component.

    ## Example
    >>> data = [
    ...     {"month": "Jan", "west_coast_sales": 10, "east_coast_sales": 15},
    ...     {"month": "Feb", "west_coast_sales": 20, "east_coast_sales": 25},
    ...     {"month": "Mar", "west_coast_sales": 15, "east_coast_sales": 20},
    ... ]
    ...
    ... page.add(lambda: ui.button_bar_chart(
    ...     "sales-chart",
    ...     data,
    ...     group="month",
    ...     series=["west_coast_sales", "east_coast_sales"],
    ...     label="Sales by Month"
    ... ))
    ...
    >>> data = [
    ...     {"date": "2024-01-01", "region_of_sale": "West Coast", "item_sold": "Widget"},
    ...     {"date": "2024-02-01", "region_of_sale": "East Coast", "item_sold": "Gadget"},
    ...     ...
    ... ]
    ...
    ... def get_group_label(row):
    ...     month = row["date"].split("-")[1]
    ...     return month
    ...
    ... def get_series_value(row, region):
    ...     if row["region_of_sale"] == region:
    ...         return 1
    ...     return 0
    ...
    ... page.add(lambda: ui.button_bar_chart(
    ...     "sales-chart",
    ...     data,
    ...     group=get_group_label,
    ...     series=[
    ...         {"value": lambda row: get_series_value(row, "West Coast"), "label": "West Coast"},
    ...         {"value": lambda row: get_series_value(row, "East Coast"), "label": "East Coast"},
    ...     ],
    ...     aggregate="sum",
    ...     label="Sales by Month"
    ... ))
    """

    # This returns a coroutine, which we await inside the static layout
    # generator.
    final_data = chart_format_series_data(
        data, group=group, series=series, aggregate=aggregate
    )

    model_properties: Dict[str, Any] = {
        "data": final_data,
    }

    if label is not None:
        model_properties["label"] = label

    if description is not None:
        model_properties["description"] = description

    if orientation != "vertical":
        model_properties["orientation"] = orientation

    if group_mode != "stacked":
        model_properties["groupMode"] = group_mode

    if scale != "linear":
        model_properties["scale"] = scale

    return {
        "model": {"id": id, "style": style, "properties": model_properties},
        "hooks": {},
        "type": TYPE.BUTTON_BAR_CHART,
        "interactionType": INTERACTION_TYPE.BUTTON,
    }
