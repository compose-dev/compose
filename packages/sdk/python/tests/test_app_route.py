import pytest
from compose_sdk.app import AppDefinition


def dummy_handler():
    pass


def test_auto_generated_route():
    """Test auto-generated routes"""
    app = AppDefinition(name="Test App", handler=dummy_handler)
    assert app.route == "test-app-auto-suffix"
    assert app.is_auto_generated_route is True


class TestUserProvidedRoutes:
    """Test user-provided routes"""

    def test_multiple_spaces_in_route(self):
        app = AppDefinition(
            name="Test App",
            handler=dummy_handler,
            route="test    multiple    spaces",
        )
        assert app.route == "test----multiple----spaces"

    def test_empty_route(self):
        with pytest.raises(ValueError, match="Invalid route"):
            AppDefinition(name="Test App", handler=dummy_handler, route="")

    def test_route_with_only_numbers(self):
        app = AppDefinition(name="Test App", handler=dummy_handler, route="123456")
        assert app.route == "123456"

    def test_valid_lowercase_route(self):
        app = AppDefinition(
            name="Test App", handler=dummy_handler, route="my-test-route"
        )
        assert app.route == "my-test-route"
        assert app.is_auto_generated_route is False

    def test_uppercase_route_conversion(self):
        app = AppDefinition(
            name="Test App", handler=dummy_handler, route="MY-TEST-ROUTE"
        )
        assert app.route == "my-test-route"

    def test_strip_leading_forward_slash(self):
        app = AppDefinition(name="Test App", handler=dummy_handler, route="/test-route")
        assert app.route == "test-route"

    def test_strip_multiple_leading_forward_slashes(self):
        app = AppDefinition(
            name="Test App", handler=dummy_handler, route="///test-route"
        )
        assert app.route == "test-route"

    def test_invalid_characters(self):
        with pytest.raises(ValueError, match="Invalid route"):
            AppDefinition(name="Test App", handler=dummy_handler, route="test@route")

        with pytest.raises(ValueError, match="Invalid route"):
            AppDefinition(name="Test App", handler=dummy_handler, route="test$route")

    def test_route_with_spaces(self):
        app = AppDefinition(name="Test App", handler=dummy_handler, route="test route")
        assert app.route == "test-route"

    def test_route_starting_with_hyphen(self):
        with pytest.raises(ValueError, match="Invalid route"):
            AppDefinition(name="Test App", handler=dummy_handler, route="-test-route")

    def test_route_ending_with_hyphen(self):
        with pytest.raises(ValueError, match="Invalid route"):
            AppDefinition(name="Test App", handler=dummy_handler, route="test-route-")

    def test_nested_paths(self):
        with pytest.raises(ValueError, match="Invalid route"):
            AppDefinition(name="Test App", handler=dummy_handler, route="test/route")
