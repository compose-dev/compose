from .ui import ComponentReturn, TYPE, INTERACTION_TYPE
from typing import Any, Dict, List


class Compress:
    @staticmethod
    def table_layout(table: ComponentReturn) -> ComponentReturn:
        """
        Optimizes the table packet size by removing columns that are not needed
        by the client.
        """
        columnsProperty = table["model"]["properties"]["columns"]

        columns = (
            list(table["model"]["properties"]["data"][0].keys())
            if columnsProperty is None and len(table["model"]["properties"]["data"]) > 0
            else columnsProperty
        )

        if columns is None:
            return table

        optimized_columns = [
            (
                {
                    "key": str(idx),
                    "original": column,
                }
                if isinstance(column, str)
                else {
                    **column,
                    "key": str(idx),
                    "original": column["key"],
                }
            )
            for idx, column in enumerate(columns)
        ]

        # Pre-compute original and key mappings for better performance
        key_original_map = [(col["key"], col["original"]) for col in optimized_columns]

        new_data: List[Dict[str, Any]] = []
        data = table["model"]["properties"]["data"]
        for row in data:
            new_row: Dict[str, Any] = {}
            for key, original in key_original_map:
                if original in row:
                    new_row[key] = row[original]
            new_data.append(new_row)

        return {
            **table,
            "model": {
                **table["model"],
                "properties": {
                    **table["model"]["properties"],
                    "data": new_data,
                    "columns": optimized_columns,
                },
            },
        }

    @staticmethod
    def ui_tree(layout: ComponentReturn) -> ComponentReturn:
        if layout["type"] == TYPE.INPUT_TABLE:
            return Compress.table_layout(layout)

        if layout["interactionType"] == INTERACTION_TYPE.LAYOUT:
            new_children = (
                [Compress.ui_tree(child) for child in layout["model"]["children"]]  # type: ignore[unused-ignore]
                if isinstance(layout["model"]["children"], list)
                else Compress.ui_tree(layout["model"]["children"])
            )

            return {
                **layout,
                "model": {
                    **layout["model"],
                    "children": new_children,
                },
            }

        return layout

    @staticmethod
    def ui_tree_without_recursion(
        layout: ComponentReturn,
    ) -> ComponentReturn:
        if layout["type"] == TYPE.INPUT_TABLE:
            return Compress.table_layout(layout)

        if layout["interactionType"] == INTERACTION_TYPE.LAYOUT:
            return layout

        return layout
