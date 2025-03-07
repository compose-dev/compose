# type: ignore

from typing import Callable, Tuple, Union
import pytest

from compose_sdk.app.appRunner import AppRunner
from compose_sdk.scheduler import Scheduler
from compose_sdk.api import ApiHandler
from compose_sdk.app.appDefinition import AppDefinition


@pytest.fixture(scope="function")
def app_runner_generator() -> (
    Callable[[Callable], Tuple[AppRunner, ApiHandler, Scheduler]]
):
    def generate_app_runner(
        *,
        handler: Callable,
        app_definition: Union[AppDefinition, None] = None,
    ) -> Tuple[AppRunner, ApiHandler, Scheduler]:
        scheduler = Scheduler()
        scheduler.initialize(True)

        api = ApiHandler(
            scheduler,
            isDevelopment=True,
            apiKey="test_api_key",
            package_name="test_package_name",
            package_version="test_package_version",
        )

        _app_definition = app_definition or AppDefinition(
            route="test-app", handler=handler
        )

        runner = AppRunner(
            scheduler=scheduler,
            api=api,
            appDefinition=_app_definition,
            executionId="test_execution_id",
            browserSessionId="test_browser_session_id",
        )

        return runner, api, scheduler

    return generate_app_runner  # type: ignore
