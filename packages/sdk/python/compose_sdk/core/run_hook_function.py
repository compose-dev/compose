from typing import Any, Callable
import inspect


async def run_hook_function(hook_function: Callable[..., Any], *args: Any) -> Any:
    """
    Run a hook function with arguments.

    - If the hook function is a coroutine function, it will be awaited.
    - Checks how many arguments the hook function expects and provides the
      correct number of arguments to the hook function.
    """

    async def _run_hook_function(*arguments: Any) -> Any:
        if inspect.iscoroutinefunction(hook_function):
            return await hook_function(*arguments)
        else:
            return hook_function(*arguments)

    param_count = len(inspect.signature(hook_function).parameters)
    num_args = len(args)

    if param_count > num_args:
        raise Exception(
            f"hook function supplies {num_args} arguments, but {hook_function.__name__} function expects {param_count}."
        )

    return await _run_hook_function(*args[:param_count])
