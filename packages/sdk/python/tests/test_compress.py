from compose_sdk.core import ComponentInstance as ui, JSON, Compress


def test_non_table_component_is_not_compressed():
    layout = ui.text("YO")
    compressed = Compress.ui_tree(layout)
    assert JSON.stringify(compressed) == JSON.stringify(layout)


def test_empty_table_is_not_compressed():
    layout = ui.table(
        "table",
        [],
    )

    compressed = Compress.ui_tree(layout)

    assert JSON.stringify(compressed) == JSON.stringify(layout)


def test_table_compression_shortens_keys():
    layout = ui.table(
        "table",
        [
            {"id": "1", "name": "row 1"},
            {"id": "2", "name": "row 2"},
        ],
    )

    compressed = Compress.ui_tree(layout)

    precompressed_layout = ui.table(
        "table",
        [
            {"0": "1", "1": "row 1"},
            {"0": "2", "1": "row 2"},
        ],
    )

    # Manually set columns and primary key to match compression output
    precompressed_layout["model"]["properties"]["columns"] = [
        {"key": "0", "original": "id"},
        {"key": "1", "original": "name"},
    ]
    precompressed_layout["model"]["properties"]["primaryKey"] = None

    assert JSON.stringify(compressed) == JSON.stringify(precompressed_layout)


def test_compresses_table_with_string_columns():
    layout = ui.table(
        "table",
        [
            {"id": "1", "name": "row 1"},
            {"id": "2", "name": "row 2"},
        ],
        columns=["id"],
    )

    compressed = Compress.ui_tree(layout)

    precompressed_layout = ui.table(
        "table",
        [
            {"0": "1"},
            {"0": "2"},
        ],
    )

    # Manually set columns and primary key to match compression output
    precompressed_layout["model"]["properties"]["columns"] = [
        {"key": "0", "original": "id"}
    ]
    precompressed_layout["model"]["properties"]["primaryKey"] = None

    assert JSON.stringify(compressed) == JSON.stringify(precompressed_layout)


def test_compresses_table_with_advanced_columns():
    layout = ui.table(
        "table",
        [
            {"id": "1", "name": "row 1"},
            {"id": "2", "name": "row 2"},
        ],
        columns=[{"key": "id"}],
    )

    compressed = Compress.ui_tree(layout)

    precompressed_layout = ui.table(
        "table",
        [
            {"0": "1"},
            {"0": "2"},
        ],
    )

    # Manually set columns and primary key to match compression output
    precompressed_layout["model"]["properties"]["columns"] = [
        {"key": "0", "original": "id"}
    ]
    precompressed_layout["model"]["properties"]["primaryKey"] = None

    assert JSON.stringify(compressed) == JSON.stringify(precompressed_layout)


def test_compresses_table_when_nested():
    layout = ui.table(
        "table",
        [
            {"id": "1", "name": "row 1"},
            {"id": "2", "name": "row 2"},
        ],
        columns=[{"key": "id"}],
    )

    nested_layout = ui.row([ui.stack(layout)])
    nested_layout["model"]["id"] = "row"
    nested_layout["model"]["children"][0]["model"]["id"] = "stack"

    compressed = Compress.ui_tree(nested_layout)

    precompressed_layout = ui.table(
        "table",
        [
            {"0": "1"},
            {"0": "2"},
        ],
    )

    # Manually set columns and primary key to match compression output
    precompressed_layout["model"]["properties"]["columns"] = [
        {"key": "0", "original": "id"}
    ]
    precompressed_layout["model"]["properties"]["primaryKey"] = None

    precompressed_nested_layout = ui.row([ui.stack(precompressed_layout)])
    precompressed_nested_layout["model"]["id"] = "row"
    precompressed_nested_layout["model"]["children"][0]["model"]["id"] = "stack"

    assert JSON.stringify(compressed) == JSON.stringify(precompressed_nested_layout)


def test_does_not_compress_table_when_nested_without_recursion():
    layout = ui.table(
        "table",
        [
            {"id": "1", "name": "row 1"},
            {"id": "2", "name": "row 2"},
        ],
        columns=[{"key": "id"}],
    )

    nested_layout = ui.row([ui.stack(layout)])
    nested_layout["model"]["id"] = "row"
    nested_layout["model"]["children"][0]["model"]["id"] = "stack"

    compressed = Compress.ui_tree_without_recursion(nested_layout)

    precompressed_layout = ui.table(
        "table",
        [
            {"id": "1", "name": "row 1"},
            {"id": "2", "name": "row 2"},
        ],
        columns=[{"key": "id"}],
    )

    precompressed_nested_layout = ui.row([ui.stack(precompressed_layout)])
    precompressed_nested_layout["model"]["id"] = "row"
    precompressed_nested_layout["model"]["children"][0]["model"]["id"] = "stack"

    assert JSON.stringify(compressed) == JSON.stringify(precompressed_nested_layout)


def test_compresses_table_with_different_keys_across_rows():
    layout = ui.table(
        "table",
        [
            {"id": "1", "name": "row 1"},
            {"name": "row 2"},
        ],
        columns=["id"],
    )

    compressed = Compress.ui_tree(layout)

    precompressed_layout = ui.table(
        "table",
        [
            {"0": "1"},
            {},
        ],
    )

    # Manually set columns and primary key to match compression output
    precompressed_layout["model"]["properties"]["columns"] = [
        {"key": "0", "original": "id"}
    ]
    precompressed_layout["model"]["properties"]["primaryKey"] = None

    assert JSON.stringify(compressed) == JSON.stringify(precompressed_layout)


def test_infers_columns_from_data_when_columns_is_null_and_table_is_not_paged():
    layout = ui.table(
        "table",
        [
            {"id": "1", "name": "row 1", "email": "test1@example.com"},
            {"id": "2", "name": "row 2", "phone": "123-456-7890"},
            {
                "id": "3",
                "name": "row 3",
                "email": "test3@example.com",
                "address": "123 Main St",
            },
        ],
        columns=None,
        paginate=False,
    )

    compressed = Compress.ui_tree(layout)

    # Should infer columns from all unique keys in the data
    expected_columns = [
        {"key": "0", "original": "id"},
        {"key": "1", "original": "name"},
        {"key": "2", "original": "email"},
        {"key": "3", "original": "phone"},
        {"key": "4", "original": "address"},
    ]

    expected_data = [
        {
            "0": "1",
            "1": "row 1",
            "2": "test1@example.com",
        },
        {
            "0": "2",
            "1": "row 2",
            "3": "123-456-7890",
        },
        {
            "0": "3",
            "1": "row 3",
            "2": "test3@example.com",
            "4": "123 Main St",
        },
    ]

    assert compressed["model"]["properties"]["columns"] == expected_columns
    assert compressed["model"]["properties"]["data"] == expected_data


def test_does_not_infer_columns_when_table_is_paged():
    layout = ui.table(
        "table",
        [
            {"id": "1", "name": "row 1"},
            {"id": "2", "name": "row 2"},
        ],
        columns=None,
        paginate=True,
    )

    compressed = Compress.ui_tree(layout)

    # Should not modify the table when paged and columns is null
    assert compressed["model"]["properties"]["columns"] is None
    assert compressed["model"]["properties"]["data"] == [
        {"id": "1", "name": "row 1"},
        {"id": "2", "name": "row 2"},
    ]


def test_does_not_infer_columns_when_data_is_empty():
    layout = ui.table(
        "table",
        [],
        columns=None,
        paginate=False,
    )

    compressed = Compress.ui_tree(layout)

    # Should not modify the table when data is empty
    assert compressed["model"]["properties"]["columns"] is None
    assert compressed["model"]["properties"]["data"] == []


def test_infers_columns_from_first_5_rows_only():
    layout = ui.table(
        "table",
        [
            {"id": "1", "name": "row 1"},
            {"id": "2", "name": "row 2"},
            {"id": "3", "name": "row 3"},
            {"id": "4", "name": "row 4"},
            {"id": "5", "name": "row 5"},
            {"id": "6", "name": "row 6", "new_column": "should not be included"},
            {"id": "7", "name": "row 7", "another_column": "also not included"},
        ],
        columns=None,
        paginate=False,
    )

    compressed = Compress.ui_tree(layout)

    # Should only infer columns from first 5 rows
    expected_columns = [
        {"key": "0", "original": "id"},
        {"key": "1", "original": "name"},
    ]

    assert compressed["model"]["properties"]["columns"] == expected_columns
    assert compressed["model"]["properties"]["data"][5] == {
        "0": "6",
        "1": "row 6",
    }
    assert compressed["model"]["properties"]["data"][6] == {
        "0": "7",
        "1": "row 7",
    }


def test_handles_primary_key_correctly_when_inferring_columns():
    layout = ui.table(
        "table",
        [
            {"user_id": "1", "name": "row 1", "email": "test1@example.com"},
            {"user_id": "2", "name": "row 2", "email": "test2@example.com"},
        ],
        columns=None,
        paginate=False,
        primary_key="user_id",
    )

    compressed = Compress.ui_tree(layout)

    # Primary key column should get the special ID
    expected_columns = [
        {"key": "i", "original": "user_id"},
        {"key": "1", "original": "name"},
        {"key": "2", "original": "email"},
    ]

    expected_data = [
        {"i": "1", "1": "row 1", "2": "test1@example.com"},
        {"i": "2", "1": "row 2", "2": "test2@example.com"},
    ]

    assert compressed["model"]["properties"]["columns"] == expected_columns
    assert compressed["model"]["properties"]["data"] == expected_data
    assert compressed["model"]["properties"]["primaryKey"] == "i"


def test_handles_primary_key_not_present_in_inferred_columns():
    layout = ui.table(
        "table",
        [
            {"id": "1", "name": "row 1"},
            {"id": "2", "name": "row 2"},
        ],
        columns=None,
        paginate=False,
        primary_key="hidden_id",
    )

    # Add hidden_id to data but it won't be in first 5 rows' keys
    for index, row in enumerate(layout["model"]["properties"]["data"]):
        row["hidden_id"] = f"hidden-{index + 1}"

    compressed = Compress.ui_tree(layout)

    # Should separately assign primary key
    expected_data = [
        {"0": "1", "1": "row 1", "i": "hidden-1"},
        {"0": "2", "1": "row 2", "i": "hidden-2"},
    ]

    assert compressed["model"]["properties"]["data"] == expected_data
    assert compressed["model"]["properties"]["primaryKey"] == "i"
