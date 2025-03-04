from ..ui import TYPE, ComponentReturn
from .find_component import FindComponent  # type: ignore[attr-defined]


async def resolve_coroutines(
    layout: ComponentReturn,
) -> None:
    def count_condition(component: ComponentReturn) -> bool:
        return (
            component["type"] == TYPE.BUTTON_BAR_CHART
            or component["type"] == TYPE.BUTTON_LINE_CHART
        )

    count = FindComponent.count_by_condition(layout, count_condition)

    if count == 0:
        return

    async def await_coroutine(
        component: ComponentReturn,
    ) -> None:
        if component["type"] == TYPE.BUTTON_BAR_CHART:
            component["model"]["properties"]["data"] = await component["model"][
                "properties"
            ]["data"]

    await FindComponent.do_for_component(layout, await_coroutine)
