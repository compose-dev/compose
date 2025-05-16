# type: ignore

from typing import Callable, Tuple, Any
import pytest
from compose_sdk.scheduler import Scheduler
from compose_sdk.app.appRunner import AppRunner
from compose_sdk.api import ApiHandler
from compose_sdk import Page, UI
from compose_sdk.core import EventType
from compose_sdk.core.json import JSON
import compose_sdk as c


@pytest.mark.asyncio
async def test_sends_paginated_data_to_client(
    app_runner_generator: Callable[[Callable], Tuple[AppRunner, ApiHandler]],
):
    runner: AppRunner
    scheduler: Scheduler

    async def handler(page: Page, ui: UI):
        print("OK IT RAN")

        def get_data(args: Any):
            print("DID REQUEST!!!")
            return {
                "data": [{"id": "1", "name": "John"}, {"id": "2", "name": "Jane"}],
                "total_records": 2,
            }

        page.add(lambda: ui.table("table-id", get_data))
        await scheduler.sleep(0.002)

    runner, api, scheduler = app_runner_generator(handler=handler)

    did_update_with_data = False

    stringified_data = JSON.stringify(
        [{"id": "1", "name": "John"}, {"id": "2", "name": "Jane"}]
    )

    async def send(event, _, _1):
        nonlocal did_update_with_data
        if stringified_data in JSON.stringify(event):
            did_update_with_data = True

    api.send = send

    await runner.execute({})
    await scheduler.sleep(0)

    assert did_update_with_data is True
