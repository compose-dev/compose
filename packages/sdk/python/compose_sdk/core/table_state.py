from typing import Dict, TypedDict, Any, Union, Tuple, List
from ..scheduler import Scheduler  # type: ignore[attr-defined]
from .ui import Stale, TableColumnSort, Table
from .smart_debounce import SmartDebounce
from .json import JSON
from .component_update_cache import ComponentUpdateCache


class TableStateRecordInput(TypedDict):
    data: List[Any]
    total_records: Union[int, None]
    offset: int
    page_size: int
    initial_view: Table.PaginationView
    stale: Stale.TYPE


class TableStateRecord(TableStateRecordInput):
    page_update_debouncer: SmartDebounce
    render_id: str
    table_id: str
    active_view: Table.PaginationView


PAGE_UPDATE_DEBOUNCE_INTERVAL_MS = 250
KEY_SEPARATOR = "__"


def search_query_did_change(
    old_search_query: Union[str, None], new_search_query: Union[str, None]
) -> bool:
    return old_search_query != new_search_query


def sort_by_did_change(
    old_sort_by: List[TableColumnSort],
    new_sort_by: List[TableColumnSort],
) -> bool:
    if len(old_sort_by) != len(new_sort_by):
        return True

    for old_sort, new_sort in zip(old_sort_by, new_sort_by):
        if (
            old_sort["key"] != new_sort["key"]
            or old_sort["direction"] != new_sort["direction"]
        ):
            return True

    return False


def filter_by_did_change(
    old_filter_by: Table.AdvancedFilterModel, new_filter_by: Table.AdvancedFilterModel
) -> bool:
    if old_filter_by is None and new_filter_by is None:
        return False

    if old_filter_by is None or new_filter_by is None:
        return True

    return JSON.stringify(old_filter_by) != JSON.stringify(new_filter_by)


def view_did_change(
    old_view: Table.PaginationView, new_view: Table.PaginationView
) -> bool:
    return (
        search_query_did_change(old_view["search_query"], new_view["search_query"])
        or sort_by_did_change(old_view["sort_by"], new_view["sort_by"])
        or filter_by_did_change(old_view["filter_by"], new_view["filter_by"])
    )


class TableState:
    def __init__(
        self, scheduler: Scheduler, component_update_cache: ComponentUpdateCache
    ):
        self.state: Dict[str, TableStateRecord] = {}
        self.scheduler = scheduler
        self.component_update_cache = component_update_cache

    def generate_key(self, render_id: str, table_id: str) -> str:
        return f"{render_id}{KEY_SEPARATOR}{table_id}"

    def _generate_cache_key(self, table_id: str) -> str:
        return f"{table_id}_%%__%%COMPOSE_INTERN#L_KEY_@#$%^&"

    def parse_key(self, key: str) -> Tuple[str, str]:
        split_index = key.index(KEY_SEPARATOR)
        render_id = key[:split_index]
        table_id = key[split_index + len(KEY_SEPARATOR) :]
        return render_id, table_id

    def has(self, render_id: str, table_id: str) -> bool:
        key = self.generate_key(render_id, table_id)
        return key in self.state

    def get(self, render_id: str, table_id: str) -> Union[TableStateRecord, None]:
        key = self.generate_key(render_id, table_id)
        return self.state.get(key)

    def get_by_render_id(self, render_id: str) -> List[TableStateRecord]:
        return [
            state for state in self.state.values() if state["render_id"] == render_id
        ]

    def add(self, render_id: str, table_id: str, state: TableStateRecordInput) -> None:
        key = self.generate_key(render_id, table_id)
        self.state[key] = {
            **state,
            "page_update_debouncer": SmartDebounce(
                self.scheduler, PAGE_UPDATE_DEBOUNCE_INTERVAL_MS
            ),
            "render_id": render_id,
            "table_id": table_id,
            "initial_view": state["initial_view"],
            "active_view": {**state["initial_view"]},
        }
        self.component_update_cache.set(
            render_id, self._generate_cache_key(table_id), JSON.stringify(state["data"])
        )

    def update(self, render_id: str, table_id: str, state: Dict[str, Any]) -> None:
        key = self.generate_key(render_id, table_id)

        # Update the active sort if the initial sort changed. This overrides
        # any changes on the browser side that were made to the active sort.
        if "initial_view" in state and view_did_change(
            state["initial_view"], self.state[key]["initial_view"]
        ):
            self.state[key]["active_view"] = {**state["initial_view"]}  # type: ignore

        if "data" in state:
            self.component_update_cache.set(
                render_id,
                self._generate_cache_key(table_id),
                JSON.stringify(state["data"]),
            )

        self.state[key] = {**self.state[key], **state}  # type: ignore

    def delete(self, render_id: str, table_id: str) -> None:
        key = self.generate_key(render_id, table_id)

        record = self.state[key]
        record["page_update_debouncer"].cleanup()

        del self.state[key]
        self.component_update_cache.delete(
            render_id, self._generate_cache_key(table_id)
        )

    def delete_for_render_id(self, render_id: str) -> None:
        for record in self.get_by_render_id(render_id):
            key = self.generate_key(record["render_id"], record["table_id"])
            record["page_update_debouncer"].cleanup()
            self.component_update_cache.delete(
                render_id, self._generate_cache_key(record["table_id"])
            )
            del self.state[key]

    def has_queued_update(self, render_id: str, table_id: str) -> bool:
        key = self.generate_key(render_id, table_id)
        return self.state[key]["page_update_debouncer"].has_queued_update

    def cleanup(self) -> None:
        for record in self.state.values():
            record["page_update_debouncer"].cleanup()

        self.state.clear()

    def get_cached_table_data(
        self, render_id: str, table_id: str
    ) -> Union[str, bytes, None]:
        return self.component_update_cache.get(
            render_id, self._generate_cache_key(table_id)
        )

    @staticmethod
    def should_refresh_total_record(
        previous_view: Table.PaginationView, new_view: Table.PaginationView
    ) -> bool:
        if search_query_did_change(
            previous_view["search_query"], new_view["search_query"]
        ):
            return True

        if filter_by_did_change(previous_view["filter_by"], new_view["filter_by"]):
            return True

        return False
