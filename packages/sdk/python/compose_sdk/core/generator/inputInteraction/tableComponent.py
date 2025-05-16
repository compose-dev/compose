# type: ignore

import pandas
import warnings
from typing import Union, Callable, List, Sequence, Any

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
    TableDefault,
    TablePagination,
    ComponentStyle,
    TABLE_COLUMN_OVERFLOW,
    Table,
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


def camel_case_and_add_key_to_views(
    views: List[Table.View],
) -> List[Table.ViewInternal]:
    return_views: List[Table.ViewInternal] = []

    for idx, view in enumerate(views):
        return_view: Table.ViewInternal = {}

        if "label" in view:
            return_view["label"] = view["label"]
            return_view["key"] = f"{idx}_{view['label']}"

        if "description" in view:
            return_view["description"] = view["description"]

        if "is_default" in view:
            return_view["isDefault"] = view["is_default"]

        if "filter_by" in view:
            # The transform_advanced_filter_model_to_camel_case method
            # on Table handles cases where view["filter_by"] is None.
            return_view["filterBy"] = (
                Table().transform_advanced_filter_model_to_camel_case(view["filter_by"])
            )

        if "search_query" in view:
            return_view["searchQuery"] = view["search_query"]

        if "sort_by" in view:
            return_view["sortBy"] = view["sort_by"]

        if "density" in view:
            return_view["density"] = view["density"]

        if "overflow" in view:
            return_view["overflow"] = view["overflow"]

        if "columns" in view:
            return_view["columns"] = view["columns"]

        return_views.append(return_view)

    return return_views


def get_searchable(
    searchable: Union[bool, None], manually_paged: bool, auto_paged: bool
) -> bool:
    # If auto-paginated, then it is never searchable.
    if auto_paged:
        return False

    # If manually paged, then it is searchable only if explicitly set to true.
    if manually_paged:
        if searchable is True:
            return True

        return False

    # If not paged and explicitly set, then use the explicitly set value.
    if searchable is not None:
        return searchable

    # Otherwise, if not paged, the table is default searchable.
    return True


def get_sortable(
    sortable: Union[Table.SortOption.TYPE, None], manually_paged: bool, auto_paged: bool
) -> Table.SortOption.TYPE:
    # If auto-paginated, then it is never sortable.
    if auto_paged:
        return Table.SortOption.DISABLED

    # If manually paged, then it is sortable only if explicitly set.
    if manually_paged:
        if sortable is None:
            return Table.SortOption.DISABLED

        return sortable

    # If not paged and explicitly set, then use the explicitly set value.
    if sortable is not None:
        return sortable

    # Otherwise, if not paged, the table is default multi-column sortable.
    return Table.SortOption.MULTI


def get_filterable(
    filterable: Union[bool, None], manually_paged: bool, auto_paged: bool
) -> bool:
    # If auto-paginated, then it is never filterable.
    if auto_paged:
        return False

    # If manually paged, then it is filterable only if explicitly set.
    if manually_paged:
        if filterable is True:
            return True

        return False

    # In the normal case, the table is filterable unless explicitly set to false.
    if filterable is False:
        return False

    return True


def get_selectable(
    selectable: Union[bool, None],
    allow_select: Union[bool, None],
    on_change: Union[Callable[..., Any], None],
    paginated: bool,
    selection_return_type: Union[Table.SelectionReturn.TYPE, None],
    table_id: str,
) -> bool:
    is_explicitly_true = selectable is True or allow_select is True
    is_explicitly_false = selectable is False or allow_select is False

    # If there is an on_change hook, default to `true`, unless explicitly set to
    # `false`. Else, default to `false` unless explicitly set to `true`.
    is_selectable = (
        is_explicitly_true
        if on_change is None
        else False if is_explicitly_false else True
    )

    # If paginated, add a secondary check to ensure that they have the correct
    # selection mode.
    if paginated:
        if (
            selection_return_type != Table.SelectionReturn.INDEX
            and selection_return_type != Table.SelectionReturn.ID
        ):
            # If it's selectable, we assume the user wants row selection and
            # warn them on how to enable it.
            if is_selectable:
                warnings.warn(
                    f"Paginated tables only support row selection by id. Set a `primary_key` and specify `selection_return_type: 'id'` to enable row selection for table with id: {table_id}."
                )

            return False

    return is_selectable


def warn_about_select_mode(
    primary_key: Union[Table.DataKey, None],
    select_mode: Union[Table.SelectionReturn.TYPE, None],
    table_id: str,
) -> None:
    if primary_key is None and select_mode == Table.SelectionReturn.ID:
        warnings.warn(
            f"Selection return type is set to `id` but no `primary_key` is set for table with id: {table_id}. "
        )

    if select_mode == Table.SelectionReturn.INDEX:
        if primary_key is not None:
            warnings.warn(
                f"The `primary_key` property does nothing when the selection return type is `index` for table with id: {table_id}. Set `selection_return_type: 'id'` instead (index is deprecated and may be removed in a future version)."
            )
        else:
            warnings.warn(
                f"Selection return type of `index` is deprecated for table with id: {table_id}. Set `selection_return_type: 'id'` and specify a `primary_key` to use instead. While index selection is supported for now, it may be removed in a future version. Additionally, ID selection enables proper row selection tracking!"
            )


def _table(
    id: str,
    data: Union[TableData, Table.OnPageChangeSync, Table.OnPageChangeAsync],
    *,
    label: Union[str, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_selected_rows: List[int] = [],
    validate: Union[Callable[..., Any], None] = None,
    on_change: Union[Callable[..., Any], None] = None,
    columns: Union[TableColumns, None] = None,
    actions: Union[TableActions, None] = None,
    style: Union[ComponentStyle, None] = None,
    min_selections: int = MULTI_SELECTION_MIN_DEFAULT,
    max_selections: int = MULTI_SELECTION_MAX_DEFAULT,
    selection_return_type: Union[
        Table.SelectionReturn.TYPE, None
    ] = Table.SelectionReturn.FULL,
    searchable: bool = True,
    paginate: bool = False,
    overflow: Union[TABLE_COLUMN_OVERFLOW, None] = None,
    sortable: Union[Table.SortOption.TYPE, None] = None,
    selectable: Union[bool, None] = None,
    density: Union[Table.Density.TYPE, None] = None,
    allow_select: Union[bool, None] = None,
    filterable: Union[bool, None] = None,
    views: Union[List[Table.View], None] = None,
    primary_key: Union[Table.DataKey, None] = None,
) -> ComponentReturn:

    if not isinstance(initial_selected_rows, list):
        raise TypeError(
            f"initial_selected_rows must be a list for table component, got {type(initial_selected_rows).__name__}"
        )

    if not all(
        isinstance(row, int) or isinstance(row, str) for row in initial_selected_rows
    ):
        raise ValueError(
            "initial_selected_rows must be a list of table row ids (int or str), got "
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

    model_properties = {
        "initialSelectedRows": initial_selected_rows,
        "hasOnSelectHook": on_change is not None,
        "data": [] if manually_paged else data,
        "columns": columns if columns is None else camel_case_columns(columns),
        "actions": get_model_actions(actions),
        "minSelections": min_selections,
        "maxSelections": max_selections,
        "allowSelect": get_selectable(
            selectable,
            allow_select,
            on_change,
            manually_paged or auto_paged,
            selection_return_type,
            id,
        ),
        "v": 3,
    }

    # Only set `notSearchable` if the table is not searchable.
    if get_searchable(searchable, manually_paged, auto_paged) is False:
        model_properties["notSearchable"] = True

    # Only set `sortable` if the table is not multi-column sortable.
    sortable = get_sortable(sortable, manually_paged, auto_paged)
    if sortable != Table.SortOption.MULTI:
        model_properties["sortable"] = sortable

    if primary_key is not None:
        model_properties["primaryKey"] = primary_key

    filterable = get_filterable(filterable, manually_paged, auto_paged)
    if filterable is False:
        model_properties["filterable"] = False

    if manually_paged or auto_paged:
        model_properties["paged"] = True

    if selection_return_type != Table.SelectionReturn.FULL:
        model_properties["selectMode"] = selection_return_type

    on_page_change_hook = (
        {
            "fn": data,
            "type": TablePagination.MANUAL,
        }
        if manually_paged
        else (
            {
                "fn": lambda: data,
                "type": TablePagination.AUTO,
            }
            if auto_paged
            else None
        )
    )

    if overflow is not None and overflow != "ellipsis":
        model_properties["overflow"] = overflow

    if density is not None:
        model_properties["density"] = density

    if views is not None:
        if not isinstance(views, list):
            raise ValueError(
                f"views parameter must be a list of view objects for table component, got {type(views).__name__}"
            )
        elif len(views) > 0:
            model_properties["views"] = camel_case_and_add_key_to_views(views)

    warn_about_select_mode(primary_key, selection_return_type, id)

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
    data: Union[TableData, Table.OnPageChangeSync, Table.OnPageChangeAsync],
    *,
    columns: Union[TableColumns, None] = None,
    actions: Union[TableActions, None] = None,
    label: Union[str, None] = None,
    overflow: Union[TABLE_COLUMN_OVERFLOW, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_selected_rows: Sequence[Union[int, str]] = [],
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[Table.DataOutput], ValidatorResponse],
        None,
    ] = None,
    on_change: Union[
        Callable[[], VoidResponse], Callable[[Table.DataOutput], VoidResponse], None
    ] = None,
    style: Union[ComponentStyle, None] = None,
    min_selections: int = MULTI_SELECTION_MIN_DEFAULT,
    max_selections: int = MULTI_SELECTION_MAX_DEFAULT,
    selection_return_type: Table.SelectionReturn.TYPE = Table.SelectionReturn.FULL,
    searchable: bool = True,
    paginate: bool = False,
    sortable: Union[Table.SortOption.TYPE, None] = None,
    selectable: Union[bool, None] = None,
    density: Union[Table.Density.TYPE, None] = None,
    allow_select: Union[bool, None] = None,
    filterable: Union[bool, None] = None,
    views: Union[Sequence[Table.View], None] = None,
    primary_key: Union[Table.DataKey, None] = None,
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

    #### initial_selected_rows : `List[str | int | float]`. Optional.
        List of row ids to be selected when the table first renders. Defaults to empty list.

    #### validate : `Callable[[], str | None]` | `Callable[[TableData], str | None]`. Optional.
        Custom validation function that is called on selected rows. Return `None` if valid, or a string error message if invalid.

    #### on_change : `Callable[[], None]` | `Callable[[TableData], None]`. Optional.
        Function to be called when row selection changes. Will return a list of rows, or a list of row ids if the `selection_return_type` parameter is `id`.

    #### style : `dict`. Optional.
        CSS styles object to directly style the table HTML element.

    #### min_selections : `int`. Optional.
        Minimum number of rows that must be selected. Defaults to 0.

    #### max_selections : `int`. Optional.
        Maximum number of rows that can be selected. Defaults to unlimited.

    #### selection_return_type : `full` | `id`. Optional.
        Whether to return a list of rows, or a list of row ids to callbacks like `on_change` and `on_submit`. Defaults to `full`. Must be `id` if the table is paginated.

    #### searchable : `bool`. Optional.
        Whether to enable the table search bar. Defaults to `True` for normal tables, `False` for paginated tables.

    #### paginate : `bool`. Optional.
        Whether to paginate the table. Defaults to `False`. Tables with more than 2500 rows will be paginated by default.

    #### sortable : `single` | `multi` | `False`. Optional.
        Whether the table should allow multi-column, single-column, or no sorting. Options:

        - `True`: Allow multi-column sorting.
        - `"single"`: Allow single-column sorting.
        - `False`: Disable sorting.

        Defaults to `True` for normal tables, `False` for paginated tables.

    #### filterable : `bool`. Optional.
        Whether to allow filtering. Defaults to `True` for normal tables, `False` for paginated tables.

    #### selectable : `bool`. Optional.
        Whether to allow row selection. Defaults to `False`, or `True` if `on_change` is provided.

    #### primary_key : `str | int | float`. Optional.
        The primary key of the table. This should map to a unique, stable identifier field in the table data. Setting this property enables proper row selection tracking. If not set, the row index will be used.

    #### density : `compact` | `standard` | `comfortable`. Optional.
        The density of the table rows. Options:

        - `compact`: 32px row height
        - `standard`: 40px row height
        - `comfortable`: 48px row height

        Defaults to `standard`.

    #### views : `List[Table.View]`. Optional.
        A list of preset views that can be used to filter, sort, and search the table. Each view is a dictionary with at least a `label` field and other optional fields. Learn more in the [docs](https://docs.composehq.com/components/input/table#views).

    ## Returns
    The configured table component.
    """
    if allow_select is not None:
        warnings.warn(
            "allow_select is deprecated. Use selectable instead.",
            DeprecationWarning,
        )

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
        selectable=selectable,
        selection_return_type=selection_return_type,
        searchable=searchable,
        paginate=paginate,
        overflow=overflow,
        sortable=sortable,
        density=density,
        filterable=filterable,
        views=views,
        primary_key=primary_key,
    )


def dataframe(
    id: str,
    df: pandas.DataFrame,
    *,
    label: Union[str, None] = None,
    required: bool = True,
    description: Union[str, None] = None,
    initial_selected_rows: Sequence[Union[int, str]] = [],
    validate: Union[
        Callable[[], ValidatorResponse],
        Callable[[Table.DataOutput], ValidatorResponse],
        None,
    ] = None,
    on_change: Union[
        Callable[[], VoidResponse],
        Callable[[Table.DataOutput], VoidResponse],
        None,
    ] = None,
    actions: Nullable.TableActions = None,
    style: Union[ComponentStyle, None] = None,
    min_selections: int = MULTI_SELECTION_MIN_DEFAULT,
    max_selections: int = MULTI_SELECTION_MAX_DEFAULT,
    selection_return_type: Table.SelectionReturn.TYPE = Table.SelectionReturn.FULL,
    searchable: bool = True,
    paginate: bool = False,
    overflow: Union[TABLE_COLUMN_OVERFLOW, None] = None,
    sortable: Union[Table.SortOption.TYPE, None] = None,
    selectable: Union[bool, None] = None,
    density: Union[Table.Density.TYPE, None] = None,
    filterable: Union[bool, None] = None,
    allow_select: Union[bool, None] = None,
    views: Union[Sequence[Table.View], None] = None,
    primary_key: Union[Table.DataKey, None] = None,
) -> ComponentReturn:
    if allow_select is not None:
        warnings.warn(
            "allow_select is deprecated. Use selectable instead.",
            DeprecationWarning,
        )

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
        selectable=selectable,
        selection_return_type=selection_return_type,
        searchable=searchable,
        paginate=paginate,
        overflow=overflow,
        sortable=sortable,
        density=density,
        filterable=filterable,
        views=views,
        primary_key=primary_key,
    )
