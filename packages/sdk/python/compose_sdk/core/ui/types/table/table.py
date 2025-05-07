from __future__ import annotations
from typing import (
    Callable,
    Dict,
    Literal,
    Union,
    TypedDict,
    Any,
    List,
    Awaitable,
)
from typing_extensions import NotRequired
from ..validator_response import VoidResponse
from ..button_appearance import BUTTON_APPEARANCE
from .advanced_filtering import (
    TableAdvancedFilterModel,
    transform_advanced_filter_model_to_camel_case,
)

TableDataKey = Union[str, int, float]
TableValue = Any
TableDataRow = Dict[TableDataKey, TableValue]
TableData = List[TableDataRow]


TABLE_COLUMN_SORT_DIRECTION = Literal["asc", "desc"]


class TableColumnSort(TypedDict):
    key: TableDataKey
    direction: TABLE_COLUMN_SORT_DIRECTION


class TablePageChangeArgs(TypedDict):
    offset: int
    page_size: int
    search_query: Union[str, None]
    prev_search_query: Union[str, None]
    prev_total_records: Union[int, None]
    sort_by: List[TableColumnSort]
    filter_by: TableAdvancedFilterModel


class TablePageChangeResponse(TypedDict):
    data: TableData
    total_records: int


TableOnPageChange = Callable[
    [TablePageChangeArgs],
    Union[TablePageChangeResponse, Awaitable[TablePageChangeResponse]],
]


TAG_COLORS = Literal[
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "pink",
    "gray",
    "brown",
]

TagValue = Union[str, bool, int, float]

TABLE_COLUMN_FORMAT = Literal[
    # Oct 14, 1983
    "date",
    # Oct 14, 1983, 10:14 AM
    "datetime",
    # 1,023,456
    "number",
    # $1,023,456.00
    "currency",
    # ✅ or ❌
    "boolean",
    # Colored pills
    "tag",
    # Stringify the value and render as is
    "string",
    # Render the value as formatted JSON
    "json",
]

TableTagColors = Dict[
    Union[TAG_COLORS, Literal["_default"]],
    Union[
        TagValue,
        List[TagValue],
        TAG_COLORS,
    ],
]

TABLE_COLUMN_OVERFLOW = Literal["clip", "ellipsis", "dynamic"]

PINNED_SIDE = Literal["left", "right"]


class AdvancedTableColumn(TypedDict):
    key: TableDataKey
    """
    A key that maps to a value in the table data.
    """
    label: NotRequired[str]
    """
    Custom label for the column. By default, will be inferred from the key.
    """
    format: NotRequired[TABLE_COLUMN_FORMAT]
    """
    Specify a format for the column.  By default, will be inferred from the table data.

    Learn more in the [docs](https://docs.composehq.com/components/input/table#columns)
    """
    width: NotRequired[str]
    """
    The width of the column. By default, will be inferred from the table data.
    """
    tag_colors: NotRequired[TableTagColors]
    """
    Specify how colors should map to values when `format` is `tag`.

    For example:
    ```python
    {
        "red": "todo",
        "orange": ["in_progress", "in_review"],
        "green": "done",
        "_default": "gray", # Render unspecified values as gray
    }
    ```

    See the [docs](https://docs.composehq.com/components/input/table#columns) for more details.
    """
    overflow: NotRequired[TABLE_COLUMN_OVERFLOW]
    """
    The overflow behavior of the column. In most cases, you should set the
    overflow behavior for all columns at once using the `overflow` property
    that's available directly on the table component. If you need to
    override the overflow behavior for a specific column, you can do so here.

    Options:

    - `clip`: Clip the text.
    - `ellipsis`: Show ellipsis when the text overflows.
    - `dynamic`: Expand the cell height to fit the content.

    See the [docs](https://docs.composehq.com/components/input/table#columns) for more details.
    """
    hidden: NotRequired[bool]
    """
    Whether the column is initially hidden. By default, the column is visible.
    """
    pinned: NotRequired[PINNED_SIDE]
    """
    Whether the column is pinned to the left or right of the table.
    """


TableColumn = Union[TableDataKey, AdvancedTableColumn]
TableColumns = List[TableColumn]


class TableActionWithoutOnClick(TypedDict):
    label: str
    """
    The label of the action.
    """
    surface: NotRequired[bool]
    """
    Whether to render the action as a button or inside a dropdown menu.
    """
    appearance: NotRequired[BUTTON_APPEARANCE]
    """
    The appearance of the action. Options:

    - `outline` (default)
    - `primary`
    - `warning`
    - `danger`
    """


TableActionOnClick = Union[
    Callable[[], VoidResponse],
    # Intentionally have a vague type for the table row so
    # that consumers don't have any type issues. Eventually
    # we should have a better type here that's responsive
    # to whatever is passed in
    Callable[[Dict[str, Any]], VoidResponse],
    Callable[[Dict[str, Any], int], VoidResponse],
]


class TableAction(TableActionWithoutOnClick):
    on_click: TableActionOnClick


TableActions = List[TableAction]
TableActionsWithoutOnClick = List[TableActionWithoutOnClick]
TableActionsOnClick = List[TableActionOnClick]


class TableDefault:
    PAGINATION_THRESHOLD = 2500
    PAGE_SIZE = 100
    OFFSET = 0
    SEARCH_QUERY = None
    PAGINATED = False


class TablePagination:
    MANUAL = "manual"
    AUTO = "auto"
    TYPE = Literal["manual", "auto"]


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
    value: TableValue
    key: TableDataKey


class TableAdvancedFilterGroup(TypedDict):
    logic_operator: Literal["and", "or"]
    filters: List[Union[TableAdvancedFilterClause, TableAdvancedFilterGroup]]


class Table:
    class SortOption:
        SINGLE = "single"
        MULTI = True
        DISABLED = False
        TYPE = Literal["single", True, False]

    class Density:
        COMPACT = "compact"
        STANDARD = "standard"
        COMFORTABLE = "comfortable"
        TYPE = Literal["compact", "standard", "comfortable"]

    class SelectionReturn:
        FULL = "full"
        ID = "id"
        INDEX = "index"  # deprecated
        TYPE = Literal["full", "id", "index"]

    AdvancedFilterModel = TableAdvancedFilterModel

    DataKey = TableDataKey

    @property
    def transform_advanced_filter_model_to_camel_case(self):
        return transform_advanced_filter_model_to_camel_case
