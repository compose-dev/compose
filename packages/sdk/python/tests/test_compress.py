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
        columns=[
            {"key": "0", "original": "id"},
            {"key": "1", "original": "name"},
        ],
    )

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
        columns=[{"key": "0", "original": "id"}],
    )

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
        columns=[{"key": "0", "original": "id"}],
    )

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
        columns=[{"key": "0", "original": "id"}],
    )

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
        columns=[{"key": "0", "original": "id"}],
    )

    assert JSON.stringify(compressed) == JSON.stringify(precompressed_layout)
