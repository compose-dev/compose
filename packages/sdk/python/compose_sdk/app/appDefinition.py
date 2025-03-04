from typing import Callable, Union, Any, Dict

from .route import add_auto_generation_suffix, format_route, is_valid_route


class AppDefinition:
    """
    Create a Compose App.

    ## Parameters
    #### name
        - `str`
        - Required
        - The name of the app. Used to identify the app in the UI, and as the title of the browser tab. For example: "User Management App".

    #### handler
        - `Callable`
        - Required
        - The handler function for the app.

    #### route
        - `str`
        - Optional
        - A unique route to assign to the app and use as the URL slug in the browser. If not provided, the route will be auto-generated based on the app name.
        - Should be one word, e.g. "/user-management-app" or "user-management-app"

    #### parent_app_route
        - `str`
        - Optional
        - If this app is a sub-page of a multi-page app, declare the parent app route here. Declaring this value will:
        - allow this app to inherit permissions from the parent app (e.g. if the parent app is shared with an external email, this app will be too)
        - hide this app in the Compose dashboard so that the dashboard isn't cluttered with sub-pages for a multi-page app. This app will still be available programmatically (e.g. via the `page.link` function) and via the URL. This feature can be overriden by directly setting the `hidden` property to `False`.

    #### description
        - `str`
        - Optional
        - A short description of the app to display on the home page.

    #### hidden
        - `bool`
        - Optional
        - Whether the app should be hidden from the home page.
    """

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
    ):
        if not name:
            raise ValueError("Missing 'name' field in Compose.App constructor")

        if not handler:  # type: ignore
            raise ValueError("Missing 'handler' field in Compose.App constructor")

        self.name = name
        self.handler = handler
        self.description = description
        self.hidden = hidden
        self.parent_app_route = parent_app_route
        self.initial_state = initial_state or {}

        if route is None:
            self._isAutoGeneratedRoute = True
            self._route = add_auto_generation_suffix(format_route(name))
        else:
            self._isAutoGeneratedRoute = False
            self._route = format_route(route)

        if parent_app_route:
            self.parent_app_route = format_route(parent_app_route)
        else:
            self.parent_app_route = None

        try:
            is_valid_route(self._route)
        except ValueError as e:
            raise ValueError("Invalid route: " + str(e)) from e

    @property
    def route(self) -> str:
        return self._route

    @property
    def is_auto_generated_route(self) -> bool:
        return self._isAutoGeneratedRoute

    def set_route(self, route: str, isAutoGenerated: bool) -> None:
        self._route = route
        self._isAutoGeneratedRoute = isAutoGenerated

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
