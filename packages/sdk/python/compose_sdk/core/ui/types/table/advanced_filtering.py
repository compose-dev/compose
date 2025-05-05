from __future__ import annotations
from typing import TypedDict, Literal, Union, List, Any


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


class TableAdvancedFilterGroup(TypedDict):
    logic_operator: Literal["and", "or"]
    filters: List[Union[TableAdvancedFilterClause, TableAdvancedFilterGroup]]


TableAdvancedFilterModel = Union[
    TableAdvancedFilterClause, TableAdvancedFilterGroup, None
]


def transform_advanced_filter_model_to_camel_case(
    filter_model: TableAdvancedFilterModel,
) -> Union[dict[str, Any], None]:
    """
    Recursively transforms a TableAdvancedFilterModel from snake_case keys/values
    to camelCase keys/values as expected by the frontend.

    Specifically transforms:
    - 'logic_operator' key to 'logicOperator'
    - 'operator' key's value from snake_case to camelCase (e.g., 'is_not' to 'isNot')

    Leaves 'key' and 'value' fields untouched.

    Args:
        filter_model: The filter model dictionary (or None).

    Returns:
        A new dictionary with transformed keys/values, or None if input is None
        or an error occurs during transformation.
    """
    if filter_model is None:
        return None

    # Mapping for operator values from snake_case to camelCase
    operator_map = {
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

    try:
        # Check if it's a group (has 'logic_operator')
        # Note: Using .get() for runtime safety, although TypedDict defines keys
        if "logic_operator" in filter_model:
            transformed_filters: list[dict[str, Any]] = []

            for f in filter_model.get("filters", []):
                # Recursively transform nested filters
                transformed_filter = transform_advanced_filter_model_to_camel_case(f)

                if transformed_filter is None:
                    # Propagate failure if a sub-transformation fails
                    return None

                transformed_filters.append(transformed_filter)

            return {
                "logicOperator": filter_model.get("logic_operator", "and"),
                "filters": transformed_filters,
            }
        # Check if it's a clause (has 'operator')
        elif "operator" in filter_model:
            original_operator = filter_model.get("operator")

            # Map the operator value to camelCase
            camel_case_operator = operator_map.get(original_operator)

            if camel_case_operator is None:
                # This indicates an invalid operator value not covered by the Literal type
                # or the map, treat as an error.
                raise ValueError(
                    f"Unknown or unmapped operator value: {original_operator}"
                )

            return {
                "operator": camel_case_operator,
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
