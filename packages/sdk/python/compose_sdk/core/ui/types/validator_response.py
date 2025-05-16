from typing import Union, Awaitable
from typing_extensions import TypeAlias

ValidatorResponse: TypeAlias = Union[
    str, bool, None, Awaitable[str], Awaitable[bool], Awaitable[None]
]

VoidResponse: TypeAlias = Union[None, Awaitable[None]]
