from .ui import ComponentReturn, TYPE, INTERACTION_TYPE
from typing import Any, Dict, List, Union

UNIQUE_PRIMARY_KEY_ID = "i"


def get_columns(table: ComponentReturn) -> Union[List[Any], Any]:
    columnsProperty = table["model"]["properties"]["columns"]

    if (
        columnsProperty is None
        and len(table["model"]["properties"]["data"]) > 0
        # If the table is paged, do not optimize the columns unless
        # the property is explicitly set by the user. Manually paged
        # tables transmit the table model prior to loading any data,
        # so it's too late to optimize the columns on future pages.
        and table["model"]["properties"].get("paged", None) is not True
    ):
        num_rows = min(len(table["model"]["properties"]["data"]), 5)

        keys: List[str] = []

        for i in range(num_rows):
            row = table["model"]["properties"]["data"][i]
            for key in row.keys():
                if key not in keys:
                    keys.append(key)

        return keys

    return columnsProperty


class Compress:
    @staticmethod
    def table_layout(table: ComponentReturn) -> ComponentReturn:
        """
        Optimizes the table packet size by removing columns that are not needed
        by the client.
        """
        columns = get_columns(table)

        if columns is None:
            return table

        optimized_columns = [
            (
                {
                    "key": str(idx),
                    "original": column,
                }
                if isinstance(column, str)
                or isinstance(column, int)
                or isinstance(column, float)
                else {
                    **column,
                    "key": str(idx),
                    "original": column["key"],
                }
            )
            for idx, column in enumerate(columns)
        ]

        original_primary_key = table["model"]["properties"].get("primaryKey", None)
        should_separately_assign_primary_key = False

        if original_primary_key is not None:
            primary_key_column = next(
                (
                    col
                    for col in optimized_columns
                    if col["original"] == original_primary_key
                ),
                None,
            )

            if primary_key_column is not None:
                primary_key_column["key"] = UNIQUE_PRIMARY_KEY_ID
            else:
                should_separately_assign_primary_key = True

        # Pre-compute original and key mappings for better performance
        key_original_map = [(col["key"], col["original"]) for col in optimized_columns]

        new_data: List[Dict[str, Any]] = []
        data = table["model"]["properties"]["data"]
        for row in data:
            new_row: Dict[str, Any] = {}
            for key, original in key_original_map:
                if original in row:
                    new_row[key] = row[original]  # type: ignore

            if should_separately_assign_primary_key:
                new_row[UNIQUE_PRIMARY_KEY_ID] = row[original_primary_key]

            new_data.append(new_row)

        return {
            **table,
            "model": {
                **table["model"],
                "properties": {
                    **table["model"]["properties"],
                    "data": new_data,
                    "columns": optimized_columns,
                    "primaryKey": (
                        None if original_primary_key is None else UNIQUE_PRIMARY_KEY_ID
                    ),
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
