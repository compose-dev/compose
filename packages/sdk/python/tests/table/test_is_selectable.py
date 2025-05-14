from contextlib import suppress
from compose_sdk.core import generator
from typing import Any


def generate_random_data(count: int) -> list[dict[str, Any]]:
    return [
        {
            "uuid": idx,
        }
        for idx in range(count)
    ]


ten_rows = generate_random_data(10)
twenty_five_hundred_one_rows = generate_random_data(2501)


class TestTableIsSelectable:
    "Test that a table is only selectable if the correct criteria are met"

    def test_not_selectable_by_default(self):
        table = generator.table(
            "table",
            ten_rows,
        )

        assert table["model"]["properties"]["allowSelect"] == False

    def test_selectable_if_explicitly_set_to_true(self):
        table = generator.table(
            "table",
            ten_rows,
            selectable=True,
        )

        assert table["model"]["properties"]["allowSelect"] == True

    def test_selectable_if_deprecated_allow_select_is_set_to_true(self):
        table = generator.table(
            "table",
            ten_rows,
            allow_select=True,
        )

        assert table["model"]["properties"]["allowSelect"] == True

    def test_selectable_if_on_change_is_set(self):
        table = generator.table(
            "table",
            ten_rows,
            on_change=lambda: None,
        )

        assert table["model"]["properties"]["allowSelect"] == True

    def test_not_selectable_if_set_true_but_paged(self):
        table = generator.table(
            "table",
            twenty_five_hundred_one_rows,
            selectable=True,
        )

        assert table["model"]["properties"]["allowSelect"] == False

        deprecated_table = generator.table(
            "table",
            twenty_five_hundred_one_rows,
            allow_select=True,
        )

        assert deprecated_table["model"]["properties"]["allowSelect"] == False

    def test_selectable_if_set_true_and_paged_and_has_id_return_type(self):
        table = generator.table(
            "table",
            twenty_five_hundred_one_rows,
            selectable=True,
            selection_return_type="id",
        )

        assert table["model"]["properties"]["allowSelect"] == True

        deprecated_table = generator.table(
            "table",
            twenty_five_hundred_one_rows,
            allow_select=True,
            selection_return_type="id",
        )

        assert deprecated_table["model"]["properties"]["allowSelect"] == True

    def test_selectable_if_set_true_and_paged_and_has_index_return_type(self):
        table = generator.table(
            "table",
            twenty_five_hundred_one_rows,
            selectable=True,
            selection_return_type="index",
        )

        assert table["model"]["properties"]["allowSelect"] == True

        deprecated_table = generator.table(
            "table",
            twenty_five_hundred_one_rows,
            allow_select=True,
            selection_return_type="index",
        )

        assert deprecated_table["model"]["properties"]["allowSelect"] == True

    def test_not_selectable_if_not_set_and_paged_and_has_id_return_type(self):
        table = generator.table(
            "table",
            twenty_five_hundred_one_rows,
            selection_return_type="id",
        )

        assert table["model"]["properties"]["allowSelect"] == False

    def test_selectable_if_not_set_and_paged_and_has_index_return_type(self):
        table = generator.table(
            "table",
            twenty_five_hundred_one_rows,
            selection_return_type="index",
        )

        assert table["model"]["properties"]["allowSelect"] == False
