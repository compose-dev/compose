from contextlib import contextmanager, AbstractContextManager
from typing import Any, Callable, Dict, Generator, Union, List
import inspect
from compose_sdk.core.eventType import SDK_TO_SERVER_EVENT_TYPE
from tests.fixtures.mock_app_runner import *  # Import all fixtures

from compose_sdk.scheduler import Scheduler
from compose_sdk.api import ApiHandler
import compose_sdk as c
from typing_extensions import NotRequired, TypedDict
import time

HandlerFunction = Callable


@pytest.fixture(scope="function")
def scheduler() -> Scheduler:
    """
    Creates and initializes a Scheduler instance.
    Scope is function-level to ensure clean state for each test.
    """
    scheduler = Scheduler()
    return scheduler


@pytest.fixture(scope="function")
def api(scheduler: Scheduler) -> ApiHandler:
    """
    Creates an ApiHandler instance configured for testing.
    Uses test-specific values and development mode.
    """
    return ApiHandler(
        scheduler,
        isDevelopment=True,
        apiKey="test_api_key",
        package_name="test_package_name",
        package_version="test_package_version",
    )


AppDefinitionFactory = Callable[[Callable[..., Any]], AppDefinition]


@pytest.fixture(scope="function")
def app_definition_factory(scheduler: Scheduler) -> AppDefinitionFactory:
    """
    Factory fixture that creates AppDefinition instances.
    Allows tests to easily create app definitions with different handlers.
    """

    def create_app_definition(handler: Callable[..., Any]) -> AppDefinition:
        async def handler_wrapper(page: c.Page, ui: c.UI, state: c.State):
            async def add_with_sleep(*args: Any, **kwargs: Any):
                result = page.add(*args, **kwargs)
                await scheduler.sleep(0)
                return result

            async def modal_with_sleep(*args: Any, **kwargs: Any):
                result = page.modal(*args, **kwargs)
                await scheduler.sleep(0)
                return result

            async def update_with_sleep(*args: Any, **kwargs: Any):
                result = page.update(*args, **kwargs)
                await scheduler.sleep(0.002)
                return result

            page.add_with_sleep = add_with_sleep  # type: ignore
            page.modal_with_sleep = modal_with_sleep  # type: ignore
            page.update_with_sleep = update_with_sleep  # type: ignore

            handler_params = inspect.signature(handler).parameters
            kwargs = {}
            if "page" in handler_params:
                kwargs["page"] = page
            if "state" in handler_params:
                kwargs["state"] = state
            if "ui" in handler_params:
                kwargs["ui"] = ui

            if inspect.iscoroutinefunction(handler):
                return await handler(**kwargs)
            else:
                return handler(**kwargs)

        return AppDefinition("test-app", handler_wrapper)

    return create_app_definition


AppRunnerFactory = Callable[
    ...,
    AbstractContextManager[AppRunner],
]


@pytest.fixture(scope="function")
def app_runner_factory(
    scheduler: Scheduler,
    api: ApiHandler,
    app_definition_factory: AppDefinitionFactory,
) -> AppRunnerFactory:
    """
    Factory fixture that creates preconfigured AppRunner instances.
    Allows customization of handler and runner options while providing sensible defaults.
    """

    @contextmanager
    def create_runner(
        *,
        handler: Callable[..., Any],
        runner_options: Union[Dict[str, Any], None] = None,
    ) -> Generator[AppRunner, None, None]:
        # Start the scheduler once the test has began running
        scheduler.init(True)

        options = {
            "executionId": "test_execution_id",
            "browserSessionId": "test_browser_session_id",
        }

        if runner_options:
            options.update(runner_options)

        definition = app_definition_factory(handler)

        runner = AppRunner(
            scheduler=scheduler,
            api=api,
            appDefinition=definition,
            **options,
        )

        try:
            yield runner
        finally:
            runner.cleanup()

    return create_runner


class ApiEventTrackerRenders(TypedDict):
    renderId: str
    rootComponentId: str


class ApiEventTrackerOptions(TypedDict):
    on_event: NotRequired[Callable[..., Any]]
    condition: NotRequired[Callable[..., Any]]


class ApiEventTracker:
    def __init__(
        self,
        *,
        api: ApiHandler,
        scheduler: Scheduler,
        options: Union[ApiEventTrackerOptions, None] = None,
    ):
        self.api = api
        self.scheduler = scheduler
        self.events: List[Any] = []
        self.render_count: int = 0
        self.rerender_count: int = 0
        self.met_condition: bool = False
        self.renders: List[ApiEventTrackerRenders] = []

        options = options or {}

        async def send(event: Any, session_id: str, execution_id: str):
            self.events.append(event)

            on_event = options.get("on_event")

            if on_event is not None:
                on_event(event)

            if event["type"] == SDK_TO_SERVER_EVENT_TYPE.RENDER_UI_V2:
                self.render_count += 1

                self.renders.append(
                    {
                        "renderId": event["renderId"],
                        "rootComponentId": event["ui"]["model"]["id"],
                    }
                )

            elif event["type"] == SDK_TO_SERVER_EVENT_TYPE.RERENDER_UI_V3:
                self.rerender_count += 1

            condition = options.get("condition")

            if condition is not None and not self.met_condition:
                param_count = len(inspect.signature(condition).parameters)

                if param_count == 0:
                    result = condition()
                elif param_count == 1:
                    result = condition(event)
                elif param_count == 2:
                    result = condition(event, self)
                else:
                    raise Exception(
                        f"condition function supplies {param_count} arguments, but condition function expects 0, 1, or 2."
                    )

                if result is not None:
                    self.met_condition = result

        api.send = send  # type: ignore

    @property
    def one_render_or_more(self):
        return self.render_count > 0

    @property
    def one_rerender_or_more(self):
        return self.rerender_count > 0

    async def wait_until_condition(
        self,
        options: Union[Dict[str, Any], None] = None,
    ):
        options = options or {}
        timeout_ms = options.get("timeoutMs", 10)
        interval_ms = options.get("intervalMs", 5)

        start = time.time()
        while not self.met_condition and (time.time() - start) * 1000 < timeout_ms:
            await self.scheduler.sleep(interval_ms / 1000)


ApiEventTrackerFactory = Callable[
    [ApiEventTrackerOptions],
    ApiEventTracker,
]


@pytest.fixture(scope="function")
def api_event_tracker_factory(
    api: ApiHandler,
    scheduler: Scheduler,
) -> ApiEventTrackerFactory:
    def create_tracker(options: Union[ApiEventTrackerOptions, None] = None):
        return ApiEventTracker(api=api, scheduler=scheduler, options=options)

    return create_tracker
