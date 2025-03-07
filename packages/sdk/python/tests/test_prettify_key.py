from compose_sdk.core import prettify_key


def test_handles_empty_string():
    assert prettify_key("") == ""


def test_capitalizes_first_letter_of_single_word():
    assert prettify_key("name") == "Name"
    assert prettify_key("name", False) == "Name"


def test_handles_camel_case():
    assert prettify_key("firstName") == "First Name"
    assert prettify_key("firstName", False) == "First name"
    assert prettify_key("lastLoginDate") == "Last Login Date"
    assert prettify_key("lastLoginDate", False) == "Last login date"


def test_handles_snake_case():
    assert prettify_key("user_name") == "User Name"
    assert prettify_key("user_name", False) == "User name"
    assert prettify_key("last_login_time") == "Last Login Time"
    assert prettify_key("last_login_time", False) == "Last login time"


def test_handles_dash_case():
    assert prettify_key("user-email") == "User Email"
    assert prettify_key("created-at-date") == "Created At Date"


def test_handles_id_fields():
    assert prettify_key("id") == "ID"
    assert prettify_key("id", False) == "ID"

    assert prettify_key("userId") == "User ID"
    assert prettify_key("userId", False) == "User ID"

    assert prettify_key("user_id") == "User ID"
    assert prettify_key("user-id") == "User ID"
    assert prettify_key("ID") == "ID"
    assert prettify_key("ID", False) == "ID"

    assert prettify_key("UUID") == "UUID"
    assert prettify_key("UUID", False) == "UUID"

    assert prettify_key("userUuid") == "User UUID"
    assert prettify_key("userUuid", False) == "User UUID"


def test_handles_mixed_cases():
    assert prettify_key("user_firstName") == "User First Name"
    assert prettify_key("user_firstName", False) == "User first name"
    assert prettify_key("last-login_dateTime") == "Last Login Date Time"
    assert prettify_key("last-login_dateTime", False) == "Last login date time"


def test_preserves_acronyms():
    assert prettify_key("HTMLContent") == "HTML Content"
    assert prettify_key("HTMLContent", False) == "HTML content"
    assert prettify_key("APIKey") == "API Key"
    assert prettify_key("APIKey", False) == "API key"


def test_handles_edge_cases():
    assert prettify_key("a") == "A"
    assert prettify_key("alreadyFormattedProperly") == "Already Formatted Properly"
    assert prettify_key("ALLCAPS") == "ALLCAPS"
    assert prettify_key("") == ""


def test_preserves_normal_strings():
    assert prettify_key("normal string") == "Normal String"
    assert prettify_key("normal string", False) == "Normal string"
    assert prettify_key("First Name") == "First Name"
    assert prettify_key("First Name", False) == "First name"
    assert prettify_key("First name", False) == "First name"
