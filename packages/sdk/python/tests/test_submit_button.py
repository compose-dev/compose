from typing import Any
import pytest
from compose_sdk.scheduler import Scheduler
from compose_sdk.core import EventType, TYPE
from compose_sdk.core.static_tree import StaticTree
import compose_sdk as c
from tests.conftest import AppRunnerFactory, ApiEventTrackerFactory, ApiEventTracker


@pytest.mark.asyncio
async def test_add_submit_button_to_form_if_not_present(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: c.Page, ui: c.UI):
        page.add(lambda: ui.form("form", [ui.text_input("input")]))
        await scheduler.sleep(0)

    def condition(event: Any) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RENDER_UI_V2:
            model: Any = event["ui"]["model"]

            if model["id"] == "form":
                if "children" in model and isinstance(model["children"], list):
                    if len(model["children"]) == 2:
                        if model["children"][1]["type"] == TYPE.BUTTON_FORM_SUBMIT:
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


@pytest.mark.asyncio
async def test_add_submit_button_to_form_when_only_one_child(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: c.Page, ui: c.UI):
        page.add(lambda: ui.form("form", ui.text_input("input")))
        await scheduler.sleep(0)

    def condition(event: Any) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RENDER_UI_V2:
            model: Any = event["ui"]["model"]

            if model["id"] == "form":
                if "children" in model and isinstance(model["children"], list):
                    if len(model["children"]) == 2:
                        if model["children"][1]["type"] == TYPE.BUTTON_FORM_SUBMIT:
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


@pytest.mark.asyncio
async def test_add_submit_button_to_form_when_nested(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: c.Page, ui: c.UI):
        page.add(
            lambda: ui.row(
                ui.stack(
                    [
                        ui.text("hello"),
                        ui.code("SHEESH"),
                        ui.form(
                            "form",
                            ui.stack([ui.text_input("input"), ui.text_input("input2")]),
                        ),
                        ui.text("world"),
                    ]
                )
            )
        )
        await scheduler.sleep(0)

    def condition(event: Any) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RENDER_UI_V2:
            component: Any = event["ui"]

            form = StaticTree.find_component.by_id(component, "form")

            if form is None:
                return False

            children: Any = form["model"]["children"]

            if children and isinstance(children, list):
                if len(children) == 2:  # type: ignore
                    if children[1]["type"] == TYPE.BUTTON_FORM_SUBMIT:
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


@pytest.mark.asyncio
async def test_not_add_submit_button_to_form_when_already_present(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: c.Page, ui: c.UI):
        page.add(
            lambda: ui.row(
                ui.stack(
                    [
                        ui.text("hello"),
                        ui.code("SHEESH"),
                        ui.form(
                            "form",
                            ui.stack(
                                [
                                    ui.text_input("input"),
                                    ui.submit_button("yo button"),
                                    ui.text_input("input2"),
                                ]
                            ),
                        ),
                        ui.text("world"),
                    ]
                )
            )
        )
        await scheduler.sleep(0)

    def condition(event: Any) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RENDER_UI_V2:
            component: Any = event["ui"]

            count = StaticTree.find_component.count_by_type(
                component, TYPE.BUTTON_FORM_SUBMIT
            )

            return count == 1

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
async def test_not_add_submit_button_to_form_when_hide_is_true(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: c.Page, ui: c.UI):
        page.add(
            lambda: ui.row(
                ui.stack(
                    [
                        ui.text("hello"),
                        ui.code("SHEESH"),
                        ui.form(
                            "form",
                            ui.stack([ui.text_input("input"), ui.text_input("input2")]),
                            hide_submit_button=True,
                        ),
                        ui.text("world"),
                    ]
                )
            )
        )
        await scheduler.sleep(0)

    def condition(event: Any) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RENDER_UI_V2:
            component: Any = event["ui"]

            count = StaticTree.find_component.count_by_type(
                component, TYPE.BUTTON_FORM_SUBMIT
            )

            return count == 0

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
async def test_remove_submit_buttons_from_form_when_hide_is_true(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: c.Page, ui: c.UI):
        page.add(
            lambda: ui.row(
                ui.stack(
                    [
                        ui.text("hello"),
                        ui.code("SHEESH"),
                        ui.form(
                            "form",
                            [
                                ui.stack(
                                    [
                                        ui.text_input("input"),
                                        ui.submit_button("yo button"),
                                        ui.text_input("input2"),
                                    ]
                                ),
                                ui.submit_button("yo1 button"),
                                ui.stack(ui.submit_button("yo3 button")),
                                ui.card(
                                    ui.row(
                                        ui.stack(
                                            [
                                                ui.code("yeet"),
                                                ui.submit_button("another one"),
                                            ]
                                        )
                                    )
                                ),
                            ],
                            hide_submit_button=True,
                        ),
                        ui.text("world"),
                    ]
                )
            )
        )
        await scheduler.sleep(0)

    def condition(event: Any) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RENDER_UI_V2:
            component: Any = event["ui"]

            count = StaticTree.find_component.count_by_type(
                component, TYPE.BUTTON_FORM_SUBMIT
            )

            return count == 0

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
async def test_not_rerender_auto_added_submit_button_when_not_necessary(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: c.Page, ui: c.UI):
        page.add(lambda: ui.form("form", [ui.text_input("input")]))
        await scheduler.sleep(0)

        text = "hello"
        page.add(lambda: ui.text(text))
        await scheduler.sleep(0)

        text = "world"
        page.update()
        await scheduler.sleep(0)

    def condition(event: Any, tracker: ApiEventTracker) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            diff: Any = event["diff"]

            if len(diff) == 1 and tracker.renders[1]["renderId"] in diff:
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
    assert tracker.rerender_count == 1
