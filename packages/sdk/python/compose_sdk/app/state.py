# type: ignore

import copy
from typing import Dict, Any, TYPE_CHECKING, Iterator, Union

dict_key = str
dict_value = Any

if TYPE_CHECKING:
    from .appRunner import AppRunner


class State:
    def __init__(self, appRunner: "AppRunner", initial_state: Union[dict, None] = None):
        # Copy the state to avoid mutating the initial state object,
        # which could lead to state being shared across app executions.
        self._state = copy.deepcopy(initial_state or {})
        self.appRunner = appRunner

        self._debounce_interval = 0.001  # 1 millisecond
        self._debounce_timer = None

    def __onStateUpdate(self):
        if self._debounce_timer is not None:
            self._debounce_timer.cancel()

        self._debounce_timer = self.appRunner.scheduler.create_task(
            self._debounced_update()
        )

    async def _debounced_update(self):
        await self.appRunner.scheduler.sleep(self._debounce_interval)
        await self.appRunner.on_state_update()

    def __getitem__(self, key: dict_key) -> dict_value:
        return self._state[key]

    def __setitem__(self, key: dict_key, value: dict_value):
        self._state[key] = value
        self.__onStateUpdate()

    def overwrite(self, new_state: Dict[dict_key, dict_value]):
        self._state = new_state
        self.__onStateUpdate()

    def merge(self, new_state: Dict[dict_key, dict_value]):
        self._state.update(new_state)
        self.__onStateUpdate()

    def __repr__(self):
        return repr(self._state)

    def __eq__(self, other):
        if isinstance(other, dict):
            return self._state == other
        elif isinstance(other, State):
            return self._state == other._state
        return False

    def __len__(self):
        return len(self._state)

    def __iter__(self) -> Iterator[dict_key]:
        return iter(self._state)

    def __contains__(self, item):
        return item in self._state

    def keys(self):
        return self._state.keys()

    def values(self):
        return self._state.values()

    def items(self):
        return self._state.items()

    def get(self, key, default=None):
        return self._state.get(key, default)
