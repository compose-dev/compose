from typing import Callable, List, Union, Dict, Any

from ....run_hook_function import run_hook_function

from .series_chart import *
from .literals import ChartAggregator


async def chart_format_series_data(
    data: ChartSeriesData,
    *,
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
) -> ChartSeriesData:
    try:
        # Keep grouping logic inlined for performance
        grouped_data: Dict[ChartSeriesDataKey, List[int]] = {}
        group_key: Union[ChartSeriesDataKey, None] = "group"

        for idx, row in enumerate(data):
            group_label: Union[ChartSeriesDataKey, None] = None

            if isinstance(group, Callable):  # type: ignore[arg-type]
                group_key = None
                group_label = await run_hook_function(
                    group, row, idx  # type: ignore[arg-type]
                )
            elif isinstance(group, (str, int, float)):
                group_key = group
                group_label = row.get(group_key)
            elif "group" in row:
                group_label = row["group"]
            else:
                continue

            if group_label is None:
                continue

            if group_label not in grouped_data:
                grouped_data[group_label] = [idx]
            else:
                grouped_data[group_label].append(idx)

        series_list = (
            series
            if series is not None
            else (
                [k for k in data[0].keys() if k != group_key] if len(data) > 0 else []
            )
        )

        final_data: List[Dict[ChartSeriesDataKey, Any]] = []

        for group in grouped_data:
            new_row: Dict[ChartSeriesDataKey, Any] = {CHART_LABEL_SERIES_KEY: group}

            for idx, serie in enumerate(series_list):
                values: List[Any] = []
                aggregator = aggregate
                series_label: Union[ChartSeriesDataKey, None] = None

                # Case 1: Simple Series
                if isinstance(serie, (str, int, float)):
                    series_label = serie
                    values = [
                        data[i][serie]
                        for i in grouped_data[group]
                        if data[i].get(serie) is not None
                    ]
                # Case 2: Advanced Series
                else:
                    value = serie["value"]

                    if isinstance(value, Callable):  # type: ignore[arg-type]
                        values = []
                        for i in grouped_data[group]:
                            val = await run_hook_function(value, data[i], i)  # type: ignore[arg-type]
                            if val is not None:
                                values.append(val)
                    elif isinstance(value, (str, int, float)):  # type: ignore[unused-ignore]
                        values = [
                            data[i][value]
                            for i in grouped_data[group]
                            if data[i].get(value) is not None
                        ]
                        series_label = value
                    else:
                        raise ValueError(
                            f"Invalid series value: {value}. Expected a function or a string."
                        )

                    if "aggregate" in serie:
                        aggregator = serie["aggregate"]

                    if "label" in serie:
                        series_label = serie["label"]

                if not series_label:
                    series_label = f"Series {idx + 1}"

                if series_label == CHART_LABEL_SERIES_KEY:
                    raise ValueError(
                        f"{CHART_LABEL_SERIES_KEY} is a reserved series label. Please use a different label."
                    )

                # Aggregate values
                if not values or len(values) == 0:
                    result: float = 0
                elif aggregator == "count":
                    result = len(values)
                elif aggregator == "sum":
                    result = sum(values)
                elif aggregator == "average":
                    result = sum(values) / len(values)
                elif aggregator == "min":
                    result = min(values)
                elif aggregator == "max":
                    result = max(values)
                else:
                    result = 0  # type: ignore[unreachable]

                if isinstance(result, float) and result.is_integer():
                    result = int(result)

                new_row[series_label] = result

            final_data.append(new_row)

        return final_data
    except Exception as e:
        raise Exception("Failed to format chart data:\n\n" + str(e))
