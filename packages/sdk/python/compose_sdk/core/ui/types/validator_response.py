from typing import Union, Awaitable

ValidatorResponse = Union[
    str, bool, None, Awaitable[str], Awaitable[bool], Awaitable[None]
]

VoidResponse = Union[None, Awaitable[None]]
