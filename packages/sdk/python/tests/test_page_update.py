# type: ignore

from typing import Any
import pytest
from compose_sdk.scheduler import Scheduler
from compose_sdk import Page, UI
from compose_sdk.core import EventType
from compose_sdk.core.json import JSON
import compose_sdk as c
from tests.conftest import AppRunnerFactory, ApiEventTrackerFactory


@pytest.mark.asyncio
async def test_updates_page_when_text_changes(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: c.Page, ui: c.UI):
        text = "original text"
        page.add(lambda: ui.text(text))
        await scheduler.sleep(0)

        text = "updated text"
        page.update()
        await scheduler.sleep(0)

    def condition(event: Any) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            return "updated text" in JSON.stringify(event["diff"])
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


@pytest.mark.asyncio
async def test_does_not_update_page_when_text_does_not_change(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: Page, ui: UI):
        text = "original text"
        page.add(lambda: ui.text(text))
        await scheduler.sleep(0)
        text = "original text"
        page.update()
        await scheduler.sleep(0.002)

    def condition(event: Any) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
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

    assert tracker.met_condition is False


@pytest.mark.asyncio
async def test_updates_when_table_data_changes(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: Page, ui: UI):
        data = [{"id": "1", "name": "John"}, {"id": "2", "name": "Jane"}]
        page.add(lambda: ui.table("table-id", data))
        await scheduler.sleep(0)

        data[0] = {"id": "1", "name": "Updated John"}

        page.update()
        await scheduler.sleep(0.002)

    def condition(event: Any) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            return "Updated John" in JSON.stringify(event["diff"])
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


@pytest.mark.asyncio
async def test_does_not_update_when_table_data_does_not_change(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: Page, ui: UI):
        data = [{"id": "1", "name": "John"}, {"id": "2", "name": "Jane"}]
        page.add(lambda: ui.table("table-id", data))
        await scheduler.sleep(0)

        data[0] = {"id": "1", "name": "John"}

        page.update()
        await scheduler.sleep(0.002)

    def condition(event: Any) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
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

    assert tracker.met_condition is False


@pytest.mark.asyncio
async def test_updates_when_table_row_is_added(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: Page, ui: UI):
        data = [{"id": "1", "name": "John"}, {"id": "2", "name": "Jane"}]
        page.add(lambda: ui.table("table-id", data))
        await scheduler.sleep(0)

        data.append({"id": "3", "name": "Jim"})

        page.update()
        await scheduler.sleep(0.002)

    def condition(event: Any) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            return "Jim" in JSON.stringify(event["diff"])
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


@pytest.mark.asyncio
async def test_updates_when_select_option_changes(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: Page, ui: UI):
        data = ["Option 1", "Option 2"]
        page.add(lambda: ui.select_box("select-id", data))
        await scheduler.sleep(0)

        data[0] = "Option 3"

        page.update()
        await scheduler.sleep(0.002)

    def condition(event: Any) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            return "Option 3" in JSON.stringify(event["diff"])
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


@pytest.mark.asyncio
async def test_updates_when_multiselect_option_changes(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: Page, ui: UI):
        data = ["Option 1", "Option 2"]
        page.add(lambda: ui.multi_select_box("select-id", data))
        await scheduler.sleep(0)

        data[0] = "Option 3"

        page.update()
        await scheduler.sleep(0.002)

    def condition(event: Any) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            return "Option 3" in JSON.stringify(event["diff"])
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


@pytest.mark.asyncio
async def test_updates_when_radio_option_changes(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: Page, ui: UI):
        data = ["Option 1", "Option 2"]
        page.add(lambda: ui.radio_group("radio-id", data))
        await scheduler.sleep(0)

        data[0] = "Option 3"

        page.update()
        await scheduler.sleep(0.002)

    def condition(event: Any) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            return "Option 3" in JSON.stringify(event["diff"])
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
