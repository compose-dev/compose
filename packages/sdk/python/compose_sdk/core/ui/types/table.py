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
from .button_appearance import BUTTON_APPEARANCE

TableValue = Any
TableDataRow = Dict[str, TableValue]
TableData = List[TableDataRow]


TABLE_COLUMN_SORT_DIRECTION = Literal["asc", "desc"]


class TableColumnSort(TypedDict):
    key: str
    direction: TABLE_COLUMN_SORT_DIRECTION


class TablePageChangeArgs(TypedDict):
    offset: int
    page_size: int
    search_query: Union[str, None]
    prev_search_query: Union[str, None]
    prev_total_records: Union[int, None]
    sort_by: List[TableColumnSort]


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

TABLE_COLUMN_OVERFLOW = Literal["clip", "ellipsis", "dynamic"]


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


TableColumn = Union[str, AdvancedTableColumn]
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


class TableSelectionReturn:
    FULL = "full"
    INDEX = "index"
    TYPE = Literal["full", "index"]


class TableSortOption:
    SINGLE = "single"
    MULTI = True
    DISABLED = False
    TYPE = Literal["single", True, False]


class TableDensity:
    COMPACT = "compact"
    STANDARD = "standard"
    COMFORTABLE = "comfortable"
    TYPE = Literal["compact", "standard", "comfortable"]
