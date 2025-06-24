# type: ignore

from typing import Callable, Tuple

import pytest
from compose_sdk.scheduler import Scheduler
from compose_sdk.app.appRunner import AppRunner
from compose_sdk.api import ApiHandler
from compose_sdk import Page, UI, State
from compose_sdk.core import EventType, TYPE
from compose_sdk.app.appDefinition import AppDefinition
from compose_sdk.core.json import JSON
from tests.conftest import AppRunnerFactory, ApiEventTrackerFactory


@pytest.mark.asyncio
async def test_app_runner_initialization(
    app_runner_generator: Callable[[Callable], Tuple[AppRunner, ApiHandler]],
):
    runner, _, _ = app_runner_generator(handler=lambda: None)  # type: ignore

    # Assert that renders and tempFiles are empty
    assert runner.renders == []
    assert runner.renders_by_id == {}
    assert runner.tempFiles == {}
    assert runner.confirmationDialog is None


@pytest.mark.asyncio
async def test_app_runner_renders_ui(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: Page, ui: UI):
        page.add(lambda: ui.text("Hello, World!"))
        await scheduler.sleep(0)

    def condition(event) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RENDER_UI_V2:
            model = event["ui"]["model"]
            if (
                event["ui"]["type"] == TYPE.DISPLAY_TEXT
                and model["properties"]["text"] == "Hello, World!"
            ):
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
async def test_properly_defers_state_updates(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: Page, ui: UI, state: State):
        state["processing"] = False

        page.add(
            lambda: ui.cond(
                state["processing"] == True,
                true=ui.text("YES processing"),
                false=ui.text("NO processing"),
            )
        )

        state["processing"] = True
        await scheduler.sleep(0)

    def condition(event) -> bool:
        if not isinstance(event, dict):
            return False

        if event["type"] == EventType.SdkToServer.RENDER_UI_V2:
            # Check if the event contains "YES processing" text
            event_str = str(event)
            if "YES processing" in event_str:
                return True

        return False

    tracker = api_event_tracker_factory(
        {
            "condition": condition,
        }
    )

    # Run the app
    with app_runner_factory(handler=handler) as runner:
        await runner.execute({})
        await tracker.wait_until_condition()

    # Assert that it re-rendered
    assert tracker.met_condition is True


@pytest.mark.asyncio
async def test_app_runner_sets_confirmation_dialog(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    runner: AppRunner
    scheduler: Scheduler

    async def handler(page: Page):
        page.confirm()

    def condition(event) -> bool:
        if event["type"] == EventType.SdkToServer.CONFIRM_V2:
            return True

    tracker = api_event_tracker_factory(
        {
            "condition": condition,
        }
    )

    # Run the app
    with app_runner_factory(handler=handler) as runner:
        assert runner.confirmationDialog is None

        await runner.execute({})
        await tracker.wait_until_condition()

        # Assert that there's no renders
        assert len(runner.renders) == 0

        assert runner.confirmationDialog is not None
        assert runner.confirmationDialog["is_active"] is True
        assert runner.confirmationDialog["id"] is not None


@pytest.mark.asyncio
async def test_app_runner_correctly_resolves_confirmation_dialog(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    confirm_response = None

    async def handler(page: Page):
        nonlocal confirm_response

        response = page.confirm()
        await scheduler.sleep(0)

        if runner.confirmationDialog is not None:
            id = runner.confirmationDialog["id"]
            await runner.on_confirm_response_hook(id, True)

        confirm_response = await response

    def condition(event) -> bool:
        nonlocal confirm_response
        if confirm_response is not None:
            return True

        return False

    tracker = api_event_tracker_factory(
        {
            "condition": condition,
        }
    )

    with app_runner_factory(handler=handler) as runner:
        assert runner.confirmationDialog is None

        # Run the app
        await runner.execute({})
        await tracker.wait_until_condition()

        assert confirm_response is True


@pytest.mark.asyncio
async def test_app_runner_does_not_allow_two_confirmation_dialogs(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: Page):
        page.confirm()
        await scheduler.sleep(0)

        page.confirm()
        await scheduler.sleep(0)

    def condition(event) -> bool:
        if not isinstance(event, dict):
            return False

        if (
            event["type"] == EventType.SdkToServer.APP_ERROR_V2
            and event["errorMessage"]
            == "Trying to open a confirmation dialog while another one is already open"
        ):
            return True

        return False

    tracker = api_event_tracker_factory(
        {
            "condition": condition,
        }
    )

    with app_runner_factory(handler=handler) as runner:
        # It starts off with no confirmation dialog
        assert runner.confirmationDialog is None

        # Run the app
        await runner.execute({})
        await tracker.wait_until_condition()

    assert tracker.met_condition is True


@pytest.mark.asyncio
async def test_app_runner_is_initialized_with_empty_state(app_runner_generator):
    runner: AppRunner
    scheduler: Scheduler

    stateObj = None

    async def handler(state):
        nonlocal stateObj
        stateObj = state

    runner, _, scheduler = app_runner_generator(handler=handler)

    # Run the app
    await runner.execute({})
    await scheduler.sleep(0)

    assert stateObj == {}
    assert len(stateObj) == 0  # type: ignore


@pytest.mark.asyncio
async def test_app_runner_is_initialized_with_correct_state(app_runner_generator):
    runner: AppRunner
    scheduler: Scheduler

    stateObj = None

    async def handler(state):
        nonlocal stateObj
        stateObj = state

    runner, _, scheduler = app_runner_generator(
        handler=handler,
        app_definition=AppDefinition(
            "test-app", handler=handler, initial_state={"test": "test"}
        ),
    )

    # Run the app
    await runner.execute({})
    await scheduler.sleep(0)

    assert stateObj == {"test": "test"}
    assert len(stateObj) == 1  # type: ignore


@pytest.mark.asyncio
async def test_app_runner_state_is_re_initialized_across_executions(
    app_runner_generator,
):
    """
    When a user sets initial state, we need to ensure that every execution
    gets a fresh copy of the state. Previously, we had a bug where editing
    the state in one execution was editing the underlying initial_state object,
    which was then being used for all future executions.
    """
    counts = []

    async def handler(state):
        nonlocal counts
        counts.append(state["count"])
        state["count"] += 1

    appDefinition = AppDefinition(
        "test-app", handler=handler, initial_state={"count": 0}
    )

    runnerOne, api, scheduler = app_runner_generator(
        handler=handler,
        app_definition=appDefinition,
    )

    runnerTwo = AppRunner(
        scheduler=scheduler,
        api=api,
        appDefinition=appDefinition,
        executionId="test_execution_id2",
        browserSessionId="test_browser_session_id2",
    )

    # Run the app
    await runnerOne.execute({})
    await scheduler.sleep(0)

    await runnerTwo.execute({})
    await scheduler.sleep(0)

    assert counts[0] == 0
    assert counts[1] == 0


@pytest.mark.asyncio
async def test_app_runner_updates_component_when_state_is_updated(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    async def handler(page: Page, ui: UI, state: State):
        state["count"] = 0

        page.add(lambda: ui.text(f"{str(state['count'])} UNIQUE_TEXT"))

        def increment():
            state["count"] += 1

        page.add(lambda: ui.button("increment", on_click=increment))

        await scheduler.sleep(0.002)
        render_id = next(
            render_id
            for render_id, render_data in runner.renders_by_id.items()
            if "increment" in JSON.stringify(render_data)
        )
        await runner.on_click_hook("increment", render_id)

    def condition(event) -> bool:
        if not isinstance(event, dict):
            return False

        # Look for rerender event that updates the text from "0" to "1"
        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            event_str = JSON.stringify(event)
            if "1 UNIQUE_TEXT" in event_str:
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
async def test_app_runner_deletes_and_adds_component_when_state_is_updated(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):
    first_render_id = None

    async def handler(page: Page, ui: UI, state: State):
        nonlocal first_render_id

        state["count"] = 0

        def get_ui():
            if state["count"] == 0:
                return ui.text_input("UNIQUE_TEXT")

            return ui.header("1, UNIQUE_HEADER")

        page.add(get_ui)

        def increment():
            state["count"] += 1

        page.add(lambda: ui.button("increment", on_click=increment))

        await scheduler.sleep(0.002)
        first_render_id = runner.renders[0]

        # Find the button and click it
        await runner.on_click_hook("increment", runner.renders[1])

    def condition(event) -> bool:
        if not isinstance(event, dict):
            return False

        if first_render_id is None:
            return False

        # Look for rerender event that deletes UNIQUE_TEXT and adds UNIQUE_HEADER
        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            if event["diff"][first_render_id]["delete"][
                0
            ] == "UNIQUE_TEXT" and "1, UNIQUE_HEADER" in JSON.stringify(
                event["diff"][first_render_id]["add"]
            ):
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
async def test_app_runner_does_nothing_when_state_update_does_not_change_anything(
    scheduler: Scheduler,
    app_runner_factory: AppRunnerFactory,
    api_event_tracker_factory: ApiEventTrackerFactory,
):

    async def handler(page: Page, ui: UI, state: State):
        state["initial"] = "initial"
        state["count"] = 0

        page.add(lambda: ui.text(state["initial"], style={"color": "red"}))

        def increment():
            state["count"] += 1

        page.add(ui.button("increment", on_click=increment))

        await scheduler.sleep(0.002)

        # Should be the second render
        button_render_id = runner.renders[1]

        await runner.on_click_hook("increment", button_render_id)

        page.add(lambda: ui.header(str(state["count"])))
        await scheduler.sleep(0.002)

        # Second click - this should NOT cause the text component to rerender
        # since its content and style haven't changed
        await runner.on_click_hook("increment", button_render_id)

    received_incorrect_render = False
    received_correct_render = None

    def condition(event) -> bool:
        nonlocal received_incorrect_render
        nonlocal received_correct_render

        if not isinstance(event, dict):
            return False

        # Look for rerender event that updates the header count (should happen)
        # but NOT the text with style (should not happen since it hasn't changed)
        if event["type"] == EventType.SdkToServer.RERENDER_UI_V3:
            render_id = list(event["diff"].keys())[0]

            update = list(event["diff"][render_id]["update"].values())[0]

            is_style_defined = update["style"] is not None

            if is_style_defined:
                received_incorrect_render = True
            else:
                received_correct_render = True

        return False

    tracker = api_event_tracker_factory(
        {
            "condition": condition,
        }
    )

    with app_runner_factory(handler=handler) as runner:
        await runner.execute({})
        await tracker.wait_until_condition()

    assert received_incorrect_render is False
    assert received_correct_render is True
