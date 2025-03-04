import asyncio
from ..scheduler import Scheduler  # type: ignore[attr-defined]
from typing import Callable, Any, Union


class SmartDebounce:
    def __init__(self, scheduler: Scheduler, debounce_ms: int = 10):
        self.scheduler = scheduler
        self.debounce_ms = debounce_ms

        self.is_batching = False
        self.has_queued_update: bool = False

        self.debounce_timer: Union[asyncio.TimerHandle, None] = None

    def reset(self) -> None:
        self.is_batching = False
        self.has_queued_update = False
        self.debounce_timer = None

    def debounce(self, callback: Callable[..., Any]) -> None:
        if self.debounce_timer:
            self.debounce_timer.cancel()

        if not self.is_batching:
            self.is_batching = True

            self.debounce_timer = self.scheduler.cancelable_delay(
                self.debounce_ms, lambda: self.reset()
            )

            # Run the callback immediately
            callback()
        else:
            self.has_queued_update = True

            def debounce_callback() -> None:
                self.reset()
                callback()

            self.debounce_timer = self.scheduler.cancelable_delay(
                self.debounce_ms, debounce_callback
            )

    def cleanup(self) -> None:
        if self.debounce_timer:
            self.debounce_timer.cancel()

        self.reset()
