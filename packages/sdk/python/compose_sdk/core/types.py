from typing import Any, Union, Callable, Awaitable


IntFloat = Union[int, float]
IntFloatStr = Union[int, float, str]

UntypedCallable = Callable[..., Any]

NullableStr = Union[str, None]
NullableInt = Union[int, None]
NullableFloat = Union[float, None]
NullableIntFloat = Union[int, float, None]
NullableIntFloatStr = Union[int, float, str, None]
NullableUntypedCallable = Union[UntypedCallable, None]

AnyOrAwaitableAny = Union[Awaitable[Any], Any]
