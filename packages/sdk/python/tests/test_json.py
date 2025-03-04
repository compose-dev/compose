from compose_sdk.core import JSON

from datetime import datetime, date, time
from decimal import Decimal
from uuid import UUID
from pathlib import Path
from enum import Enum


class SampleEnum(Enum):
    OPTION_A = "a"
    OPTION_B = "b"


def test_to_bytes_basic_types():
    # Test basic JSON types
    assert JSON.to_bytes("string") == b'"string"'
    assert JSON.to_bytes(123) == b"123"
    assert JSON.to_bytes(123.45) == b"123.45"
    assert JSON.to_bytes(True) == b"true"
    assert JSON.to_bytes(False) == b"false"
    assert JSON.to_bytes(None) == b"null"


def test_to_bytes_complex_types():
    # Test complex JSON types
    assert JSON.to_bytes({"key": "value"}) == b'{"key":"value"}'
    assert JSON.to_bytes(["item1", "item2"]) == b'["item1","item2"]'
    assert JSON.to_bytes({"nested": {"key": "value"}}) == b'{"nested":{"key":"value"}}'
    assert JSON.to_bytes({"array": [1, 2, 3]}) == b'{"array":[1,2,3]}'


def test_to_bytes_decimal():
    # Test Decimal type
    assert JSON.to_bytes(Decimal("123.45")) == b"123.45"
    assert JSON.to_bytes({"price": Decimal("99.99")}) == b'{"price":99.99}'


def test_to_bytes_uuid():
    # Test UUID type
    uuid_obj = UUID("550e8400-e29b-41d4-a716-446655440000")
    result = JSON.to_bytes(uuid_obj)
    assert result == b'"550e8400-e29b-41d4-a716-446655440000"'


def test_to_bytes_path():
    # Test Path type
    path_obj = Path("/tmp/test.txt")
    result = JSON.to_bytes(path_obj)
    assert result == b'"/tmp/test.txt"'


def test_to_bytes_enum():
    # Test Enum type
    assert JSON.to_bytes(SampleEnum.OPTION_A) == b'"a"'
    assert JSON.to_bytes({"enum": SampleEnum.OPTION_B}) == b'{"enum":"b"}'


def test_to_bytes_datetime():
    # Test datetime types
    dt = datetime(2023, 1, 1, 12, 0, 0)
    d = date(2023, 1, 1)
    t = time(12, 0, 0)

    dt_result = JSON.to_bytes(dt)
    d_result = JSON.to_bytes(d)
    t_result = JSON.to_bytes(t)

    assert b'"2023-01-01' in dt_result
    assert b'"2023-01-01"' in d_result
    assert b'"12:00:00"' in t_result


def test_to_bytes_callable():
    # Test callable type (should use fallback)
    def test_func():
        return "test"

    result = JSON.to_bytes(test_func)
    assert result == b"null"


def test_to_bytes_bytes():
    # Test bytes and bytearray
    assert JSON.to_bytes(b"binary data") is not None
    assert JSON.to_bytes(bytearray(b"binary data")) is not None


def test_to_bytes_mixed_complex():
    def test_func():
        return "test"

    # Test a complex object with mixed types
    complex_obj = {
        "string": "value",
        "number": 123,
        "decimal": Decimal("456.78"),
        "boolean": True,
        "null": None,
        "array": [1, "two", Decimal("3.0")],
        "nested": {
            "date": date(2023, 1, 1),
            "time": time(12, 0, 0),
            "enum": SampleEnum.OPTION_A,
            "uuid": UUID("550e8400-e29b-41d4-a716-446655440000"),
            "deeper": {
                "callable": lambda: "test",
                "callable_result": test_func,
            },
            "datetime": datetime(2023, 1, 1, 12, 0, 0),
        },
        "path": Path("/tmp/test.txt"),
    }

    # Just verify it doesn't raise an exception
    result = JSON.to_bytes(complex_obj)
    assert result is not None
    assert (
        result
        == b'{"string":"value","number":123,"decimal":456.78,"boolean":true,"null":null,"array":[1,"two",3.0],"nested":{"date":"2023-01-01","time":"12:00:00","enum":"a","uuid":"550e8400-e29b-41d4-a716-446655440000","deeper":{"callable":null,"callable_result":null},"datetime":"2023-01-01T12:00:00"},"path":"/tmp/test.txt"}'
    )


def test_to_bytes_non_str_keys():
    # Test dictionary with non-string keys
    assert JSON.to_bytes({1: "value"}) == b'{"1":"value"}'
    assert JSON.to_bytes({True: "value"}) == b'{"true":"value"}'
    assert JSON.to_bytes({None: "value"}) == b'{"null":"value"}'


def test_to_bytes_unsupported_type():
    # Test unsupported type
    class CustomClass:
        pass

    result = JSON.to_bytes(CustomClass())
    assert result == b'"$$COULD_NOT_SERIALIZE$$"'
