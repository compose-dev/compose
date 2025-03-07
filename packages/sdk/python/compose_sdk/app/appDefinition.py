from typing import Callable, Union, Any, Dict, overload

from .route import format_route, is_valid_route
from ..core import prettify_key


class AppDefinition:
    """
    Create a Compose App.

    >>> import compose_sdk as c
    ...
    ... def hello_world_handler(page: c.Page, ui: c.UI):
    ...     page.add(lambda: ui.text("Hello, world!"))
    ...
    ... hello_world_app = c.App(
    ...     route="/hello-world",
    ...     handler=hello_world_handler,
    ... )

    Required arguments:
    - `route`: The unique route to assign to the app and use as the URL slug in the browser. Should be one word, e.g. "/user-management-app" or "user-management-app". Avoid nested routes (e.g. "/user-management/user-list"), as the main purpose of this argument is to provide a unique identifier for the app.
    - `handler`: The handler function for the app.

    Optional keyword arguments:
    - `name`: The name of the app. Used to identify the app in the UI, and as the title of the browser tab. For example: "User Management App". If not provided, will be auto-generated from the route.
    - `parent_app_route`: If this app is a sub-page of a multi-page app, declare the parent app route here. Declaring this value will:
        - allow this app to inherit permissions from the parent app (e.g. if the parent app is shared with an external email, this app will be too)
        - hide this app in the Compose dashboard so that the dashboard isn't cluttered with sub-pages for a multi-page app. This app will still be available programmatically (e.g. via the `page.link` function) and via the URL. This feature can be overriden by directly setting the `hidden` property to `False`.
    - `description`: A short description of the app to display on the home page.
    - `hidden`: Whether the app should be hidden from the home page.

    Read the full documentation: https://docs.composehq.com/get-started/concepts
    """

    @overload
    def __init__(
        self,
        route: str,
        handler: Callable[..., Any],
        *,
        name: Union[str, None] = None,
        parent_app_route: Union[str, None] = None,
        description: Union[str, None] = None,
        hidden: Union[bool, None] = None,
        initial_state: Union[Dict[str, Any], None] = None,
    ) -> None: ...

    # This overload is kept for backwards compatibility, but all new code should use the first overload instead!
    @overload
    def __init__(
        self,
        name: str,
        handler: Callable[..., Any],
        *,
        route: Union[str, None] = None,
        parent_app_route: Union[str, None] = None,
        description: Union[str, None] = None,
        hidden: Union[bool, None] = None,
        initial_state: Union[Dict[str, Any], None] = None,
    ) -> None: ...

    def __init__(  # type: ignore[unused-ignore]
        self,
        *args: Any,
        handler: Union[Callable[..., Any], None] = None,
        name: Union[str, None] = None,
        route: Union[str, None] = None,
        parent_app_route: Union[str, None] = None,
        description: Union[str, None] = None,
        hidden: Union[bool, None] = None,
        initial_state: Union[Dict[str, Any], None] = None,
    ):
        using_kwargs_route = route is not None

        # Originally, name was the first positional argument, and route was an optional keyword argument.
        # We switched this so that now route is the first positional argument, and name is an optional keyword argument.
        # But, we want to support the old way of doing things for backwards compatibility. Hence, the conditional
        # logic below. During the migration, we confirmed that all customers who were using the old way had defined
        # a keyword route, so we're able to silently support the case where name is positional as long as route
        # is a keyword argument. And all new customers should only use the new way of doing things.

        if using_kwargs_route:
            user_provided_route = route
        elif len(args) >= 1:
            user_provided_route = args[0]
        else:
            user_provided_route = None

        if name is not None:
            user_provided_name = name
        elif using_kwargs_route and len(args) >= 1:
            user_provided_name = args[0]
        else:
            user_provided_name = None

        if handler:
            user_provided_handler = handler
        elif len(args) >= 2:
            user_provided_handler = args[1]
        else:
            user_provided_handler = None

        if not user_provided_route:
            raise ValueError(
                "Missing 'route' parameter in Compose.App constructor (this should be the first argument to the constructor)"
            )

        if not user_provided_handler:
            raise ValueError(
                "Missing 'handler' parameter in Compose.App constructor (this should be the second argument to the constructor)"
            )

        self._route = format_route(user_provided_route)

        try:
            is_valid_route(self._route)
        except ValueError as e:
            raise ValueError("Invalid route: " + self._route + ". " + str(e)) from e

        self.name = user_provided_name or prettify_key(self._route)
        self.handler = user_provided_handler
        self.description = description
        self.hidden = hidden
        self.parent_app_route = parent_app_route
        self.initial_state = initial_state or {}

        if parent_app_route:
            self.parent_app_route = format_route(parent_app_route)
        else:
            self.parent_app_route = None

    @property
    def route(self) -> str:
        return self._route

    def summarize(self) -> dict[str, Any]:
        optional_properties = {
            "parentAppRoute": self.parent_app_route,
            "hidden": self.hidden,
        }

        required_properties: Dict[str, Union[str, bool, None]] = {
            "name": self.name,
            "route": self.route,
            "description": self.description,
        }

        for key, value in optional_properties.items():
            if value is not None:
                required_properties[key] = value

        return required_properties
