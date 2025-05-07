from typing import Dict, TypedDict, Any, Union, Tuple, List
from ..scheduler import Scheduler  # type: ignore[attr-defined]
from .ui import Stale, TableColumnSort, Table
from .smart_debounce import SmartDebounce
from .json import JSON


class TableStateRecordInput(TypedDict):
    data: List[Any]
    total_records: Union[int, None]
    search_query: Union[str, None]
    offset: int
    page_size: int
    initial_sort_by: List[TableColumnSort]
    initial_filter_by: Table.AdvancedFilterModel
    stale: Stale.TYPE


class TableStateRecord(TableStateRecordInput):
    page_update_debouncer: SmartDebounce
    render_id: str
    table_id: str
    active_sort_by: List[TableColumnSort]
    active_filter_by: Table.AdvancedFilterModel


PAGE_UPDATE_DEBOUNCE_INTERVAL_MS = 250
KEY_SEPARATOR = "__"


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
    old_filter_by: Table.AdvancedFilterModel,
    new_filter_by: Table.AdvancedFilterModel,
) -> bool:
    return JSON.stringify(old_filter_by) != JSON.stringify(new_filter_by)


class TableState:
    def __init__(self, scheduler: Scheduler):
        self.state: Dict[str, TableStateRecord] = {}
        self.scheduler = scheduler

    def generate_key(self, render_id: str, table_id: str) -> str:
        return f"{render_id}{KEY_SEPARATOR}{table_id}"

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
            "initial_sort_by": state["initial_sort_by"],
            "active_sort_by": state["initial_sort_by"],
            "initial_filter_by": state["initial_filter_by"],
            "active_filter_by": state["initial_filter_by"],
        }

    def update(self, render_id: str, table_id: str, state: Dict[str, Any]) -> None:
        key = self.generate_key(render_id, table_id)

        # Update the active sort if the initial sort changed. This overrides
        # any changes on the browser side that were made to the active sort.
        if "initial_sort_by" in state and sort_by_did_change(
            state["initial_sort_by"], self.state[key]["initial_sort_by"]
        ):
            self.state[key]["active_sort_by"] = state["initial_sort_by"] or []

        if "initial_filter_by" in state and filter_by_did_change(
            state["initial_filter_by"], self.state[key]["initial_filter_by"]
        ):
            self.state[key]["active_filter_by"] = state["initial_filter_by"] or None

        self.state[key] = {**self.state[key], **state}  # type: ignore

    def delete(self, render_id: str, table_id: str) -> None:
        key = self.generate_key(render_id, table_id)

        record = self.state[key]
        record["page_update_debouncer"].cleanup()

        del self.state[key]

    def delete_for_render_id(self, render_id: str) -> None:
        for record in self.get_by_render_id(render_id):
            key = self.generate_key(record["render_id"], record["table_id"])
            record["page_update_debouncer"].cleanup()
            del self.state[key]

    def has_queued_update(self, render_id: str, table_id: str) -> bool:
        key = self.generate_key(render_id, table_id)
        return self.state[key]["page_update_debouncer"].has_queued_update

    def cleanup(self) -> None:
        for record in self.state.values():
            record["page_update_debouncer"].cleanup()

        self.state.clear()
