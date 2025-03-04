from typing import Any, List, Union, Literal

from ..ui import (
    TYPE,
    ComponentReturn,
    TableDefault,
    TablePagination,
    Stale,
)
from ..table_state import TableState
from .find_component import FindComponent  # type: ignore[attr-defined]


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

        offset = current_state["offset"] if current_state else TableDefault.OFFSET
        page_size = (
            current_state["page_size"]
            if current_state
            else component["model"]["properties"].get(
                "pageSize", TableDefault.PAGE_SIZE
            )
        )
        search_query = (
            current_state["search_query"]
            if current_state
            else TableDefault.SEARCH_QUERY
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
                    {"stale": Stale.UPDATE_NOT_DISABLED},
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
                        "search_query": search_query,
                        "total_records": None,
                        "stale": "INITIALLY_STALE",
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
                        "search_query": search_query,
                        "total_records": total_records,
                        "stale": False,
                    },
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
                    "pageSize": page_size,
                },
            },
        }

    return FindComponent.edit_by_condition(layout, edit_condition)  # type: ignore[no-any-return]
