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


@pytest.mark.asyncio
async def test_app_runner_initialization(
    app_runner_generator: Callable[[Callable], Tuple[AppRunner, ApiHandler]]
):
    runner, _, _ = app_runner_generator(handler=lambda: None)  # type: ignore

    # Assert that renders and tempFiles are empty
    assert runner.renders == {}
    assert runner.tempFiles == {}
    assert runner.confirmationDialog is None


@pytest.mark.asyncio
async def test_app_runner_renders_ui(scheduler, app_runner_factory):
    async def handler(page: Page, ui: UI):
        page.add(lambda: ui.text("Hello, World!"))

    with app_runner_factory(handler=handler) as runner:
        # Run the app
        await runner.execute({})
        await scheduler.sleep(0)

    # Assert that there's exactly one render
    assert len(runner.renders) == 1

    # Get the single render from the dict
    render_id, render_data = next(iter(runner.renders.items()))

    # Assert that the static layout is correct
    assert render_data["static_layout"]["type"] == TYPE.DISPLAY_TEXT
    assert (
        render_data["static_layout"]["model"]["properties"]["text"] == "Hello, World!"
    )


@pytest.mark.asyncio
async def test_properly_defers_state_updates(scheduler, api, app_runner_factory):
    def handler(page: Page, ui: UI, state: State):
        state["processing"] = False

        page.add(
            lambda: ui.cond(
                state["processing"] == True,
                true=ui.text("YES processing"),
                false=ui.text("NO processing"),
            )
        )

        state["processing"] = True

    did_rerender = False

    async def send(event, _, _1):
        nonlocal did_rerender

        if "YES processing" in JSON.stringify(event):
            did_rerender = True

    api.send = send

    # Run the app
    with app_runner_factory(handler=handler) as runner:
        await runner.execute({})
        await scheduler.sleep(0)

    # Assert that it re-rendered
    assert did_rerender is True


@pytest.mark.asyncio
async def test_app_runner_sets_confirmation_dialog(app_runner_generator):
    runner: AppRunner
    scheduler: Scheduler

    async def handler(page: Page):
        page.confirm()

    runner, _, scheduler = app_runner_generator(handler=handler)

    # It starts off with no confirmation dialog
    assert runner.confirmationDialog is None

    # Run the app
    await runner.execute({})
    await scheduler.sleep(0)

    # Assert that there's no renders
    assert len(runner.renders) == 0

    assert runner.confirmationDialog is not None
    assert runner.confirmationDialog["is_active"] is True
    assert runner.confirmationDialog["id"] is not None


@pytest.mark.asyncio
async def test_app_runner_correctly_resolves_confirmation_dialog(app_runner_generator):
    runner: AppRunner
    scheduler: Scheduler

    confirm_response = None

    async def handler(page: Page):
        nonlocal confirm_response

        response = page.confirm()
        await scheduler.sleep(0)

        if runner.confirmationDialog is not None:
            id = runner.confirmationDialog["id"]
            await runner.on_confirm_response_hook(id, True)

        confirm_response = await response

    runner, _, scheduler = app_runner_generator(handler=handler)

    # It starts off with no confirmation dialog
    assert runner.confirmationDialog is None

    # Run the app
    await runner.execute({})
    await scheduler.sleep(0)

    assert confirm_response is True


@pytest.mark.asyncio
async def test_app_runner_does_not_allow_two_confirmation_dialogs(app_runner_generator):
    runner: AppRunner
    api: ApiHandler
    scheduler: Scheduler

    async def handler(page: Page):
        page.confirm()
        await scheduler.sleep(0)

        page.confirm()
        await scheduler.sleep(0)

    runner, api, scheduler = app_runner_generator(handler=handler)

    got_error = False

    def send(event, _, _1):
        nonlocal got_error

        if (
            event["type"] == EventType.SdkToServer.APP_ERROR_V2
            and event["errorMessage"]
            == "Trying to open a confirmation dialog while another one is already open"
        ):
            got_error = True

    api.send = send  # type: ignore

    # It starts off with no confirmation dialog
    assert runner.confirmationDialog is None

    # Run the app
    await runner.execute({})
    await scheduler.sleep(0)

    assert got_error is True


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
            name="test app", handler=handler, initial_state={"test": "test"}
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
        name="test app", handler=handler, initial_state={"count": 0}
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


async def test_app_runner_updates_component_when_state_is_updated(app_runner_generator):
    runner: AppRunner
    scheduler: Scheduler

    async def handler(page: Page, ui: UI, state: State):
        state["count"] = 0

        page.add(lambda: ui.text(f"{str(state['count'])} UNIQUE_TEXT"))

        def increment():
            state["count"] += 1

        page.add(lambda: ui.button("increment", on_click=increment))

        await scheduler.sleep(0)

        render_id = next(
            render_id
            for render_id, render_data in runner.renders.items()
            if "increment" in JSON.stringify(render_data)
        )

        await runner.on_click_hook("increment", render_id)
        await scheduler.sleep(0.002)  # Account for debounce on state update

    runner, api, scheduler = app_runner_generator(handler=handler)

    did_rerender = False

    async def send(event, _, _1):
        nonlocal did_rerender

        render_id = next(
            render_id
            for render_id, render_data in runner.renders.items()
            if "UNIQUE_TEXT" in JSON.stringify(render_data)
        )

        is_rerender = event["type"] == EventType.SdkToServer.RERENDER_UI_V3

        if is_rerender and "1" in JSON.stringify(event["diff"][render_id]["update"]):
            did_rerender = True

    api.send = send

    # Run the app
    await runner.execute({})
    await scheduler.sleep(0)

    assert did_rerender is True


async def test_app_runner_deletes_and_adds_component_when_state_is_updated(
    app_runner_generator,
):
    runner: AppRunner
    scheduler: Scheduler

    async def handler(page: Page, ui: UI, state: State):
        state["count"] = 0

        def get_ui():
            if state["count"] == 0:
                return ui.text_input("UNIQUE_TEXT")

            return ui.header("1, UNIQUE_HEADER")

        page.add(get_ui)

        def increment():
            state["count"] += 1

        page.add(lambda: ui.button("increment", on_click=increment))

        await scheduler.sleep(0)

        render_id = next(
            render_id
            for render_id, render_data in runner.renders.items()
            if "increment" in JSON.stringify(render_data)
        )

        await runner.on_click_hook("increment", render_id)
        await scheduler.sleep(0.002)  # Account for debounce on state update

    runner, api, scheduler = app_runner_generator(handler=handler)

    did_rerender = False

    async def send(event, _, _1):
        nonlocal did_rerender

        render_id = next(
            render_id
            for render_id, render_data in runner.renders.items()
            if "UNIQUE_HEADER" in JSON.stringify(render_data)
        )

        is_rerender = event["type"] == EventType.SdkToServer.RERENDER_UI_V3

        if (
            is_rerender
            and event["diff"][render_id]["delete"][0] == "UNIQUE_TEXT"
            and "1, UNIQUE_HEADER" in JSON.stringify(event["diff"][render_id]["add"])
        ):
            did_rerender = True

    api.send = send

    # Run the app
    await runner.execute({})
    await scheduler.sleep(0)

    assert did_rerender is True


async def test_app_runner_does_nothing_when_state_update_does_not_change_anything(
    app_runner_generator,
):
    runner: AppRunner
    scheduler: Scheduler

    async def handler(page: Page, ui: UI, state: State):
        state["initial"] = "initial"
        state["count"] = 0

        page.add(lambda: ui.text(state["initial"], style={"color": "red"}))

        def increment():
            state["count"] += 1

        page.add(ui.button("increment", on_click=increment))

        await scheduler.sleep(0)

        render_id = next(
            internal_render_id
            for internal_render_id, render_data in runner.renders.items()
            if "increment" in JSON.stringify(render_data)
        )

        await runner.on_click_hook("increment", render_id)
        await scheduler.sleep(0.002)  # Account for debounce on state update
        page.add(lambda: ui.header(str(state["count"])))

        await scheduler.sleep(0)

        await runner.on_click_hook("increment", render_id)
        await scheduler.sleep(0.002)  # Account for debounce on state update

    runner, api, scheduler = app_runner_generator(handler=handler)

    received_incorrect_render = False
    received_correct_render = False

    async def send(event, _, _1):
        nonlocal received_incorrect_render
        nonlocal received_correct_render

        if event["type"] != EventType.SdkToServer.RERENDER_UI_V3:
            return

        render_id = list(event["diff"].keys())[0]

        update = list(event["diff"][render_id]["update"].values())[0]

        is_style_defined = update["style"] is not None

        if is_style_defined:
            received_incorrect_render = True
        else:
            received_correct_render = True

    api.send = send

    # Run the app
    await runner.execute({})
    await scheduler.sleep(0)

    assert received_incorrect_render is False
    assert received_correct_render is True
