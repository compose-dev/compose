# type: ignore

from typing import Literal, Union, Callable, Awaitable

from ..ui import INTERACTION_TYPE, TYPE, ComponentReturn


class FindComponent:
    @staticmethod
    def by_id(
        static_layout: ComponentReturn, component_id: str
    ) -> Union[ComponentReturn, None]:
        if static_layout["model"]["id"] == component_id:
            return static_layout

        if static_layout["interactionType"] == INTERACTION_TYPE.LAYOUT:
            children = (
                static_layout["model"]["children"]
                if isinstance(static_layout["model"]["children"], list)
                else [static_layout["model"]["children"]]
            )

            for child in children:
                found = FindComponent.by_id(child, component_id)
                if found is not None:
                    return found

        return None

    @staticmethod
    def by_type(
        static_layout: ComponentReturn, component_type: TYPE
    ) -> Union[ComponentReturn, None]:
        if static_layout["type"] == component_type:
            return static_layout

        if static_layout["interactionType"] == INTERACTION_TYPE.LAYOUT:
            children = (
                static_layout["model"]["children"]
                if isinstance(static_layout["model"]["children"], list)
                else [static_layout["model"]["children"]]
            )

            for child in children:
                found = FindComponent.by_type(child, component_type)
                if found is not None:
                    return found

        return None

    @staticmethod
    def by_interaction_type(
        static_layout: ComponentReturn, interaction_type: INTERACTION_TYPE
    ) -> Union[ComponentReturn, None]:
        if static_layout["interactionType"] == interaction_type:
            return static_layout

        if static_layout["interactionType"] == INTERACTION_TYPE.LAYOUT:
            children = (
                static_layout["model"]["children"]
                if isinstance(static_layout["model"]["children"], list)
                else [static_layout["model"]["children"]]
            )

            for child in children:
                found = FindComponent.by_interaction_type(child, interaction_type)
                if found is not None:
                    return found

        return None

    @staticmethod
    def count_by_condition(
        static_layout: ComponentReturn, condition: Callable[[ComponentReturn], bool]
    ) -> int:
        count = 0

        if condition(static_layout):
            count += 1

        if static_layout["interactionType"] == INTERACTION_TYPE.LAYOUT:
            children = (
                static_layout["model"]["children"]
                if isinstance(static_layout["model"]["children"], list)
                else [static_layout["model"]["children"]]
            )

            for child in children:
                count += FindComponent.count_by_condition(child, condition)

        return count

    @staticmethod
    def count_by_type(static_layout: ComponentReturn, component_type: TYPE) -> int:
        return FindComponent.count_by_condition(
            static_layout, lambda component: component["type"] == component_type
        )

    @staticmethod
    def edit_by_condition(
        static_layout: ComponentReturn,
        conditional_edit: Callable[
            [ComponentReturn], Union[ComponentReturn, Literal[False]]
        ],
    ) -> ComponentReturn:
        edit = conditional_edit(static_layout)

        if edit is not False:
            if edit["interactionType"] != INTERACTION_TYPE.LAYOUT:
                return edit

            children = (
                edit["model"]["children"]
                if isinstance(edit["model"]["children"], list)
                else [edit["model"]["children"]]
            )

            new_children = [
                FindComponent.edit_by_condition(child, conditional_edit)
                for child in children
            ]

            return {
                **edit,
                "model": {
                    **edit["model"],
                    "children": new_children,
                },
            }

        if static_layout["interactionType"] == INTERACTION_TYPE.LAYOUT:
            children = (
                static_layout["model"]["children"]
                if isinstance(static_layout["model"]["children"], list)
                else [static_layout["model"]["children"]]
            )

            new_children = [
                FindComponent.edit_by_condition(child, conditional_edit)
                for child in children
            ]

            return {
                **static_layout,
                "model": {
                    **static_layout["model"],
                    "children": new_children,
                },
            }

        return static_layout

    @staticmethod
    async def do_for_component(
        static_layout: ComponentReturn,
        callback: Callable[[ComponentReturn], Union[Awaitable[None], None]],
    ) -> None:
        await callback(static_layout)

        if static_layout["interactionType"] == INTERACTION_TYPE.LAYOUT:
            children = (
                static_layout["model"]["children"]
                if isinstance(static_layout["model"]["children"], list)
                else [static_layout["model"]["children"]]
            )

            for child in children:
                await FindComponent.do_for_component(child, callback)

        return None
