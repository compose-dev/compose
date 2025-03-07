import pytest
from compose_sdk.app import AppDefinition
import re


def dummy_handler():
    pass


class TestUserProvidedRoutes:
    """Test user-provided routes"""

    def test_multiple_spaces_in_route(self):
        app = AppDefinition(
            route="test    multiple    spaces",
            handler=dummy_handler,
        )
        assert app.route == "test----multiple----spaces"

    def test_empty_route(self):
        with pytest.raises(
            ValueError,
            match=re.escape(
                "Missing 'route' parameter in Compose.App constructor (this should be the first argument to the constructor)"
            ),
        ):
            AppDefinition("", dummy_handler)

    def test_route_with_only_numbers(self):
        app = AppDefinition(route="123456", handler=dummy_handler)
        assert app.route == "123456"

    def test_valid_lowercase_route(self):
        app = AppDefinition(route="my-test-route", handler=dummy_handler)
        assert app.route == "my-test-route"

    def test_uppercase_route_conversion(self):
        app = AppDefinition(route="MY-TEST-ROUTE", handler=dummy_handler)
        assert app.route == "my-test-route"

    def test_strip_leading_forward_slash(self):
        app = AppDefinition(route="/test-route", handler=dummy_handler)
        assert app.route == "test-route"

    def test_strip_multiple_leading_forward_slashes(self):
        app = AppDefinition(route="///test-route", handler=dummy_handler)
        assert app.route == "test-route"

    def test_invalid_characters(self):
        with pytest.raises(ValueError, match="Invalid route"):
            AppDefinition(route="test@route", handler=dummy_handler)

        with pytest.raises(ValueError, match="Invalid route"):
            AppDefinition(route="test$route", handler=dummy_handler)

    def test_route_with_spaces(self):
        app = AppDefinition(route="test route", handler=dummy_handler)
        assert app.route == "test-route"

    def test_route_starting_with_hyphen(self):
        with pytest.raises(ValueError, match="Invalid route"):
            AppDefinition(route="-test-route", handler=dummy_handler)

    def test_route_ending_with_hyphen(self):
        with pytest.raises(ValueError, match="Invalid route"):
            AppDefinition(route="test-route-", handler=dummy_handler)

    def test_nested_paths(self):
        with pytest.raises(ValueError, match="Invalid route"):
            AppDefinition(route="test/route", handler=dummy_handler)
