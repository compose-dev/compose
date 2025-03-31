import time
from typing import TypeVar, Literal

T = TypeVar("T")


class RateLimiter:
    """
    A simple rate limiter that rate limits based on a fixed window, instead of
    a more advanced sliding window.
    """

    def __init__(self, max_invocations_per_interval: int, interval_length_ms: int):
        """
        Initialize a new rate limiter.

        Parameters
        ----------
        max_invocations_per_interval : int
            The maximum number of invocations allowed in the interval.
        interval_length_ms : int
            The length of the interval in milliseconds.
        """
        self.max_invocations_per_interval = max_invocations_per_interval
        self.interval_length_ms = interval_length_ms

        # Initialize the window start time and counter
        self.window_start = time.time()
        self.invocation_count = 0

    def invoke(
        self,
    ) -> Literal["success", "error"]:
        """
        Invoke a function if the rate limit allows, otherwise invoke the error handler.

        Parameters
        ----------
        on_success : Callable[[], Any] or Callable[[], Awaitable[Any]]
            The function to call if the rate limit allows.
        on_error : Callable[[], Any] or Callable[[], Awaitable[Any]]
            The function to call if the rate limit is exceeded.

        Raises
        ------
        Exception
            Any exception raised by the on_success function.
        """
        now = time.time()

        # Check if the interval has passed since the current window started
        if ((now - self.window_start) * 1000) >= self.interval_length_ms:
            # Reset the window
            self.window_start = now
            self.invocation_count = 0

        if self.invocation_count < self.max_invocations_per_interval:
            self.invocation_count += 1
            return "success"
        else:
            return "error"
