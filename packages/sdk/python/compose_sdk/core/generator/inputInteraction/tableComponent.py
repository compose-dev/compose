# type: ignore

import pandas
from typing import Union, Callable, List

from ...ui import (
    INTERACTION_TYPE,
    TYPE,
    TableColumns,
    Nullable,
    ComponentReturn,
    TableData,
    ValidatorResponse,
    VoidResponse,
    TableActions,
    TableOnPageChange,
    TableDefault,
    TablePagination,
    TableSelectionReturn,
    ComponentStyle,
    TableSortOption,
    TableColumnSort,
    TABLE_COLUMN_OVERFLOW,
)
from ..base import MULTI_SELECTION_MIN_DEFAULT, MULTI_SELECTION_MAX_DEFAULT


def get_model_actions(
    actions: Nullable.TableActions,
) -> Nullable.TableActionsWithoutOnClick:
    if actions is None:
        return None

    return [
        {key: value for key, value in action.items() if key != "on_click"}
        for action in actions
    ]


def get_hook_actions(actions: Nullable.TableActions) -> Nullable.TableActionsOnClick:
    if actions is None:
        return None

    return [action["on_click"] for action in actions]


def camel_case_columns(columns: TableColumns) -> TableColumns:
    return [
        (
            column
            if isinstance(column, str) or "tag_colors" not in column
            else {**column, "tagColors": column.get("tag_colors")}
        )
        for column in columns
    ]


def _table(
    id: str,
    data: Union[TableData, TableOnPageChange],
    *,
    label: Union[str, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_selected_rows: List[int] = [],
    validate: Nullable.Callable = None,
    on_change: Nullable.Callable = None,
    columns: Union[TableColumns, None] = None,
    actions: Union[TableActions, None] = None,
    style: Union[ComponentStyle, None] = None,
    min_selections: int = MULTI_SELECTION_MIN_DEFAULT,
    max_selections: int = MULTI_SELECTION_MAX_DEFAULT,
    allow_select: bool = True,
    selection_return_type: TableSelectionReturn.TYPE = TableSelectionReturn.FULL,
    searchable: bool = True,
    paginate: bool = False,
    overflow: Union[TABLE_COLUMN_OVERFLOW, None] = None,
    sort_by: Union[List[TableColumnSort], None] = None,
    sortable: Union[TableSortOption, None] = None,
) -> ComponentReturn:

    if not isinstance(initial_selected_rows, list):
        raise TypeError(
            f"initial_selected_rows must be a list for table component, got {type(initial_selected_rows).__name__}"
        )

    if not all(isinstance(row, int) for row in initial_selected_rows):
        raise ValueError(
            "initial_selected_rows must be a list of table row indices, got "
            f"{type(initial_selected_rows).__name__}"
        )

    if not isinstance(data, list) and not isinstance(data, Callable):
        raise ValueError(
            f"data must be a list for table component or a function for table with pagination, got {type(data).__name__}"
        )

    manually_paged = isinstance(data, Callable)
    auto_paged = not manually_paged and (
        len(data) > TableDefault.PAGINATION_THRESHOLD or paginate is True
    )

    # Perform a shallow copy of the data to make it less likely to be mutated
    # by the user, and thus more likely that any page.update() calls will
    # succeed.
    shallow_copy = [] if manually_paged else list(data)

    model_properties = {
        "initialSelectedRows": initial_selected_rows,
        "hasOnSelectHook": on_change is not None,
        "data": shallow_copy,
        "columns": columns if columns is None else camel_case_columns(columns),
        "actions": get_model_actions(actions),
        "minSelections": min_selections,
        "maxSelections": max_selections,
        "allowSelect": allow_select,
        "v": 3,
    }

    if auto_paged or not searchable:
        model_properties["notSearchable"] = True

    if manually_paged or auto_paged:
        model_properties["paged"] = True

    if selection_return_type != TableSelectionReturn.FULL:
        model_properties["selectMode"] = selection_return_type

    # Paged tables only support row selection by index.
    if (
        manually_paged or auto_paged
    ) and selection_return_type != TableSelectionReturn.INDEX:
        model_properties["allowSelect"] = False

    on_page_change_hook = (
        {
            "fn": data,
            "type": TablePagination.MANUAL,
        }
        if manually_paged
        else (
            {
                "fn": lambda: shallow_copy,
                "type": TablePagination.AUTO,
            }
            if auto_paged
            else None
        )
    )

    if overflow is not None and overflow != "ellipsis":
        model_properties["overflow"] = overflow

    if sort_by is not None:
        model_properties["sortBy"] = sort_by

    if sortable is not None:
        model_properties["sortable"] = sortable

    return {
        "model": {
            "id": id,
            "label": label,
            "description": description,
            "required": required,
            "hasValidateHook": validate is not None,
            "style": style,
            "properties": model_properties,
        },
        "hooks": {
            "validate": validate,
            "onSelect": on_change,
            "onRowActions": get_hook_actions(actions),
            "onPageChange": on_page_change_hook,
        },
        "type": TYPE.INPUT_TABLE,
        "interactionType": INTERACTION_TYPE.INPUT,
    }


def table(
    id: str,
    data: Union[TableData, TableOnPageChange],
    *,
    allow_select: bool = True,
    columns: Union[TableColumns, None] = None,
    actions: Union[TableActions, None] = None,
    label: Union[str, None] = None,
    overflow: Union[TABLE_COLUMN_OVERFLOW, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_selected_rows: List[int] = [],
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[TableData], ValidatorResponse],
    ] = None,
    on_change: Union[
        Callable[[], VoidResponse],
        Callable[[TableData], VoidResponse],
    ] = None,
    style: Union[ComponentStyle, None] = None,
    min_selections: int = MULTI_SELECTION_MIN_DEFAULT,
    max_selections: int = MULTI_SELECTION_MAX_DEFAULT,
    selection_return_type: TableSelectionReturn.TYPE = TableSelectionReturn.FULL,
    searchable: bool = True,
    paginate: bool = False,
    sort_by: Union[List[TableColumnSort], None] = None,
    sortable: Union[TableSortOption.TYPE, None] = None,
) -> ComponentReturn:
    """A powerful and highly customizable table component. For example:

    >>> data = [
    ...     {"name": "John", "age": 30, "confirmed": True, "id": 1},
    ...     {"name": "Jane", "age": 25, "confirmed": False, "id": 2},
    ... ]
    ...
    ... page.add(lambda: ui.table(
    ...     "users-table",
    ...     data,
    ...     columns=[
    ...         "name",
    ...         "age",
    ...         {"key": "confirmed", "format": "boolean"},
    ...     ],
    ...     actions=[
    ...         {"label": "Edit", "on_click": lambda row, idx: print(f"Editing row: {row} at index {idx}")},
    ...         {"label": "Delete", "on_click": lambda row: print(f"Deleting row: {row}")},
    ...     ]
    ... ))

    ## Documentation
    https://docs.composehq.com/components/input/table


    ## Parameters
    #### id : `str`
        Unique identifier for the table.

    #### data : `List[Dict[str, Any]]`
        Data to be displayed in the table. Should be a list of dictionaries, where each dictionary represents a row in the table.

    #### allow_select : `bool`. Optional.
        Whether to render a selectable checkbox column for each row. Defaults to `True`.

    #### columns : `List[TableColumns]`. Optional.
        Manually specify the columns to be displayed in the table. Each item in the list should be either a string that maps to a key in the data, or a dictionary with at least a `key` field and other optional fields. Learn more in the [docs](https://docs.composehq.com/components/input/table#columns).

    #### actions : `List[TableActions]`. Optional.
        Actions that can be performed on table rows. Each action should be a dictionary with at least a `label` field and an `on_click` handler. Learn more in the [docs](https://docs.composehq.com/components/input/table#row-actions).

    #### label : `str`. Optional.
        Label text to display above the table.

    #### overflow : `ellipsis` | `clip` | `dynamic`. Optional.
        The overflow behavior of table cells. Options:

        - `ellipsis`: Show ellipsis when the text overflows.
        - `clip`: Clip the text.
        - `dynamic`: Expand the cell height to fit the content.

        Defaults to `ellipsis`.

    #### required : `bool`. Optional.
        Whether the table requires at least one row selection. Defaults to `True`.

    #### description : `str`. Optional.
        Description text to display below the table label.

    #### initial_selected_rows : `List[int]`. Optional.
        List of row indices to be selected when the table first renders. Defaults to empty list.

    #### validate : `Callable[[], str | None]` | `Callable[[TableData], str | None]`. Optional.
        Custom validation function that is called on selected rows. Return `None` if valid, or a string error message if invalid.

    #### on_change : `Callable[[], None]` | `Callable[[TableData], None]`. Optional.
        Function to be called when row selection changes.

    #### style : `dict`. Optional.
        CSS styles object to directly style the table HTML element.

    #### min_selections : `int`. Optional.
        Minimum number of rows that must be selected. Defaults to 0.

    #### max_selections : `int`. Optional.
        Maximum number of rows that can be selected. Defaults to unlimited.

    #### selection_return_type : `full` | `index`. Optional.
        Whether to return a list of rows, or a list of row indices to callbacks like `on_change` and `on_submit`. Defaults to `full`. Must be `index` if the table is paginated.

    #### searchable : `bool`. Optional.
        Whether to enable the table search bar. Defaults to `True`, except for auto-paginated tables, which do not support client-side search. You should manually handle pagination to enable search for paginated tables.

    #### paginate : `bool`. Optional.
        Whether to paginate the table. Defaults to `False`. Tables with more than 2500 rows will be paginated by default.

    #### sort_by : `List[TableColumnSort]`. Optional.
        An ordered list of columns to initially sort by. For example:

        >>> sort_by = [
        ...     {"key": "name", "direction": "asc"},
        ...     {"key": "age", "direction": "desc"},
        ... ]

        Each item in the list should have the following fields:

        - `key`: The key of the column to sort by.
        - `direction`: The direction to sort by. Either `asc` or `desc`.

        Defaults to `[]`.

    #### sortable : `single` | `multi` | `False`. Optional.
        Whether the table should allow multi-column, single-column, or no sorting. Options:

        - `True`: Allow multi-column sorting.
        - `"single"`: Allow single-column sorting.
        - `False`: Disable sorting.

        Defaults to `True` for normal tables, `False` for paginated tables.

    ## Returns
    The configured table component.
    """
    return _table(
        id,
        data,
        label=label,
        required=required,
        description=description,
        initial_selected_rows=initial_selected_rows,
        validate=validate,
        on_change=on_change,
        style=style,
        columns=columns,
        actions=actions,
        min_selections=min_selections,
        max_selections=max_selections,
        allow_select=allow_select,
        selection_return_type=selection_return_type,
        searchable=searchable,
        paginate=paginate,
        overflow=overflow,
        sort_by=sort_by,
        sortable=sortable,
    )


def dataframe(
    id: str,
    df: pandas.DataFrame,
    *,
    label: Union[str, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_selected_rows: List[int] = [],
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[TableData], ValidatorResponse],
    ] = None,
    on_change: Union[
        Callable[[], VoidResponse],
        Callable[[TableData], VoidResponse],
    ] = None,
    actions: Nullable.TableActions = None,
    style: Union[ComponentStyle, None] = None,
    min_selections: int = MULTI_SELECTION_MIN_DEFAULT,
    max_selections: int = MULTI_SELECTION_MAX_DEFAULT,
    allow_select: bool = True,
    selection_return_type: TableSelectionReturn.TYPE = TableSelectionReturn.FULL,
    searchable: bool = True,
    paginate: bool = False,
    overflow: Union[TABLE_COLUMN_OVERFLOW, None] = None,
    sort_by: Union[List[TableColumnSort], None] = None,
    sortable: Union[TableSortOption.TYPE, None] = None,
) -> ComponentReturn:

    # Replace empty values in the dataframe with None
    df = df.replace({None: "", pandas.NA: "", float("nan"): ""})

    # Create the "columns" array
    columns: TableColumns = [{"key": col, "label": col} for col in df.columns]

    # Create the "table" array
    table: TableData = df.to_dict(orient="records")  # type: ignore

    return _table(
        id,
        table,
        label=label,
        required=required,
        description=description,
        initial_selected_rows=initial_selected_rows,
        validate=validate,
        on_change=on_change,
        style=style,
        columns=columns,
        actions=actions,
        min_selections=min_selections,
        max_selections=max_selections,
        allow_select=allow_select,
        selection_return_type=selection_return_type,
        searchable=searchable,
        paginate=paginate,
        overflow=overflow,
        sort_by=sort_by,
        sortable=sortable,
    )
