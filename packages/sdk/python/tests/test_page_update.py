# type: ignore

from typing import Callable, Tuple
import pytest
from compose_sdk.scheduler import Scheduler
from compose_sdk.app.appRunner import AppRunner
from compose_sdk.api import ApiHandler
from compose_sdk import Page, UI, State
from compose_sdk.core import EventType, TYPE
from compose_sdk.core.json import JSON
import compose_sdk as c


@pytest.mark.asyncio
async def test_updates_page_when_text_changes(scheduler, api, app_runner_factory):
    async def handler(page: c.Page, ui: c.UI):
        text = "original text"
        await page.add_with_sleep(lambda: ui.text(text))

        text = "updated text"
        await page.update_with_sleep()

    did_rerender = False
    did_update = False

    async def send(event, _, _1):
        nonlocal did_rerender, did_update

        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            did_rerender = True
            did_update = "updated text" in JSON.stringify(event["diff"])

    api.send = send

    with app_runner_factory(handler=handler) as runner:
        await runner.execute({})
        await scheduler.sleep(0)

    assert did_rerender is True
    assert did_update is True


@pytest.mark.asyncio
async def test_does_not_update_page_when_text_does_not_change(
    app_runner_generator: Callable[[Callable], Tuple[AppRunner, ApiHandler]],
):
    runner: AppRunner
    scheduler: Scheduler

    async def handler(page: Page, ui: UI):
        text = "original text"
        page.add(lambda: ui.text(text))
        await scheduler.sleep(0)
        text = "original text"
        page.update()
        await scheduler.sleep(0.002)

    runner, api, scheduler = app_runner_generator(handler=handler)

    did_rerender = False

    async def send(event, _, _1):
        nonlocal did_rerender
        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            did_rerender = True

    api.send = send

    await runner.execute({})
    await scheduler.sleep(0)

    assert did_rerender is False


@pytest.mark.asyncio
async def test_updates_when_table_data_changes(
    app_runner_generator: Callable[[Callable], Tuple[AppRunner, ApiHandler]],
):
    runner: AppRunner
    scheduler: Scheduler

    async def handler(page: Page, ui: UI):
        data = [{"id": "1", "name": "John"}, {"id": "2", "name": "Jane"}]
        page.add(lambda: ui.table("table-id", data))
        await scheduler.sleep(0)

        data[0] = {"id": "1", "name": "Updated John"}

        page.update()
        await scheduler.sleep(0.002)

    runner, api, scheduler = app_runner_generator(handler=handler)

    did_rerender = False
    did_update = False

    async def send(event, _, _1):
        nonlocal did_rerender, did_update
        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            did_rerender = True
            did_update = "Updated John" in JSON.stringify(event["diff"])

    api.send = send

    await runner.execute({})
    await scheduler.sleep(0)

    assert did_update is True


@pytest.mark.asyncio
async def test_does_not_update_when_table_data_does_not_change(
    app_runner_generator: Callable[[Callable], Tuple[AppRunner, ApiHandler]],
):
    runner: AppRunner
    scheduler: Scheduler

    async def handler(page: Page, ui: UI):
        data = [{"id": "1", "name": "John"}, {"id": "2", "name": "Jane"}]
        page.add(lambda: ui.table("table-id", data))
        await scheduler.sleep(0)

        data[0] = {"id": "1", "name": "John"}

        page.update()
        await scheduler.sleep(0.002)

    runner, api, scheduler = app_runner_generator(handler=handler)

    did_rerender = False

    async def send(event, _, _1):
        nonlocal did_rerender
        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            print(event)
            did_rerender = True

    api.send = send

    await runner.execute({})
    await scheduler.sleep(0)

    assert did_rerender is False


@pytest.mark.asyncio
async def test_updates_when_table_row_is_added(
    app_runner_generator: Callable[[Callable], Tuple[AppRunner, ApiHandler]],
):
    runner: AppRunner
    scheduler: Scheduler

    async def handler(page: Page, ui: UI):
        data = [{"id": "1", "name": "John"}, {"id": "2", "name": "Jane"}]
        page.add(lambda: ui.table("table-id", data))
        await scheduler.sleep(0)

        data.append({"id": "3", "name": "Jim"})

        page.update()
        await scheduler.sleep(0.002)

    runner, api, scheduler = app_runner_generator(handler=handler)

    did_rerender = False
    did_update = False

    async def send(event, _, _1):
        nonlocal did_rerender, did_update
        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            did_rerender = True
            did_update = "Jim" in JSON.stringify(event["diff"])

    api.send = send

    await runner.execute({})
    await scheduler.sleep(0)

    assert did_update is True


@pytest.mark.asyncio
async def test_updates_when_select_option_changes(
    app_runner_generator: Callable[[Callable], Tuple[AppRunner, ApiHandler]],
):
    runner: AppRunner
    scheduler: Scheduler

    async def handler(page: Page, ui: UI):
        data = ["Option 1", "Option 2"]
        page.add(lambda: ui.select_box("select-id", data))
        await scheduler.sleep(0)

        data[0] = "Option 3"

        page.update()
        await scheduler.sleep(0.002)

    runner, api, scheduler = app_runner_generator(handler=handler)

    did_rerender = False
    did_update = False

    async def send(event, _, _1):
        nonlocal did_rerender, did_update
        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            did_rerender = True
            did_update = "Option 3" in JSON.stringify(event["diff"])

    api.send = send

    await runner.execute({})
    await scheduler.sleep(0)

    assert did_update is True


@pytest.mark.asyncio
async def test_updates_when_multiselect_option_changes(
    app_runner_generator: Callable[[Callable], Tuple[AppRunner, ApiHandler]],
):
    runner: AppRunner
    scheduler: Scheduler

    async def handler(page: Page, ui: UI):
        data = ["Option 1", "Option 2"]
        page.add(lambda: ui.multi_select_box("select-id", data))
        await scheduler.sleep(0)

        data[0] = "Option 3"

        page.update()
        await scheduler.sleep(0.002)

    runner, api, scheduler = app_runner_generator(handler=handler)

    did_rerender = False
    did_update = False

    async def send(event, _, _1):
        nonlocal did_rerender, did_update
        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            did_rerender = True
            did_update = "Option 3" in JSON.stringify(event["diff"])

    api.send = send

    await runner.execute({})
    await scheduler.sleep(0)

    assert did_update is True


@pytest.mark.asyncio
async def test_updates_when_radio_option_changes(
    app_runner_generator: Callable[[Callable], Tuple[AppRunner, ApiHandler]],
):
    runner: AppRunner
    scheduler: Scheduler

    async def handler(page: Page, ui: UI):
        data = ["Option 1", "Option 2"]
        page.add(lambda: ui.radio_group("radio-id", data))
        await scheduler.sleep(0)

        data[0] = "Option 3"

        page.update()
        await scheduler.sleep(0.002)

    runner, api, scheduler = app_runner_generator(handler=handler)

    did_rerender = False
    did_update = False

    async def send(event, _, _1):
        nonlocal did_rerender, did_update
        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            did_rerender = True
            did_update = "Option 3" in JSON.stringify(event["diff"])

    api.send = send

    await runner.execute({})
    await scheduler.sleep(0)

    assert did_update is True
