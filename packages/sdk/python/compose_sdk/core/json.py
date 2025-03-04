from datetime import datetime, date, time
from decimal import Decimal
import orjson
from uuid import UUID
from pathlib import Path
from enum import Enum
from typing import Any, Dict, Union, List, Callable

Json = Union[
    Dict[Any, Any],
    List[Any],
    str,
    int,
    float,
    bool,
    None,
    Decimal,
    UUID,
    Path,
    Enum,
    datetime,
    date,
    time,
    Callable[[Any], Any],
    bytes,
    bytearray,
]


class JSON:
    """
    High-performance JSON serialization/deserialization class using orjson.
    """

    @staticmethod
    def _orjson_fallback(obj: Any) -> Any:
        if isinstance(obj, Decimal):
            return float(obj)
        if isinstance(obj, (Path, Enum)):
            return str(obj)
        if callable(obj):
            return None
        return "$$COULD_NOT_SERIALIZE$$"

    @staticmethod
    def to_bytes(obj: Any) -> bytes:
        options = orjson.OPT_NON_STR_KEYS | orjson.OPT_UTC_Z

        # Use orjson's dumps with our custom default function
        return orjson.dumps(obj, default=JSON._orjson_fallback, option=options)

    @staticmethod
    def stringify(obj: Any) -> str:
        return JSON.to_bytes(obj).decode("utf-8")

    @staticmethod
    def remove_keys(data: Dict[Any, Any], keys_to_ignore: List[str]) -> Dict[Any, Any]:
        return {k: v for k, v in data.items() if k not in keys_to_ignore}

    @staticmethod
    def parse(data: str) -> Any:
        return orjson.loads(data)
