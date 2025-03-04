from typing import Any, Union
from compose_sdk.core import (
    ChartSeriesData,
    chart_format_series_data,
    CHART_LABEL_SERIES_KEY,
    JSON,
)

import pytest

SALES_BY_MONTH: ChartSeriesData = [
    {"group": "January", "west_coast_sales": 100, "east_coast_sales": 200},
    {"group": "February", "west_coast_sales": 150, "east_coast_sales": 250},
    {"group": "March", "west_coast_sales": 120, "east_coast_sales": 220},
]

SALES_BY_MONTH_WITH_INTERNAL_KEY = [
    {
        CHART_LABEL_SERIES_KEY: "January",
        "west_coast_sales": 100,
        "east_coast_sales": 200,
    },
    {
        CHART_LABEL_SERIES_KEY: "February",
        "west_coast_sales": 150,
        "east_coast_sales": 250,
    },
    {CHART_LABEL_SERIES_KEY: "March", "west_coast_sales": 120, "east_coast_sales": 220},
]


@pytest.mark.asyncio
async def test_base_case():
    formatted = await chart_format_series_data(SALES_BY_MONTH)
    assert JSON.stringify(formatted) == JSON.stringify(SALES_BY_MONTH_WITH_INTERNAL_KEY)


@pytest.mark.asyncio
async def test_custom_group_key():
    with_random_key: ChartSeriesData = [
        {
            "random_key": row["group"],
            "west_coast_sales": row["west_coast_sales"],
            "east_coast_sales": row["east_coast_sales"],
        }
        for row in SALES_BY_MONTH
    ]

    formatted = await chart_format_series_data(with_random_key, group="random_key")
    assert JSON.stringify(formatted) == JSON.stringify(SALES_BY_MONTH_WITH_INTERNAL_KEY)


@pytest.mark.asyncio
async def test_custom_group_function():
    def get_random_key(row: Any) -> str:
        return row["random_key"]

    with_random_key: ChartSeriesData = [
        {
            "random_key": row["group"],
            "west_coast_sales": row["west_coast_sales"],
            "east_coast_sales": row["east_coast_sales"],
        }
        for row in SALES_BY_MONTH
    ]

    formatted = await chart_format_series_data(
        with_random_key,
        group=get_random_key,
        series=["west_coast_sales", "east_coast_sales"],
    )
    assert JSON.stringify(formatted) == JSON.stringify(SALES_BY_MONTH_WITH_INTERNAL_KEY)


@pytest.mark.asyncio
async def test_excludes_null_group():
    def get_conditional_key(row: Any, idx: int) -> Union[str, None]:
        return row["random_key"] if idx == 0 else None

    with_random_key: ChartSeriesData = [
        {
            "random_key": row["group"],
            "west_coast_sales": row["west_coast_sales"],
            "east_coast_sales": row["east_coast_sales"],
        }
        for row in SALES_BY_MONTH
    ]

    formatted = await chart_format_series_data(
        with_random_key,
        group=get_conditional_key,
        series=["west_coast_sales", "east_coast_sales"],
    )
    assert JSON.stringify(formatted) == JSON.stringify(
        SALES_BY_MONTH_WITH_INTERNAL_KEY[:1]
    )


@pytest.mark.asyncio
async def test_custom_series_keys():
    formatted = await chart_format_series_data(
        SALES_BY_MONTH, series=["west_coast_sales"]
    )

    expected = [
        {
            CHART_LABEL_SERIES_KEY: row[CHART_LABEL_SERIES_KEY],
            "west_coast_sales": row["west_coast_sales"],
        }
        for row in SALES_BY_MONTH_WITH_INTERNAL_KEY
    ]
    assert JSON.stringify(formatted) == JSON.stringify(expected)


@pytest.mark.asyncio
async def test_custom_aggregate():
    formatted = await chart_format_series_data(SALES_BY_MONTH, aggregate="count")

    expected = [
        {
            CHART_LABEL_SERIES_KEY: row[CHART_LABEL_SERIES_KEY],
            "west_coast_sales": 1,
            "east_coast_sales": 1,
        }
        for row in SALES_BY_MONTH_WITH_INTERNAL_KEY
    ]
    assert JSON.stringify(formatted) == JSON.stringify(expected)


@pytest.mark.asyncio
async def test_custom_series_labels():
    formatted = await chart_format_series_data(
        SALES_BY_MONTH,
        series=[
            {"value": "west_coast_sales", "label": "West Coast Sales"},
            {"value": "east_coast_sales", "label": "East Coast Sales"},
        ],
    )

    expected = [
        {
            CHART_LABEL_SERIES_KEY: row[CHART_LABEL_SERIES_KEY],
            "West Coast Sales": row["west_coast_sales"],
            "East Coast Sales": row["east_coast_sales"],
        }
        for row in SALES_BY_MONTH_WITH_INTERNAL_KEY
    ]
    assert JSON.stringify(formatted) == JSON.stringify(expected)


@pytest.mark.asyncio
async def test_custom_series_value():
    def get_index(_row: ChartSeriesData, idx: int) -> int:
        return idx

    formatted = await chart_format_series_data(
        SALES_BY_MONTH,
        series=[
            {"label": "West Coast Sales", "value": get_index},
            {"label": "East Coast Sales", "value": get_index},
        ],
    )

    expected = [
        {
            CHART_LABEL_SERIES_KEY: row[CHART_LABEL_SERIES_KEY],
            "West Coast Sales": idx,
            "East Coast Sales": idx,
        }
        for idx, row in enumerate(SALES_BY_MONTH_WITH_INTERNAL_KEY)
    ]
    assert JSON.stringify(formatted) == JSON.stringify(expected)


@pytest.mark.asyncio
async def test_custom_series_aggregate():
    def get_index(_row: ChartSeriesData, idx: int) -> int:
        return idx

    formatted = await chart_format_series_data(
        SALES_BY_MONTH,
        series=[
            {"label": "West Coast Sales", "value": get_index},
            {"label": "East Coast Sales", "value": get_index, "aggregate": "count"},
        ],
        aggregate="sum",
    )

    expected = [
        {
            CHART_LABEL_SERIES_KEY: row[CHART_LABEL_SERIES_KEY],
            "West Coast Sales": idx,
            "East Coast Sales": 1,
        }
        for idx, row in enumerate(SALES_BY_MONTH_WITH_INTERNAL_KEY)
    ]
    assert JSON.stringify(formatted) == JSON.stringify(expected)


@pytest.mark.asyncio
async def test_multiple_rows_per_group():
    formatted = await chart_format_series_data(SALES_BY_MONTH + SALES_BY_MONTH)

    expected = [
        {
            CHART_LABEL_SERIES_KEY: row[CHART_LABEL_SERIES_KEY],
            "west_coast_sales": row["west_coast_sales"] * 2,
            "east_coast_sales": row["east_coast_sales"] * 2,
        }
        for row in SALES_BY_MONTH_WITH_INTERNAL_KEY
    ]
    assert JSON.stringify(formatted) == JSON.stringify(expected)


@pytest.mark.asyncio
async def test_exclude_null_rows():
    data: Any = [row.copy() for row in SALES_BY_MONTH]
    data[0]["west_coast_sales"] = None

    formatted = await chart_format_series_data(data)

    expected = [row.copy() for row in SALES_BY_MONTH_WITH_INTERNAL_KEY]
    expected[0]["west_coast_sales"] = 0

    assert JSON.stringify(formatted) == JSON.stringify(expected)


@pytest.mark.asyncio
async def test_account_for_missing_rows():
    data = [row.copy() for row in SALES_BY_MONTH]
    del data[1]["east_coast_sales"]

    formatted = await chart_format_series_data(data)

    expected = [row.copy() for row in SALES_BY_MONTH_WITH_INTERNAL_KEY]
    expected[1]["east_coast_sales"] = 0

    assert JSON.stringify(formatted) == JSON.stringify(expected)


@pytest.mark.asyncio
async def test_async_series_value():
    async def async_value(row: ChartSeriesData, idx: int) -> int:
        return idx * 2

    formatted = await chart_format_series_data(
        SALES_BY_MONTH, series=[{"label": "West Coast Sales", "value": async_value}]
    )

    expected = [
        {
            CHART_LABEL_SERIES_KEY: row[CHART_LABEL_SERIES_KEY],
            "West Coast Sales": idx * 2,
        }
        for idx, row in enumerate(SALES_BY_MONTH_WITH_INTERNAL_KEY)
    ]
    assert JSON.stringify(formatted) == JSON.stringify(expected)


@pytest.mark.asyncio
async def test_async_group_function():
    async def async_group(row: Any, idx: int) -> str:
        return row["group"]

    formatted = await chart_format_series_data(
        SALES_BY_MONTH,
        group=async_group,
        series=["west_coast_sales", "east_coast_sales"],
    )
    assert JSON.stringify(formatted) == JSON.stringify(SALES_BY_MONTH_WITH_INTERNAL_KEY)
