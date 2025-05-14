from typing import Any, List, Union, Literal

from ..ui import TYPE, ComponentReturn, TableDefault, TablePagination, Stale, Table
from ..table_state import TableState
from .find_component import FindComponent  # type: ignore[attr-defined]

FALLBACK_VIEW: Table.PaginationView = {
    "search_query": None,
    "sort_by": [],
    "filter_by": None,
    "view_by": None,
}


def get_sort_by(
    sortable: Table.SortOption.TYPE,
    default_view: Table.ViewInternal,
) -> List[Table.ColumnSort]:
    if sortable == Table.SortOption.DISABLED:
        return []

    default_view_sort_by = default_view.get("sortBy", [])

    if sortable == Table.SortOption.SINGLE:
        if len(default_view_sort_by) > 1:
            return default_view_sort_by[0:1]
        else:
            return default_view_sort_by
    else:
        return default_view_sort_by


def get_default_view(
    views: Union[List[Table.ViewInternal], None],
    filterable: bool,
    searchable: bool,
    sortable: Table.SortOption.TYPE,
) -> Table.PaginationView:
    try:
        if views is None or len(views) == 0:
            return {**FALLBACK_VIEW}

        default_view: Union[Table.ViewInternal, None] = None

        for view in views:
            if view.get("isDefault", False) == True:
                default_view = view
                break

        if default_view is None:
            return {**FALLBACK_VIEW}

        filter_by = (
            default_view.get("filterBy", None) if filterable is not False else None
        )
        search_query = (
            default_view.get("searchQuery", None) if searchable is not False else None
        )

        return {
            "filter_by": filter_by,
            "search_query": search_query,
            "sort_by": get_sort_by(sortable, default_view),
            "view_by": default_view.get("key", None),
        }

    except Exception:
        return {**FALLBACK_VIEW}


def configure_table_pagination(
    layout: ComponentReturn, render_id: str, table_state: TableState
) -> ComponentReturn:
    def count_condition(component: ComponentReturn) -> bool:
        return (
            component["type"] == TYPE.INPUT_TABLE
            and component["hooks"]["onPageChange"] is not None
        )

    count = FindComponent.count_by_condition(layout, count_condition)

    if count == 0:
        table_state.delete_for_render_id(render_id)
        return layout

    def edit_condition(
        component: ComponentReturn,
    ) -> Union[ComponentReturn, Literal[False]]:
        if component["type"] != TYPE.INPUT_TABLE:
            return False

        current_state = table_state.get(render_id, component["model"]["id"])

        if component["hooks"]["onPageChange"] == None:
            if current_state:
                table_state.delete(render_id, component["model"]["id"])
            return False

        searchable = (
            False
            if component["model"]["properties"].get("notSearchable", None) == True
            else True
        )

        default_view = get_default_view(
            component["model"]["properties"].get("views", None),
            component["model"]["properties"].get("filterable", True),
            searchable,
            component["model"]["properties"].get("sortable", Table.SortOption.MULTI),
        )

        offset = current_state["offset"] if current_state else TableDefault.OFFSET
        page_size = (
            current_state["page_size"]
            if current_state
            else component["model"]["properties"].get(
                "pageSize", TableDefault.PAGE_SIZE
            )
        )

        if component["hooks"]["onPageChange"]["type"] == TablePagination.MANUAL:
            if current_state:
                data: List[Any] = current_state["data"]
                total_records = (
                    current_state["total_records"]
                    if current_state["total_records"] is not None
                    else len(current_state["data"])
                )

                table_state.update(
                    render_id,
                    component["model"]["id"],
                    {
                        "stale": Stale.UPDATE_NOT_DISABLED,
                        "initial_view": default_view,
                    },
                )
            else:
                data = []
                total_records = len(data)

                table_state.add(
                    render_id,
                    component["model"]["id"],
                    {
                        "data": data,
                        "offset": offset,
                        "page_size": page_size,
                        "total_records": None,
                        "stale": "INITIALLY_STALE",
                        "initial_view": default_view,
                    },
                )
        else:
            all_rows = component["hooks"]["onPageChange"]["fn"]()
            data = all_rows[offset : offset + page_size]
            total_records = len(all_rows)

            if not current_state:
                table_state.add(
                    render_id,
                    component["model"]["id"],
                    {
                        "data": data,
                        "offset": offset,
                        "page_size": page_size,
                        "total_records": total_records,
                        "stale": False,
                        "initial_view": default_view,
                    },
                )
            else:
                table_state.update(
                    render_id,
                    component["model"]["id"],
                    {"initial_view": default_view},
                )

        # Set these at the end to ensure they are working with the most recent
        # active view. In some cases, the active view will be overriden when
        # the initial view is updated above!
        search_query = (
            current_state["active_view"]["search_query"]
            if current_state
            else default_view["search_query"]
        )
        filter_by = (
            current_state["active_view"]["filter_by"]
            if current_state
            else default_view["filter_by"]
        )
        sort_by = (
            current_state["active_view"]["sort_by"]
            if current_state
            else default_view["sort_by"]
        )
        view_by = (
            current_state["active_view"]["view_by"]
            if current_state
            else default_view["view_by"]
        )

        return {
            **component,
            "model": {
                **component["model"],
                "properties": {
                    **component["model"]["properties"],
                    "data": data,
                    "totalRecords": total_records,
                    "offset": offset,
                    "searchQuery": search_query,
                    "filterBy": filter_by,
                    "sortBy": sort_by,
                    "viewBy": view_by,
                    "pageSize": page_size,
                },
            },
        }

    return FindComponent.edit_by_condition(layout, edit_condition)  # type: ignore[no-any-return]
