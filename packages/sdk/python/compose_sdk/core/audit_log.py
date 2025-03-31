from typing import Any, Mapping, Union
from .json import JSON


def validate_audit_log_data(data: Mapping[str, Any]) -> None:
    """
    Validates that the audit log data is not larger than 4KB.

    Parameters
    ----------
    data : Mapping[str, Any]
        The data to validate

    Raises
    ----------
    ValueError
        If the data is larger than 4KB
    """
    # Convert the data to a JSON string
    json_data = JSON.stringify(data)

    # Check if the JSON string is larger than 4KB (4 * 1024 bytes)
    if len(json_data.encode("utf-8")) > 4 * 1024:
        raise ValueError(
            "Failed to write to audit log: metadata must be at most 4 kilobytes."
        )

    return


def validate_audit_log_message(message: str) -> None:
    """
    Validates that the audit log message is not larger than 1024 characters.

    Parameters
    ----------
    message : str
        The message to validate

    Raises
    ----------
    ValueError
        If the message is larger than 1024 characters
    """
    if len(message) > 1024:
        raise ValueError(
            "Failed to write to audit log: message must be at most 1024 characters."
        )

    return


def validate_audit_log_severity(severity: str) -> None:
    """
    Validates that the audit log severity is one of the allowed values.
    """
    if severity not in ["trace", "debug", "info", "warn", "error", "fatal"]:
        raise ValueError(
            "Failed to write to audit log: severity must be one of 'trace', 'debug', 'info', 'warn', 'error', or 'fatal'."
        )

    return


def validate_audit_log(
    message: str, severity: Union[str, None], data: Union[Mapping[str, Any], None]
) -> None:
    """
    Validates that the audit log message, severity, and data are valid.
    """
    validate_audit_log_message(message)

    if severity is not None:
        validate_audit_log_severity(severity)

    if data is not None:
        validate_audit_log_data(data)
