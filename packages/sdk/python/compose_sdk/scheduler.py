import asyncio
import concurrent.futures
import threading
from typing import Any, Callable, Coroutine, Optional, Union


class Scheduler:
    """Light-weight task scheduler that unifies blocking and non-blocking
    execution models.

    After construction call :py:meth:`init` exactly once to decide whether the
    scheduler should take control of the main thread (blocking mode) or work
    alongside an existing application event-loop (non-blocking mode).

    In *blocking* mode::

        ┌─────────────┐      ┌──────────────────────────────┐
        │  Caller     │─────▶│  asyncio.get_event_loop()    │
        └─────────────┘      └──────────────────────────────┘

    In *non-blocking* mode::

        ┌─────────────┐   submit()    ┌────────────────────┐
        │  Caller     │──────────────▶│ ThreadPoolExecutor │
        └─────────────┘               └────────────────────┘
                 │ wrap_future()                ▲
                 │                               │
                 │  run_coroutine_threadsafe()   │ create_task()
                 ▼                               │
        ┌─────────────────────────────────────────────────────┐
        │          Background asyncio event-loop             │
        └─────────────────────────────────────────────────────┘

    The scheduler owns and cleans up all background resources when
    :py:meth:`shutdown` is invoked.
    """

    def __init__(self, *, max_workers: Union[int, None] = None) -> None:
        """Create a new *uninitialised* scheduler.

        Parameters
        ----------
        max_workers : int | None, optional
            Upper bound on the number of threads in the internal
            :class:`concurrent.futures.ThreadPoolExecutor` when operating in
            non-blocking mode.  If *None* the default used by
            :class:`~concurrent.futures.ThreadPoolExecutor` (CPU count) is
            preserved.
        """
        self._is_blocking: Union[bool, None] = None
        self._executor: Union[concurrent.futures.ThreadPoolExecutor, None] = None
        self._loop: Union[asyncio.AbstractEventLoop, None] = None
        self._loop_thread: Union[threading.Thread, None] = None
        self._max_workers = max_workers

        self._long_running_task: Union[asyncio.Task[Any], None] = None

    def init(self, is_blocking: bool) -> None:
        """Initialise the scheduler.

        This method must be called **exactly once** and determines the
        execution strategy for the lifetime of the instance.

        Parameters
        ----------
        is_blocking : bool
            • ``True`` – *Blocking* mode suitable for CLI scripts.  The
            scheduler reuses the current event-loop from
            :pyfunc:`asyncio.get_event_loop` and executes synchronous functions
            directly in the caller's thread.

            • ``False`` – *Non-blocking* mode suitable when embedding inside an
            existing application server.  A background event-loop (running in
            its own daemon thread) is created for coroutines while synchronous
            functions are delegated to a thread-pool.
        """
        self._is_blocking = is_blocking

        if not is_blocking:
            # Thread pool for synchronous work
            self._executor = concurrent.futures.ThreadPoolExecutor(
                max_workers=self._max_workers,  # defaults to cpu count
                thread_name_prefix="scheduler",
            )
            # Dedicated event loop in its own thread for *coroutine* work
            self._loop, self._loop_thread = self._build_loop_in_thread()
        else:
            self._loop = asyncio.get_event_loop()

    def run_sync(self, fn: Callable[..., Any], /, *args: Any, **kwargs: Any) -> Any:
        """Execute *fn* synchronously and return its result.

        • *Blocking* mode – calls ``fn`` directly on the caller's thread.

        • *Non-blocking* mode – submits ``fn`` to the internal
          :class:`ThreadPoolExecutor` and blocks until the result is available.

        Returns
        -------
        Any
            Whatever ``fn`` returns.

        Raises
        ------
        RuntimeError
            If the scheduler was initialised with ``is_blocking=False`` but
            the executor is unexpectedly missing.
        """
        if self._is_blocking:
            return fn(*args, **kwargs)
        else:
            if self._executor is None:  # should never happen
                raise RuntimeError(
                    "Scheduler was created as blocking=False, but executor is missing"
                )

            future = self._executor.submit(fn, *args, **kwargs)
            return future.result()

    def run_async(
        self,
        coro: Coroutine[Any, Any, Any],
    ) -> "concurrent.futures.Future[Any] | Any":
        """Schedule *coro* for execution and return a handle to its result.

        • *Blocking* mode – schedules the coroutine on the current event-loop
          and returns the resulting :class:`asyncio.Task`.

        • *Non-blocking* mode – submits the coroutine to the background loop
          via :pyfunc:`asyncio.run_coroutine_threadsafe` and returns a
          :class:`concurrent.futures.Future` that can be ``await``-ed thanks to
          :pyfunc:`asyncio.wrap_future`.
        """
        if self._loop is None:
            raise RuntimeError("Background loop not initialised")

        if self._is_blocking:
            return self._loop.create_task(coro)
        else:
            cfut = asyncio.run_coroutine_threadsafe(coro, self._loop)
            return asyncio.wrap_future(cfut, loop=self._loop)

    def run_endless_task(self, coro: Coroutine[Any, Any, Any]) -> None:
        """Run a long-lived coroutine that should out-live the caller.

        Typical use-case is a websocket listener that must stay alive for the
        duration of the application.

        In blocking mode this method will **block** the current thread by
        executing :pyfunc:`asyncio.AbstractEventLoop.run_forever`.
        """
        if self._loop is None:
            raise RuntimeError("Background loop not initialised")

        if self._is_blocking:
            self._long_running_task = self._loop.create_task(coro)
            self._loop.run_forever()
        else:
            self.run_async(coro)

    def create_future(self) -> asyncio.Future[Any]:
        """Return a new :class:`asyncio.Future` bound to the scheduler's loop."""
        if self._loop is None:
            raise RuntimeError("Background loop not initialised")

        return asyncio.Future(loop=self._loop)

    async def sleep(self, seconds: float) -> None:
        """Asynchronous sleep util bound to the scheduler's event-loop."""
        return await asyncio.sleep(seconds, loop=self._loop)

    def cancelable_delay(
        self, ms: float, callback: Callable[[], Any]
    ) -> asyncio.TimerHandle:
        """Schedule *callback* to be executed after *milliseconds*.

        The returned :class:`asyncio.TimerHandle` can be used to cancel the
        callback before it fires.
        """
        if self._loop is None:
            raise RuntimeError("Background loop not initialised")

        return self._loop.call_later(ms / 1000, callback)

    def shutdown(self) -> None:
        """Gracefully tear-down all background resources owned by the scheduler.

        The method is *idempotent* – multiple calls are safe and subsequent
        calls will have no effect after the first successful shutdown.
        """
        try:
            if self._executor:
                self._executor.shutdown(wait=True)

            if self._long_running_task:
                asyncio.get_event_loop().call_soon_threadsafe(
                    self._long_running_task.cancel
                )
                asyncio.get_event_loop().call_soon_threadsafe(
                    asyncio.get_event_loop().stop
                )
                self._long_running_task = None

            if self._loop:
                self._loop.call_soon_threadsafe(self._loop.stop)
                if self._loop_thread:
                    self._loop_thread.join()

        except Exception as e:
            print(e)

    @staticmethod
    def _build_loop_in_thread() -> tuple[asyncio.AbstractEventLoop, threading.Thread]:
        """Create a fresh event-loop inside a daemon thread and start it."""
        loop_ready = threading.Event()
        loop: Optional[asyncio.AbstractEventLoop] = None

        def _loop_runner() -> None:
            nonlocal loop
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            loop_ready.set()
            loop.run_forever()

        t = threading.Thread(target=_loop_runner, daemon=True)
        t.start()
        loop_ready.wait()
        assert loop is not None  # mypy/typing helper
        return loop, t
