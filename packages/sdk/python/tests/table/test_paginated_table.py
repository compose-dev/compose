# type: ignore

from typing import Any
import pytest
from compose_sdk.scheduler import Scheduler
from compose_sdk.app.appRunner import AppRunner
from compose_sdk.api import ApiHandler
from compose_sdk import Page, UI
from compose_sdk.core import EventType
from compose_sdk.core.json import JSON
from tests.conftest import AppRunnerFactory, ApiEventTrackerFactory, ApiEventTracker
import compose_sdk as c


@pytest.mark.asyncio
async def test_sends_paginated_data_to_client(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):

    async def handler(page: Page, ui: UI):
        def get_data(args: Any):
            return {
                "data": [{"id": "1", "name": "John"}, {"id": "2", "name": "Jane"}],
                "total_records": 2,
            }

        page.add(lambda: ui.table("table-id", get_data))
        await scheduler.sleep(0.002)

    stringified_data = JSON.stringify(
        [{"id": "1", "name": "John"}, {"id": "2", "name": "Jane"}]
    )

    def condition(event: Any) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.TABLE_PAGE_CHANGE_RESPONSE_V2:
            if stringified_data in JSON.stringify(event):
                return True

        return False

    tracker = api_event_tracker_factory(
        {
            "condition": condition,
        }
    )

    with app_runner_factory(handler=handler) as runner:
        await runner.execute({})
        await tracker.wait_until_condition()

    assert tracker.met_condition is True
