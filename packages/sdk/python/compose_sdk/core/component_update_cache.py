from typing import Dict, Union
from .ui import TYPE, ComponentReturn


class ComponentUpdateCache:
    """
    A cache of the previous stringified component state.

    Enables two things:

    1. Cache lookup instead of recomputing the stringified component state.
    2. Avoids update-by-reference bugs when underlying data objects that
       are used in the component state change, since the cache is stringified.
    """

    def __init__(self) -> None:
        self._cache: Dict[str, Union[str, bytes]] = {}

    def _generate_key(self, render_id: str, component_id: str) -> str:
        return f"{render_id}-{component_id}"

    def get(self, render_id: str, component_id: str) -> Union[str, bytes, None]:
        return self._cache.get(self._generate_key(render_id, component_id))

    def set(self, render_id: str, component_id: str, value: Union[str, bytes]) -> None:
        self._cache[self._generate_key(render_id, component_id)] = value

    def delete(self, render_id: str, component_id: str) -> None:
        key = self._generate_key(render_id, component_id)
        if key in self._cache:
            del self._cache[key]

    def clear_render(self, render_id: str) -> None:
        """
        Clear all cache entries for a given render ID.
        """
        keys_to_delete = [key for key in self._cache if key.startswith(render_id)]
        for key in keys_to_delete:
            del self._cache[key]

    def clear(self) -> None:
        self._cache.clear()

    def should_cache(self, component: ComponentReturn) -> bool:
        """
        Determine if a component should be cached based on its type.
        """
        # For now, we only cache components that have high-probability of
        # having update-by-reference bugs. Furthermore, we don't currently
        # have a way to cache non-input components since they don't have
        # a stable reference ID.
        component_type = component["type"]
        return (
            component_type == TYPE.INPUT_TABLE
            or component_type == TYPE.INPUT_SELECT_DROPDOWN_MULTI
            or component_type == TYPE.INPUT_SELECT_DROPDOWN_SINGLE
            or component_type == TYPE.INPUT_RADIO_GROUP
            or component_type == TYPE.INPUT_JSON
            or component_type == TYPE.BUTTON_BAR_CHART
        )
