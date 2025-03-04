from contextlib import contextmanager, asynccontextmanager
import datetime
import time
from typing import Callable, Generator, AsyncGenerator


class Debug:
    ORANGE = "\033[38;5;208m"
    RESET = "\033[0m"

    @staticmethod
    def log(
        type: str,
        message: str,
        *,
        duration_ms: float = 0,
        warning_threshold_ms: float = 50,
    ) -> None:
        message = f"{type} event | {message} | {datetime.datetime.now().isoformat(timespec='milliseconds')}"

        if duration_ms > warning_threshold_ms:
            message = f"{Debug.ORANGE}{message}{Debug.RESET}"

        print(message)

    @staticmethod
    @contextmanager
    def measure_duration(
        message: Callable[[float], str]
    ) -> Generator[None, None, None]:
        start = time.perf_counter()

        try:
            yield
        finally:
            elapsed = (time.perf_counter() - start) * 1000
            message(elapsed)

    @staticmethod
    @asynccontextmanager
    async def async_measure_duration(
        message: Callable[[float], str]
    ) -> AsyncGenerator[None, None]:
        start = time.perf_counter()

        try:
            yield
        finally:
            elapsed = (time.perf_counter() - start) * 1000
            message(elapsed)
