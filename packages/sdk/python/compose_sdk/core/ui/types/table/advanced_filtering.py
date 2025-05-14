from __future__ import annotations
from typing import TypedDict, Literal, Union, Sequence, Any


class TableAdvancedFilterClause(TypedDict):
    operator: Literal[
        "is",
        "is_not",
        "includes",
        "not_includes",
        "greater_than",
        "greater_than_or_equal",
        "less_than",
        "less_than_or_equal",
        "is_empty",
        "is_not_empty",
        "has_any",
        "not_has_any",
        "has_all",
        "not_has_all",
    ]
    value: Any
    key: str


SNAKE_TO_CAMEL_CASE_OPERATOR_MAP = {
    "is": "is",
    "is_not": "isNot",
    "includes": "includes",
    "not_includes": "notIncludes",
    "greater_than": "greaterThan",
    "greater_than_or_equal": "greaterThanOrEqual",
    "less_than": "lessThan",
    "less_than_or_equal": "lessThanOrEqual",
    "is_empty": "isEmpty",
    "is_not_empty": "isNotEmpty",
    "has_any": "hasAny",
    "not_has_any": "notHasAny",
    "has_all": "hasAll",
    "not_has_all": "notHasAll",
}

CAMEL_TO_SNAKE_CASE_OPERATOR_MAP = {
    "is": "is",
    "isNot": "is_not",
    "includes": "includes",
    "notIncludes": "not_includes",
    "greaterThan": "greater_than",
    "greaterThanOrEqual": "greater_than_or_equal",
    "lessThan": "less_than",
    "lessThanOrEqual": "less_than_or_equal",
    "isEmpty": "is_empty",
    "isNotEmpty": "is_not_empty",
    "hasAny": "has_any",
    "notHasAny": "not_has_any",
    "hasAll": "has_all",
    "notHasAll": "not_has_all",
}


class FilterModelFormat:
    SNAKE = "snake"
    CAMEL = "camel"
    TYPE = Literal["snake", "camel"]


class TableAdvancedFilterGroup(TypedDict):
    logic_operator: Literal["and", "or"]
    filters: Sequence[Union[TableAdvancedFilterClause, TableAdvancedFilterGroup]]


TableAdvancedFilterModel = Union[
    TableAdvancedFilterClause, TableAdvancedFilterGroup, None
]


def transform_advanced_filter_model(
    filter_model: TableAdvancedFilterModel, result_format: FilterModelFormat.TYPE
) -> Union[dict[str, Any], None]:
    """
    Recursively transforms a TableAdvancedFilterModel from either snake_case to
    camelCase or camelCase to snake_case

    Specifically transforms:
    - 'logic_operator' key to 'logicOperator', or vice-versa
    - 'operator' key's value from snake_case to camelCase (e.g., 'is_not' to 'isNot'), or vice-versa

    Leaves 'key' and 'value' fields untouched.

    Args:
        filter_model: The filter model dictionary (or None).
        result_format: either 'snake' or 'camel'

    Returns:
        A new dictionary with transformed keys/values, or None if input is None
        or an error occurs during transformation.
    """
    if filter_model is None:
        return None

    try:
        result_logic_operator_key = (
            "logic_operator"
            if result_format == FilterModelFormat.SNAKE
            else "logicOperator"
        )
        input_logic_operator_key = (
            "logicOperator"
            if result_format == FilterModelFormat.SNAKE
            else "logic_operator"
        )

        # Check if it's a group (has 'logic_operator')
        # Note: Using .get() for runtime safety, although TypedDict defines keys
        if input_logic_operator_key in filter_model:
            transformed_filters: list[dict[str, Any]] = []

            for f in filter_model.get("filters", []):
                # Recursively transform nested filters
                transformed_filter = transform_advanced_filter_model_to_camel_case(f)

                if transformed_filter is None:
                    # Propagate failure if a sub-transformation fails
                    return None

                transformed_filters.append(transformed_filter)

            return {
                result_logic_operator_key: filter_model.get(
                    input_logic_operator_key, "and"
                ),
                "filters": transformed_filters,
            }
        # Check if it's a clause (has 'operator')
        elif "operator" in filter_model:
            original_operator = filter_model.get("operator")

            # Map the operator value to camelCase
            result_format_operator = (
                SNAKE_TO_CAMEL_CASE_OPERATOR_MAP.get(original_operator)
                if result_format == FilterModelFormat.CAMEL
                else CAMEL_TO_SNAKE_CASE_OPERATOR_MAP.get(original_operator)
            )

            if result_format_operator is None:
                # This indicates an invalid operator value not covered by the Literal type
                # or the map, treat as an error.
                raise ValueError(
                    f"Unknown or unmapped operator value: {original_operator}"
                )

            return {
                "operator": result_format_operator,
                "value": filter_model.get("value"),
                "key": filter_model.get("key"),
            }
        else:
            # Should not happen with valid TableAdvancedFilterModel input
            raise TypeError(
                "Input dictionary is neither a TableAdvancedFilterClause nor a TableAdvancedFilterGroup"
            )

    except Exception:
        # Return None if any error occurs during processing
        return None


def transform_advanced_filter_model_to_camel_case(
    filter_model: TableAdvancedFilterModel,
) -> Union[dict[str, Any], None]:
    return transform_advanced_filter_model(
        filter_model, result_format=FilterModelFormat.CAMEL
    )


def transform_advanced_filter_model_to_snake_case(
    filter_model: TableAdvancedFilterModel,
) -> Union[dict[str, Any], None]:
    return transform_advanced_filter_model(
        filter_model, result_format=FilterModelFormat.SNAKE
    )
