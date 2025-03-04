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
from .validator_response import VoidResponse

TableValue = Any
TableDataRow = Dict[str, TableValue]
TableData = List[TableDataRow]


class TablePageChangeArgs(TypedDict):
    offset: int
    page_size: int
    search_query: Union[str, None]
    prev_search_query: Union[str, None]
    prev_total_records: Union[int, None]


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
]

TableTagColors = Dict[
    Union[TAG_COLORS, Literal["_default"]],
    Union[
        TagValue,
        List[TagValue],
        TAG_COLORS,
    ],
]


class AdvancedTableColumn(TypedDict):
    key: str
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


TableColumn = Union[str, AdvancedTableColumn]
TableColumns = List[TableColumn]


class TableActionWithoutOnClick(TypedDict):
    label: str
    surface: NotRequired[bool]


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
    PAGINATION_THRESHOLD = 5000
    PAGE_SIZE = 100
    OFFSET = 0
    SEARCH_QUERY = None
    PAGINATED = False


class TablePagination:
    MANUAL = "manual"
    AUTO = "auto"
    TYPE = Literal["manual", "auto"]


class TableSelectionReturn:
    FULL = "full"
    INDEX = "index"
    TYPE = Literal["full", "index"]
