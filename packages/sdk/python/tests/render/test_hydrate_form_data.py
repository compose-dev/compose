import datetime

from compose_sdk.core import TYPE, Render, ComponentInstance as ui, JSON
from compose_sdk.core.file import File


async def test_empty_form_data():
    assert Render.hydrate_form_data({}, ui.stack([]), {}) == ({}, [])


async def test_form_data_with_text_input():
    assert Render.hydrate_form_data({"firstName": "John"}, ui.stack([]), {}) == (
        {"firstName": "John"},
        [],
    )


async def test_form_data_for_date_input():
    input = {
        "birthday": {
            "value": {
                "day": 1,
                "month": 1,
                "year": 1990,
            },
            "type": TYPE.INPUT_DATE,
        }
    }

    form_data, _ = Render.hydrate_form_data(input, ui.stack([]), {})

    assert isinstance(form_data["birthday"], datetime.date)
    assert form_data["birthday"].year == 1990
    assert form_data["birthday"].month == 1
    assert form_data["birthday"].day == 1


async def test_form_data_for_time_input():
    input = {
        "birthday": {
            "value": {
                "hour": 1,
                "minute": 1,
            },
            "type": TYPE.INPUT_TIME,
        }
    }

    form_data, _ = Render.hydrate_form_data(input, ui.stack([]), {})

    assert isinstance(form_data["birthday"], datetime.time)
    assert form_data["birthday"].hour == 1
    assert form_data["birthday"].minute == 1


async def test_form_data_for_datetime_input():
    input = {
        "birthday": {
            "value": {
                "day": 1,
                "month": 1,
                "year": 1990,
                "hour": 1,
                "minute": 1,
            },
            "type": TYPE.INPUT_DATE_TIME,
        }
    }

    form_data, _ = Render.hydrate_form_data(input, ui.stack([]), {})

    assert isinstance(form_data["birthday"], datetime.datetime)
    assert form_data["birthday"].year == 1990
    assert form_data["birthday"].month == 1
    assert form_data["birthday"].day == 1
    assert form_data["birthday"].hour == 1
    assert form_data["birthday"].minute == 1


async def test_form_data_for_checkbox_input():
    input = {"checked": True}

    form_data, _ = Render.hydrate_form_data(input, ui.stack([]), {})

    assert form_data["checked"] == True


async def test_form_data_for_file_drop():
    input = {
        "profilePicture": [
            {
                "fileId": "123",
                "fileName": "profile.jpg",
                "fileType": "image/jpeg",
            }
        ]
    }

    form_data, temp_files_to_delete = Render.hydrate_form_data(
        input, ui.stack([]), {"123": b"SOME_FILE_HERE"}
    )

    assert isinstance(form_data["profilePicture"], list)
    assert len(form_data["profilePicture"]) == 1
    assert isinstance(form_data["profilePicture"][0], File)

    assert form_data["profilePicture"][0].name == "profile.jpg"
    assert form_data["profilePicture"][0].type == "image/jpeg"

    assert temp_files_to_delete == ["123"]


async def test_form_data_for_table_v1():
    input = {"table": [{"id": "1"}]}

    table_data = [{"id": "1"}, {"id": "2"}]

    component_tree = ui.stack([ui.table("table", table_data)])

    form_data, _ = Render.hydrate_form_data(input, component_tree, {})

    assert form_data["table"] == [{"id": "1"}]


async def test_form_data_for_table_v2():
    input = {"table": {"value": [0, 1], "type": TYPE.INPUT_TABLE}}

    table_data = [{"id": "1"}, {"id": "2"}]

    component_tree = ui.stack([ui.table("table", table_data)])

    form_data, _ = Render.hydrate_form_data(input, component_tree, {})

    assert form_data["table"] == table_data
